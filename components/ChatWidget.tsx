'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function ChatWidget() {
    const pathname = usePathname();

    // Do not show widget on chat pages or admin panel to avoid clutter
    if (pathname?.startsWith('/chat') || pathname?.includes('/admin')) {
        return null;
    }

    return (
        <Link
            href="/chat"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
        >
            <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
            </span>
        </Link>
    );
}
