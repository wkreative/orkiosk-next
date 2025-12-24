'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { LayoutDashboard, FileText, PlusCircle, LogOut, Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'es';

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push(`/${locale}/admin1/login`);
            } else {
                setUser(user);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router, locale]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push(`/${locale}/admin1/login`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!user) return null;

    const navItems = [
        { name: 'Dashboard', href: `/${locale}/admin1/dashboard`, icon: LayoutDashboard },
        { name: 'Posts', href: `/${locale}/admin1/dashboard`, icon: FileText },
        { name: 'Nuevo Post', href: `/${locale}/admin1/posts/new`, icon: PlusCircle },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <Link href={`/${locale}/admin1/dashboard`} className="text-xl font-bold text-primary-600">
                        Orkiosk Admin
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary-50 text-primary-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 md:hidden">
                    <Link href={`/${locale}/admin1/dashboard`} className="text-xl font-bold text-primary-600">
                        Orkiosk
                    </Link>
                    <button onClick={handleLogout} className="text-red-600">
                        <LogOut className="w-6 h-6" />
                    </button>
                </header>
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
