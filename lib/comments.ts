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
    createdAt: Timestamp | null; // Can be null immediately after optimistic update
}

const COMMENTS_COLLECTION = 'comments';

/**
 * Adds a new comment to a blog post.
 */
export async function addComment(slug: string, author: string, content: string): Promise<string> {
    if (!slug || !author.trim() || !content.trim()) {
        throw new Error('Missing required fields');
    }

    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
        slug,
        author: author.trim(),
        content: content.trim(),
        createdAt: serverTimestamp(),
    });

    return docRef.id;
}

/**
 * Retrieves all comments for a specific blog post, ordered by date (newest first).
 */
export async function getComments(slug: string): Promise<Comment[]> {
    const q = query(
        collection(db, COMMENTS_COLLECTION),
        where('slug', '==', slug),
        orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Comment));
}

/**
 * Deletes a comment by ID.
 * Security rules should ensure only admins can perform this.
 */
export async function deleteComment(commentId: string): Promise<void> {
    if (!commentId) return;

    await deleteDoc(doc(db, COMMENTS_COLLECTION, commentId));
}
