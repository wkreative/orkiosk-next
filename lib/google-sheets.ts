import { google } from 'googleapis';
import path from 'path';

export interface FAQItem {
    question: string;
    answer: string;
}

export async function getChatKnowledgeBase(): Promise<FAQItem[]> {
    try {
        const spreadsheetId = process.env.GOOGLE_SHEET_ID_CHAT;
        if (!spreadsheetId) {
            console.warn("GOOGLE_SHEET_ID_CHAT is not defined. Skipping Sheets integration.");
            return [];
        }

        const auth = new google.auth.GoogleAuth({
            keyFile: path.join(process.cwd(), 'serviceAccountKey.json'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

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

    } catch (error) {
        console.error('Error fetching from Google Sheets:', error);
        // Return empty array to default to system prompt knowledge only if Sheets fails
        return [];
    }
}
