'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Edit2, Trash2, Plus, Search, Calendar, User, Eye, Loader2, FileText } from 'lucide-react';
import Link from 'next/navigation';
import { useParams } from 'next/navigation';

export default function DashboardPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const params = useParams();
    const locale = params?.locale || 'es';

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const q = query(collection(db, 'posts'), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsData);
        } catch (error) {
            console.error('Error fetching posts:', error);
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
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Publicaciones</h1>
                        <p className="text-gray-600">Gestiona las entradas de tu blog</p>
                    </div>
                    <button
                        onClick={() => window.location.href = `/${locale}/admin1/posts/new`}
                        className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-bold">Nueva Entrada</span>
                    </button>
                </div>

                {/* Stats/Search */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por título o slug..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-white"
                        />
                    </div>
                    <div className="bg-white border border-gray-200 px-6 py-3 rounded-xl flex items-center space-x-3">
                        <span className="text-gray-500 font-medium">Total:</span>
                        <span className="text-primary-600 font-bold text-lg">{posts.length}</span>
                    </div>
                </div>

                {/* Posts Table/Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
                        <p className="text-gray-500 font-medium animate-pulse">Cargando publicaciones...</p>
                    </div>
                ) : filteredPosts.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Entrada</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Categoría</th>
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
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    {new Date(post.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full uppercase tracking-tighter">
                                                    {post.category || 'General'}
                                                </span>
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
                                                    <button
                                                        onClick={() => window.location.href = `/${locale}/admin1/posts/${post.id}`}
                                                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
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
            </div>
        </AdminLayout>
    );
}
