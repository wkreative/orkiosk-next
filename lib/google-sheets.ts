import { google } from 'googleapis';
import path from 'path';
import { getSettings } from '@/lib/config';

export interface FAQItem {
    question: string;
    answer: string;
}

export async function getChatKnowledgeBase(): Promise<FAQItem[]> {
    try {
        // 1. Try to get ID from AppSettings first (Admin Panel)
        const settings = await getSettings();
        let spreadsheetId = settings.googleSheetId;

        // 2. Fallback to Env Var
        if (!spreadsheetId) {
            spreadsheetId = process.env.GOOGLE_SHEET_ID_CHAT;
        }

        if (!spreadsheetId) {
            console.warn("Google Sheet ID is not defined in Settings or Env. Skipping Sheets integration.");
            return [];
        }

        let auth;
        try {
            // Option A: Env Var (Best for Vercel)
            if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
                const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
                auth = new google.auth.GoogleAuth({
                    credentials,
                    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
                });
            }
            // Option B: Local File (Best for Local Dev)
            else {
                auth = new google.auth.GoogleAuth({
                    keyFile: path.join(process.cwd(), 'serviceAccountKey.json'),
                    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
                });
            }

            const sheets = google.sheets({ version: 'v4', auth });

            // Fetch data from the first sheet (default when sheet name is omitted in A1 notation)
            // We assume columns A and B contain Question and Answer respectively.
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: 'A2:B', // Start from A2 to skip potential headers
            });

            const rows = response.data.values;
            if (!rows || rows.length === 0) {
                console.log('No data found in Google Sheet.');
                return [];
            }

            // Map rows to FAQ objects
            return rows.map((row) => ({
                question: row[0] || '',
                answer: row[1] || '',
            })).filter(item => item.question.trim() !== '' && item.answer.trim() !== '');

        } catch (error: any) {
            console.error('Error fetching from Google Sheets:', error);
            // Throw error so Debug command can see it, or return empty if called normally
            // But since this function signature returns FAQItem[], we should attach the error somehow or just log it.
            // Better strategy: For now, let's log it. 
            // To help the user via /debug, we will rely on the fact that /debug calls this. 
            // Let's attach the specific error to a global var or similar? No, that's messy.
            // Let's just return an empty array but with a special "error" item if we could, but type signature is strict.

            // Revised Strategy: Just console error for now, and update the /debug command to *try/catch* this function call? 
            // No, the function itself catches the error.
            // Let's RE-THROW the error and handle it in the caller (route.ts).
            throw error;
        }
    } catch (error) {
        console.error('Unexpected error in getChatKnowledgeBase:', error);
        return [];
    }
}

export async function diagnoseSheet(): Promise<any> {
    try {
        const settings = await getSettings();
        let spreadsheetId = settings.googleSheetId || process.env.GOOGLE_SHEET_ID_CHAT;

        if (!spreadsheetId) return { error: "No Spreadsheet ID configuration found." };

        let auth;
        // Option A: Env Var
        if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
            const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
            auth = new google.auth.GoogleAuth({
                credentials,
                scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
            });
        }
        // Option B: Local File
        else {
            auth = new google.auth.GoogleAuth({
                keyFile: path.join(process.cwd(), 'serviceAccountKey.json'),
                scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
            });
        }

        const sheets = google.sheets({ version: 'v4', auth });

        // 1. Get Metadata (Title, Sheets)
        const meta = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetTitle = meta.data.properties?.title;
        const sheetNames = meta.data.sheets?.map(s => s.properties?.title) || [];

        // 2. Try to read from the first sheet explicitly
        let firstSheetData: any[] | null | undefined = null;
        if (sheetNames.length > 0) {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetNames[0]}!A2:B`, // Explicitly use first sheet name
            });
            firstSheetData = response.data.values;
        }

        return {
            title: sheetTitle,
            sheets: sheetNames,
            firstSheetName: sheetNames[0],
            rowCount: firstSheetData?.length || 0,
            sample: firstSheetData ? firstSheetData.slice(0, 3) : null
        };

    } catch (error: any) {
        return { error: error.message || JSON.stringify(error) };
    }
}
