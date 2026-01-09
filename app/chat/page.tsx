'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push('/chat/login');
            } else {
                setUser(currentUser);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-500 text-sm">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-zinc-950">
            <header className="px-6 py-4 border-b bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                        AI
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">Orkiosk Assistant</h1>
                        <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => auth.signOut()}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
                >
                    Cerrar Sesión
                </button>
            </header>
            <div className="flex-1 overflow-hidden relative">
                <ChatInterface />
            </div>
        </div>
    );
}
