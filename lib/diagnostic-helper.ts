import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Diagnostic helper to check Firestore connection and list all posts
 * This is a temporary file for debugging purposes
 */
export async function diagnosePosts() {
    console.log('🔍 Starting Firestore Diagnostics...');

    try {
        // Test 1: Check if we can connect to Firestore
        console.log('Test 1: Checking Firestore connection...');
        const postsRef = collection(db, 'posts');
        console.log('✅ Firestore collection reference created');

        // Test 2: Fetch all documents without any filters
        console.log('Test 2: Fetching all posts (no filters)...');
        const snapshot = await getDocs(postsRef);
        console.log(`✅ Query executed. Found ${snapshot.docs.length} documents`);

        // Test 3: Log each document's structure
        console.log('Test 3: Analyzing document structure...');
        snapshot.docs.forEach((doc, index) => {
            const data = doc.data();
            console.log(`\nDocument ${index + 1}:`, {
                id: doc.id,
                title: data.title,
                slug: data.slug,
                date: data.date,
                hasDate: !!data.date,
                dateType: typeof data.date,
                excerpt: data.excerpt?.substring(0, 50) + '...',
                category: data.category,
            });
        });

        return {
            success: true,
            postsFound: snapshot.docs.length,
            docs: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        };
    } catch (error) {
        console.error('❌ Diagnostic Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
