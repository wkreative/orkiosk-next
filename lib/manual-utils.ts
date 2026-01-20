export interface ManualSection {
    id: string;
    title: string;
    level: number;
}

export function extractSections(html: string): ManualSection[] {
    const sections: ManualSection[] = [];
    // Match h2 and h3 tags
    const headingRegex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
    let match;

    while ((match = headingRegex.exec(html)) !== null) {
        const level = parseInt(match[1]);
        const rawTitle = match[2].replace(/<[^>]*>/g, '').trim();
        const id = rawTitle
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        sections.push({
            id,
            title: rawTitle,
            level,
        });
    }

    return sections;
}

export function injectIds(html: string): string {
    // Replace <h2...>Title</h2> with <h2 id="title"...>Title</h2>
    return html.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, content) => {
        const id = content
            .replace(/<[^>]*>/g, '')
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Check if id already exists in attrs
        if (attrs.includes('id=')) return match;

        return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
    });
}
