import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    deleteDoc,
    doc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface Comment {
    id: string;
    slug: string;
    author: string;
    content: string;
    createdAt: Timestamp | null;
    parentId?: string | null;
    replies?: Comment[];
}

const COMMENTS_COLLECTION = 'comments';

/**
 * Adds a new comment or reply to a blog post.
 */
export async function addComment(
    slug: string,
    author: string,
    content: string,
    parentId?: string | null
): Promise<string> {
    if (!slug || !author.trim() || !content.trim()) {
        throw new Error('Missing required fields');
    }

    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
        slug,
        author: author.trim(),
        content: content.trim(),
        createdAt: serverTimestamp(),
        parentId: parentId || null,
    });

    return docRef.id;
}

/**
 * Retrieves all comments for a specific blog post and organizes them in a threaded structure.
 */
export async function getComments(slug: string): Promise<Comment[]> {
    const q = query(
        collection(db, COMMENTS_COLLECTION),
        where('slug', '==', slug),
        orderBy('createdAt', 'asc') // Changed to asc for proper threading
    );

    const querySnapshot = await getDocs(q);
    const allComments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Comment));

    // Build threaded structure
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create map and initialize replies array
    allComments.forEach(comment => {
        comment.replies = [];
        commentMap.set(comment.id, comment);
    });

    // Second pass: organize into tree structure
    allComments.forEach(comment => {
        if (comment.parentId) {
            const parent = commentMap.get(comment.parentId);
            if (parent) {
                parent.replies!.push(comment);
            } else {
                // Parent not found, treat as root
                rootComments.push(comment);
            }
        } else {
            rootComments.push(comment);
        }
    });

    // Sort root comments by newest first, but keep replies in chronological order
    return rootComments.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
    });
}

/**
 * Deletes a comment by ID.
 * Security rules should ensure only admins can perform this.
 */
export async function deleteComment(commentId: string): Promise<void> {
    if (!commentId) return;

    await deleteDoc(doc(db, COMMENTS_COLLECTION, commentId));
}
