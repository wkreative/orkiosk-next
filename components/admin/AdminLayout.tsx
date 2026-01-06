'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { LayoutDashboard, FileText, LogOut, Loader2, Settings, MessageSquare } from 'lucide-react';

// Internal component for Sidebar Navigation to safely use useSearchParams
function SidebarNav({ navItems }: { navItems: any[] }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Helper to determine if a nav item is active
    const isItemActive = (item: { href: string }) => {
        const [itemPath, itemQuery] = item.href.split('?');
        const isPathMatch = pathname === itemPath;

        if (!isPathMatch) return false;

        // If the menu item has a query param (e.g. ?tab=posts)
        if (itemQuery) {
            const params = new URLSearchParams(itemQuery);
            const tabParam = params.get('tab');
            return searchParams.get('tab') === tabParam;
        }

        // If menu item has NO query param (e.g. Dashboard overview)
        // It should match only if there is NO tab param found in URL, or if tab is 'overview'
        if (itemPath.endsWith('/dashboard')) {
            const currentTab = searchParams.get('tab');
            return !currentTab || currentTab === 'overview';
        }

        return true;
    };

    return (
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Menu</p>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isItemActive(item);
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                            ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm ring-1 ring-primary-100'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <span>{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

// Fallback for Suspense
function SidebarNavFallback({ navItems }: { navItems: any[] }) {
    const pathname = usePathname();
    return (
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Menu</p>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href; // Simple fallback check
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                            ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm ring-1 ring-primary-100'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <span>{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'es';

    useEffect(() => {
        // Skip auth check on login page
        if (pathname.includes('/login')) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push(`/${locale}/admin1/login`);
            } else {
                setUser(user);
            }
            setLoading(false);
        });

        // Session Timeout Logic (1 Hour)
        const TIMEOUT_MS = 60 * 60 * 1000; // 1 hour
        let lastActivity = Date.now();
        let timeoutId: NodeJS.Timeout;

        const checkInactivity = () => {
            if (Date.now() - lastActivity > TIMEOUT_MS) {
                handleLogout();
            }
        };

        const updateActivity = () => {
            lastActivity = Date.now();
            // Debounce the check slightly if needed, but here just resetting is fine
            // We can also clear/reset a timeout instead of polling
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                handleLogout();
            }, TIMEOUT_MS);
        };

        // Initial setup
        timeoutId = setTimeout(() => {
            handleLogout();
        }, TIMEOUT_MS);

        // Listeners for activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => document.addEventListener(event, updateActivity));

        // Cleanup
        return () => {
            unsubscribe();
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(event => document.removeEventListener(event, updateActivity));
        };
    }, [router, locale, pathname]);

    // If on login page, render children without sidebar/layout
    if (pathname.includes('/login')) {
        return <>{children}</>;
    }

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
        { name: 'Posts', href: `/${locale}/admin1/dashboard?tab=posts`, icon: FileText },
        { name: 'Páginas', href: `/${locale}/admin1/pages`, icon: FileText },
        { name: locale === 'es' ? 'Comentarios' : 'Comments', href: `/${locale}/admin1/comments`, icon: MessageSquare },
        { name: 'Settings', href: `/${locale}/admin1/settings`, icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar - Fixed/Sticky */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen sticky top-0 shadow-sm z-30">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0 h-16">
                    <Link href={`/${locale}/admin1/dashboard`} className="flex flex-col">
                        <span className="text-xl font-black text-gray-900 tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>Orkiosk</span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Admin Panel</span>
                    </Link>
                </div>

                <React.Suspense fallback={<SidebarNavFallback navItems={navItems} />}>
                    <SidebarNav navItems={navItems} />
                </React.Suspense>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-gray-600 hover:text-red-600 hover:bg-red-50 w-full px-4 py-2.5 rounded-lg transition-all duration-200 group"
                    >
                        <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                    {user && (
                        <div className="mt-3 px-4 pt-3 border-t border-gray-200/60">
                            <p className="text-xs text-gray-400">Logueado como</p>
                            <p className="text-sm font-semibold text-gray-700 truncate">{user.email}</p>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-20 md:hidden shadow-sm">
                    <Link href={`/${locale}/admin1/dashboard`} className="flex flex-col">
                        <span className="text-lg font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Orkiosk</span>
                    </Link>
                    <button onClick={handleLogout} className="p-2 text-gray-500 hover:bg-gray-100 rounded-md">
                        <LogOut className="w-5 h-5" />
                    </button>
                </header>

                <div className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
