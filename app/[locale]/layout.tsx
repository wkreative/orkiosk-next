export function generateStaticParams() {
    return [
        { locale: 'es' },
        { locale: 'en' },
    ];
}

import ChatWidget from '@/components/ChatWidget';

export default function LocaleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <ChatWidget />
        </>
    );
}
