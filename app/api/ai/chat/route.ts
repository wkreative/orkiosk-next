import { NextRequest, NextResponse } from 'next/server';
import { getSettings } from '@/lib/config';
import { getChatKnowledgeBase, diagnoseSheet } from '@/lib/google-sheets';

const BASE_SYSTEM_PROMPT = `
ERES EL ASISTENTE VIRTUAL EXPERTO DE ORKIOSK.
Tu misión principal es aclarar dudas de clientes y propietarios de restaurantes sobre el ecosistema Orkiosk (Kioscos, Panel de Administración, POS).

INSTRUCCIONES DE CONOCIMIENTO (MODO DE OPERACIÓN):
1.  **Fuente de Verdad**: Se te proporcionará una "BASE DE CONOCIMIENTO" dinámica proveniente de una hoja de cálculo. Esta contiene pares de Pregunta (Columna A) y Respuesta (Columna B).
2.  **Prioridad Absoluta**: Debes basar tus respuestas EXCLUSIVAMENTE en esa información provista en el contexto siempre que sea posible.
3.  **Búsqueda Semántica**: Si el usuario pregunta algo que no coincide palabra por palabra con la columna A, usa tu inteligencia para encontrar la pregunta más cercana en significado dentro de la base de conocimiento y responde con la información de la columna B correspondiente.

DIRECTRICES DE RESPUESTA:
- **Tono**: Profesional, empático, corporativo y resolutivo. Habla en español neutro/latinoamericano.
- **Formato**: Usa negritas para conceptos clave y listas para pasos a seguir.
- **Límites**:
    - Si la respuesta NO está en la base de conocimiento provista y no puedes deducirla de manera segura con tu conocimiento general sobre kioscos (sin inventar funciones específicas de Orkiosk que no conozcas), responde: "Disculpa, no tengo información específica sobre eso en este momento. Por favor contacta a soporte directamente."
    - NUNCA menciones "hoja de cálculo", "celdas", "columnas" o "contexto inyectado". Para el usuario, tú simplemente "sabes" la información.

TU OBJETIVO ES SOLUCIONAR EL PROBLEMA DEL USUARIO RÁPIDAMENTE.
`;

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
        }

        // --- DEBUG COMMAND HANDLER ---
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'user' && (lastMessage.content === '/debug' || lastMessage.content === '/status')) {
            const settings = await getSettings();
            const diagnosis = await diagnoseSheet();

            const debugInfo = `
**🔍 Deep System Diagnosis**

*   **Spreadsheet Title**: ${diagnosis.title || 'N/A'}
*   **Sheet Names Found**: ${diagnosis.sheets ? diagnosis.sheets.join(', ') : 'None'}
*   **Targeting Sheet**: "${diagnosis.firstSheetName || 'Unknown'}"
*   **Rows Read**: ${diagnosis.rowCount}
*   **Error Status**: ${diagnosis.error ? `❌ ${diagnosis.error}` : '✅ No Errors'}

**Sample Data (First 3 Rows of "${diagnosis.firstSheetName}")**:
${diagnosis.sample ? diagnosis.sample.map((row: any[], i: number) => `${i + 1}. [A] ${row[0]?.substring(0, 20)}... | [B] ${row[1]?.substring(0, 20)}...`).join('\n') : '(No data found)'}

**Configuration**:
*   ID: ${settings.googleSheetId ? '...' + settings.googleSheetId.slice(-4) : 'Env'}
*   System Prompt: ${settings.chatSystemPrompt ? 'Custom' : 'Default'}
            `.trim();

            return NextResponse.json({ content: debugInfo });
        }
        // -----------------------------

        // 1. Get Knowledge Base
        let faqItems: any[] = [];
        try {
            faqItems = await getChatKnowledgeBase();
        } catch (error) {
            console.error("Failed to load knowledge base:", error);
            // Continue with empty knowledge base
        }

        let knowledgeBaseText = "";
        if (faqItems.length > 0) {
            knowledgeBaseText = "\n\n### BASE DE CONOCIMIENTO (Q&A de Google Sheets):\n" +
                faqItems.map(item => `Pregunta: ${item.question}\nRespuesta: ${item.answer}`).join("\n---\n") + "\n";
        } else {
            console.log("No Knowledge Base loaded (empty or error).");
        }

        // 2. Get Settings (API Keys & Prompt)
        const settings = await getSettings();
        const finalSystemPrompt = `${settings.chatSystemPrompt || BASE_SYSTEM_PROMPT}${knowledgeBaseText}`;

        const apiKey = settings.openaiApiKey || process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'OpenAI API Key not configured' }, { status: 500 });
        }

        // 3. Call OpenAI
        const apiMessages = [
            { role: "system", content: finalSystemPrompt },
            ...messages
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: apiMessages,
                temperature: 0.3,
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("OpenAI Error:", err);
            throw new Error(`OpenAI Error: ${err}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        return NextResponse.json({ content });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
