'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Edit2, Trash2, Plus, Search, Eye, Loader2, FileText } from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

export default function DashboardPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const params = useParams();
    const searchParams = useSearchParams();
    const locale = params?.locale || 'es';
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState<'overview' | 'posts'>(tabFromUrl === 'posts' ? 'posts' : 'overview');

    // Update tab when URL changes
    useEffect(() => {
        setActiveTab(tabFromUrl === 'posts' ? 'posts' : 'overview');
    }, [tabFromUrl]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch posts
            const postsQuery = query(collection(db, 'posts'), orderBy('date', 'desc'));
            const postsSnapshot = await getDocs(postsQuery);
            const postsData = postsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsData);

            // Fetch pages
            try {
                const pagesQuery = query(collection(db, 'pages'), orderBy('createdAt', 'desc'));
                const pagesSnapshot = await getDocs(pagesQuery);
                const pagesData = pagesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPages(pagesData);
            } catch (e) {
                console.log('No pages collection yet');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`¿Estás seguro de que quieres eliminar "${title}"?`)) {
            try {
                await deleteDoc(doc(db, 'posts', id));
                setPosts(posts.filter(post => post.id !== id));
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Error al eliminar el post');
            }
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats calculations
    const totalPosts = posts.length;
    const totalPages = pages.length;
    const publishedPages = pages.filter(p => p.published).length;
    const postsWithEnglish = posts.filter(p => p.titleEn).length;
    const recentPosts = posts.slice(0, 5);
    const recentPages = pages.slice(0, 3);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
                    <p className="text-gray-500 font-medium animate-pulse">Cargando dashboard...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header with Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Bienvenido al panel de administración de Orkiosk</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'overview'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Resumen
                        </button>
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'posts'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Publicaciones
                        </button>
                    </div>
                </div>

                {activeTab === 'overview' ? (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Total Posts */}
                            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-xl shadow-primary-200">
                                <p className="text-primary-100 text-sm font-medium">Total Posts</p>
                                <p className="text-4xl font-bold mt-2">{totalPosts}</p>
                                <p className="text-sm text-primary-100 mt-4">Publicaciones del blog</p>
                            </div>

                            {/* Total Pages */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <p className="text-gray-500 text-sm font-medium">Páginas</p>
                                <p className="text-4xl font-bold mt-2 text-gray-900">{totalPages}</p>
                                <p className="text-sm text-green-600 mt-4">{publishedPages} publicadas</p>
                            </div>

                            {/* Bilingual Content */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <p className="text-gray-500 text-sm font-medium">Bilingües</p>
                                <p className="text-4xl font-bold mt-2 text-gray-900">{postsWithEnglish}</p>
                                <p className="text-sm text-gray-500 mt-4">Posts con traducción EN</p>
                            </div>

                            {/* Analytics Placeholder */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">
                                <p className="text-gray-400 text-sm font-medium">Analytics</p>
                                <p className="text-4xl font-bold mt-2">—</p>
                                <p className="text-sm text-gray-400 mt-4">Google Analytics</p>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Recent Posts - takes 2 columns */}
                            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="font-bold text-gray-900">Publicaciones Recientes</h2>
                                    <Link
                                        href={`/${locale}/admin1/posts/new`}
                                        className="text-sm text-primary-600 font-medium hover:text-primary-700"
                                    >
                                        + Nueva
                                    </Link>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {recentPosts.length > 0 ? recentPosts.map((post) => (
                                        <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{post.title}</p>
                                                <div className="flex items-center space-x-3 mt-1">
                                                    <span className="text-xs text-gray-400">{post.category || 'Sin categoría'}</span>
                                                    {post.titleEn && (
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">EN</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1 ml-4">
                                                <button
                                                    onClick={() => window.open(`/${locale}/blog/${post.slug}`, '_blank')}
                                                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/${locale}/admin1/posts/edit?id=${post.id}`}
                                                    className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-8 text-center text-gray-500">
                                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p>No hay publicaciones aún</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Recent Pages */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                        <h2 className="font-bold text-gray-900">Páginas Recientes</h2>
                                        <Link
                                            href={`/${locale}/admin1/pages/new`}
                                            className="text-sm text-primary-600 font-medium hover:text-primary-700"
                                        >
                                            + Nueva
                                        </Link>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {recentPages.length > 0 ? recentPages.map((page) => (
                                            <div key={page.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">{page.title}</p>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${page.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {page.published ? 'Publicada' : 'Borrador'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-1 ml-4">
                                                    <Link
                                                        href={`/${locale}/admin1/pages/edit?slug=${page.slug}`}
                                                        className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-6 text-center text-gray-500">
                                                <p className="text-sm">No hay páginas aún</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <h2 className="font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
                                    <div className="space-y-3">
                                        <Link
                                            href={`/${locale}/admin1/posts/new`}
                                            className="flex items-center p-3 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors"
                                        >
                                            <Plus className="w-5 h-5 mr-3" />
                                            <span className="font-medium">Nuevo Post</span>
                                        </Link>
                                        <Link
                                            href={`/${locale}/admin1/pages/new`}
                                            className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                                        >
                                            <Plus className="w-5 h-5 mr-3" />
                                            <span className="font-medium">Nueva Página</span>
                                        </Link>
                                        <a
                                            href={`/${locale}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center p-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                                        >
                                            <Eye className="w-5 h-5 mr-3" />
                                            <span className="font-medium">Ver Sitio Web</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Posts Tab - Full posts list with search */
                    <>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por título o slug..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-white"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-white border border-gray-200 px-6 py-3 rounded-xl flex items-center space-x-3">
                                    <span className="text-gray-500 font-medium">Total:</span>
                                    <span className="text-primary-600 font-bold text-lg">{filteredPosts.length}</span>
                                </div>
                                <button
                                    onClick={() => window.location.href = `/${locale}/admin1/posts/new`}
                                    className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="font-bold">Nueva Entrada</span>
                                </button>
                            </div>
                        </div>

                        {/* Posts Table */}
                        {filteredPosts.length > 0 ? (
                            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Entrada</th>
                                                <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Categoría</th>
                                                <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Idiomas</th>
                                                <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredPosts.map((post) => (
                                                <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-900 line-clamp-1">{post.title}</span>
                                                            <span className="text-xs text-gray-400 mt-1 font-mono">{post.slug}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full uppercase tracking-tighter">
                                                            {post.category || 'General'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center space-x-1">
                                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded">ES</span>
                                                            {post.titleEn && (
                                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">EN</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <button
                                                                onClick={() => window.open(`/${locale}/blog/${post.slug}`, '_blank')}
                                                                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                                title="Ver en la web"
                                                            >
                                                                <Eye className="w-5 h-5" />
                                                            </button>
                                                            <Link
                                                                href={`/${locale}/admin1/posts/edit?id=${post.id}`}
                                                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                                title="Editar"
                                                            >
                                                                <Edit2 className="w-5 h-5" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(post.id, post.title)}
                                                                className="p-2 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
                                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FileText className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron entradas</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mb-8">
                                    {searchTerm ? 'Prueba con otros términos de búsqueda.' : 'Parece que aún no has creado ninguna publicación. ¡Comienza ahora!'}
                                </p>
                                {!searchTerm && (
                                    <button
                                        onClick={() => window.location.href = `/${locale}/admin1/posts/new`}
                                        className="btn-primary"
                                    >
                                        Crear mi primera entrada
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
