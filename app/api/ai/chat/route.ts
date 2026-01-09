import { NextRequest, NextResponse } from 'next/server';
import { getSettings } from '@/lib/config';
import { getChatKnowledgeBase } from '@/lib/google-sheets';

const BASE_SYSTEM_PROMPT = `
Eres el asistente virtual experto de Orkiosk.
Tu objetivo es ayudar a los usuarios (clientes/dueños de restaurantes) a resolver dudas sobre:
1. Funcionamiento de los quioscos de autoservicio.
2. Uso del Panel de Administración.
3. Configuración de productos, menús y precios.
4. Resolución de problemas técnicos básicos.

DIRECTRICES:
- Responde siempre en Español, con un tono profesional pero amable.
- Sé conciso y directo. Usa listas (bullets) si es necesario.
- Si no sabes la respuesta, di que no tienes esa información y sugiere contactar a soporte técnico.
- NO inventes información.
- Basa tus respuestas principalmente en la BASE DE CONOCIMIENTO provista a continuación. Si la respuesta no está ahí, usa tu conocimiento general sobre sistemas POS y Kioscos, pero con cautela.
`;

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
        }

        // 1. Get Knowledge Base
        const faqItems = await getChatKnowledgeBase();
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
