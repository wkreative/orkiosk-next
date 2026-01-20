import { db } from './firebase';
import { collection, query, orderBy, getDocs, doc, getDoc, where, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export interface Page {
    id?: string;
    title: string;
    slug: string;
    content: string;
    // SEO Fields
    focalKeyword?: string;
    metaDescription?: string;
    seoTitle?: string;
    noIndex?: boolean;
    // Status
    published: boolean;
    // Translations
    titleEn?: string;
    contentEn?: string;
    focalKeywordEn?: string;
    metaDescriptionEn?: string;
    seoTitleEn?: string;
    createdAt?: any;
    updatedAt?: any;
}

const COLLECTION = 'pages';

export async function getAllPages(): Promise<Page[]> {
    try {
        const pagesRef = collection(db, COLLECTION);
        const q = query(pagesRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Page[];
    } catch (error) {
        console.error('Error fetching pages:', error);
        return [];
    }
}

export async function getPublishedPages(): Promise<Page[]> {
    try {
        const pagesRef = collection(db, COLLECTION);
        const q = query(pagesRef, where('published', '==', true));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Page[];
    } catch (error) {
        console.error('Error fetching published pages:', error);
        return [];
    }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
    try {
        const pagesRef = collection(db, COLLECTION);
        const q = query(pagesRef, where('slug', '==', slug));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data(),
        } as Page;
    } catch (error) {
        console.error('Error fetching page:', error);
        return null;
    }
}

export async function savePage(page: Page): Promise<string> {
    try {
        const pageRef = doc(db, COLLECTION, page.slug);
        await setDoc(pageRef, {
            ...page,
            updatedAt: serverTimestamp(),
            createdAt: page.createdAt || serverTimestamp(),
        });
        return page.slug;
    } catch (error) {
        console.error('Error saving page:', error);
        throw error;
    }
}

export async function deletePage(slug: string): Promise<void> {
    try {
        const pageRef = doc(db, COLLECTION, slug);
        await deleteDoc(pageRef);
    } catch (error) {
        console.error('Error deleting page:', error);
        throw error;
    }
}
