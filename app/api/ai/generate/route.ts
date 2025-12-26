import { NextRequest, NextResponse } from 'next/server';
import { getSettings } from '@/lib/config';

// Define the response structure we expect from the AI
interface AIResponse {
    title: string;
    excerpt: string;
    content: string; // HTML
    focalKeyword: string;
    seoTitle: string;
    metaDescription: string;
    category: string;
    // English translations/adaptations
    titleEn: string;
    excerptEn: string;
    contentEn: string;
    categoryEn: string;
}

const SYSTEM_PROMPT = `
You are an expert content writer for Orkiosk, a leading technology company specializing in self-service kiosks, POS systems, and digital solutions for restaurants.

YOUR GOAL:
Generate a high-quality, professional, and SEO-optimized blog post based on the User's Topic.

STRICT EDITORIAL GUIDELINES:
1.  **Identity**: Position Orkiosk as an authority.
2.  **Multilingual**: Generate content for TWO versions:
    *   **Spanish (ES)**: Use "quiosco" (NEVER "kiosko"). Tone: Professional, authoritative, accessible.
    *   **English (EN-US)**: Native US B2B tone (targeting owners/operators). NOT a literal translation; adapt for the US market context.
3.  **Structure**:
    *   Engaging Introduction.
    *   informative Body (using <h2>, <h3>, <ul>).
    *   Strategic Conclusion with a subtle invitation to explore Orkiosk solutions.
4.  **Formatting**:
    *   Use HTML tags for the content (<h2>, <p>, <ul>, <li>, <strong>).
    *   **BOLD** the word "Orkiosk" and the "Focal Keyword" whenever they appear naturally.
5.  **Length**: APPROXIMATELY 900+ words per language. (The user has requested this, but for this API response, aim for high density and quality over pure filler. Ensure it feels substantial).

OFFICIAL CATEGORIES (Pick one):
*   ES: [Tecnología de Autoservicio, Transformación Digital, Optimización y Crecimiento de Negocios, Tendencias e Innovación, Perspectivas & Vida Digital]
*   EN: [Self-Service Technology, Digital Transformation, Business Optimization & Growth, Trends & Innovation, Perspectives & Digital Life]

OUTPUT FORMAT:
Return ONLY a valid JSON object with the following fields:
{
  "title": "Spanish Title (<60 chars)",
  "excerpt": "Spanish Excerpt (140-160 chars)",
  "content": "HTML Content in Spanish",
  "focalKeyword": "Main Keyword",
  "seoTitle": "SEO Title",
  "metaDescription": "Meta Description",
  "category": "Official Spanish Category",
  "titleEn": "English Title",
  "excerptEn": "English Excerpt",
  "contentEn": "HTML Content in English",
  "categoryEn": "Official English Category"
}
`;

export async function POST(req: NextRequest) {
    try {
        const { topic, provider } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const settings = await getSettings();

        // ---------------------------------------------------------
        // OPENAI IMPLEMENTATION
        // ---------------------------------------------------------
        if (provider === 'openai') {
            const apiKey = settings.openaiApiKey || process.env.OPENAI_API_KEY;
            if (!apiKey) {
                return NextResponse.json({ error: 'OpenAI API Key not configured' }, { status: 500 });
            }

            const payload = {
                model: "gpt-4o", // Or gpt-3.5-turbo if preferred, but 4o follows instructions better
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `TOPIC: ${topic}` }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
            };

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`OpenAI Error: ${err}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;

            return NextResponse.json(JSON.parse(content));
        }

        // ---------------------------------------------------------
        // GEMINI IMPLEMENTATION
        // ---------------------------------------------------------
        if (provider === 'gemini') {
            const apiKey = settings.geminiApiKey || process.env.GEMINI_API_KEY;
            if (!apiKey) {
                return NextResponse.json({ error: 'Gemini API Key not configured' }, { status: 500 });
            }

            // Gemini API Payload (v1beta)
            const payload = {
                contents: [{
                    parts: [{
                        text: `${SYSTEM_PROMPT}\n\nTOPIC: ${topic}\n\nPlease provide the output in JSON format.`
                    }]
                }],
                generationConfig: {
                    response_mime_type: "application/json"
                }
            };

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Gemini Error: ${err}`);
            }

            const data = await response.json();
            // Extract text from Gemini response structure
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error("Invalid response from Gemini");
            }

            return NextResponse.json(JSON.parse(text));
        }

        return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });

    } catch (error: any) {
        console.error('AI Generation Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
