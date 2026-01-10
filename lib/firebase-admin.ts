import * as admin from 'firebase-admin';
import path from 'path';

// Singleton initialization to prevent "already initialized" errors in dev
if (!admin.apps.length) {
    let credential;

    // 1. Try Env Var (Vercel Production)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        try {
            const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
            credential = admin.credential.cert(serviceAccount);
        } catch (error) {
            console.error('Error parsing GOOGLE_SERVICE_ACCOUNT_KEY:', error);
        }
    }
    // 2. Fallback to Local File (Development)
    else {
        try {
            const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
            credential = admin.credential.cert(require(serviceAccountPath));
        } catch (error) {
            console.warn('No serviceAccountKey.json found and no GOOGLE_SERVICE_ACCOUNT_KEY env var.');
        }
    }

    if (credential) {
        admin.initializeApp({
            credential: credential
        });
    }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
