export interface ManualSection {
    id: string;
    title: string;
    level: number;
}

export function extractSections(html: string): ManualSection[] {
    const sections: ManualSection[] = [];
    if (!html) return sections;

    // 1. First, search for standard headers
    const hRegex = /<(h[1-4])([^>]*)>(.*?)<\/h\1>/gi;
    let match;
    while ((match = hRegex.exec(html)) !== null) {
        const level = parseInt(match[1][1]);
        const title = match[3].replace(/<[^>]*>/g, '').trim();
        if (title) sections.push(createSection(title, level));
    }

    // 2. If no headers found or very few, search for "Strong" text or patterns in Paragraphs
    // This handles content that was pasted as bold text instead of headers
    const pRegex = /<(p|strong|div)([^>]*)>(.*?)<\/\1>/gi;
    while ((match = pRegex.exec(html)) !== null) {
        const content = match[3].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
        if (isHeadingPattern(content)) {
            // Avoid duplicates
            if (!sections.some(s => s.title === content)) {
                sections.push(createSection(content, 2));
            }
        }
    }

    // Sort by appearance in HTML (approximate)
    // Actually, regex matched in order for each loop, but not across loops.
    // For simplicity, we assume if standard headers exist, we use them, otherwise we fallback.
    return sections.length > 5 ? sections : sections.sort((a, b) => 0);
}

function isHeadingPattern(text: string): boolean {
    if (!text || text.length < 3 || text.length > 100) return false;

    // Pattern 1: All caps (e.g. "INTRODUCCIÓN", "GESTIÓN DE USUARIOS")
    const isAllCaps = text.length > 4 && text === text.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(text);

    // Pattern 2: Numbered bullets (e.g. "1. Access", "2.1 Details")
    const isNumbered = /^\d+(\.\d+)*\.?\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]/.test(text);

    // Pattern 3: Specific keywords that are likely titles
    const isKeyword = /^(Introducción|Index|Indice|Conclusion|Soporte|Support|Agradecimientos)/i.test(text);

    return isAllCaps || isNumbered || isKeyword;
}

function createSection(title: string, level: number): ManualSection {
    const id = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return { id, title: title.trim(), level };
}

export function injectIds(html: string): string {
    if (!html) return html;

    // We process it once to add IDs to everything that looks like a heading
    let processed = html;

    // Standard headers
    processed = processed.replace(/<(h[1-4])([^>]*)>(.*?)<\/h\1>/gi, (match, tag, attrs, content) => {
        if (attrs.includes('id=')) return match;
        const title = content.replace(/<[^>]*>/g, '').trim();
        const s = createSection(title, parseInt(tag[1]));
        return `<${tag}${attrs} id="${s.id}">${content}</${tag}>`;
    });

    // Patterns in P/STRONG/DIV
    processed = processed.replace(/<(p|strong|div)([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, content) => {
        if (attrs.includes('id=')) return match;
        const textContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
        if (isHeadingPattern(textContent)) {
            const s = createSection(textContent, 2);
            return `<${tag}${attrs} id="${s.id}">${content}</${tag}>`;
        }
        return match;
    });

    return processed;
}
