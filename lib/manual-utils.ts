export interface ManualSection {
    id: string;
    title: string;
    level: number;
}

export function extractSections(html: string): ManualSection[] {
    const sections: ManualSection[] = [];
    // Match h1, h2, h3, h4 tags
    const headingRegex = /<h([1-4])[^>]*>(.*?)<\/h\1>/gi;
    let match;

    while ((match = headingRegex.exec(html)) !== null) {
        const level = parseInt(match[1]);
        const content = match[2];

        // Remove nested HTML tags from title
        const rawTitle = content.replace(/<[^>]*>/g, '').trim();

        if (!rawTitle) continue;

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
    // Replace <h1/2/3/4...>Title</h1> with <h1/2/3/4 id="title"...>Title</h1>
    return html.replace(/<h([1-4])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, content) => {
        // If it already has an ID, don't touch it
        if (attrs.includes('id=')) return match;

        const rawTitle = content.replace(/<[^>]*>/g, '').trim();
        const id = rawTitle
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
    });
}
