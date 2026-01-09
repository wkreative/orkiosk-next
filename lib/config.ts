import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface AppSettings {
    openaiApiKey?: string;
    geminiApiKey?: string;
    // Advanced AI Config
    systemPrompt?: string;
    aiModel?: string; // 'gpt-4o', 'gpt-3.5-turbo', 'gemini-pro'
    maxTokens?: number;
    temperature?: number;
    // Integration Config
    googleSheetId?: string;
    // Chat Config
    chatSystemPrompt?: string;
}

const SETTINGS_COLLECTION = 'settings';
const API_KEYS_DOC = 'api_keys';

export async function getSettings(): Promise<AppSettings> {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, API_KEYS_DOC);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as AppSettings;
        } else {
            return {};
        }
    } catch (error) {
        console.error('Error fetching settings:', error);
        return {};
    }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, API_KEYS_DOC);
        await setDoc(docRef, settings, { merge: true });
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
}
