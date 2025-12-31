import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface AppSettings {
    enableComments: boolean;
}

const SETTINGS_COLLECTION = 'settings';
const GENERAL_DOC_ID = 'general';

export async function getSettings(): Promise<AppSettings> {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as AppSettings;
        } else {
            // Return default settings if not found
            return { enableComments: true };
        }
    } catch (error) {
        console.error('Error fetching settings:', error);
        return { enableComments: true };
    }
}

export async function updateSettings(settings: Partial<AppSettings>): Promise<void> {
    const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_DOC_ID);

    // Use setDoc with merge: true to create if not exists or update fields
    await setDoc(docRef, settings, { merge: true });
}
