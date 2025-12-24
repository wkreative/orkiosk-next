'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit, Trash2, Eye, FileText, Loader2 } from 'lucide-react';

interface Page {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    createdAt?: any;
}

export default function PagesListPage() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale || 'es';

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const pagesRef = collection(db, 'pages');
            const q = query(pagesRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const pagesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Page[];
            setPages(pagesData);
        } catch (error) {
            console.error('Error fetching pages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm('¿Estás seguro de eliminar esta página?')) return;

        setDeleting(slug);
        try {
            await deleteDoc(doc(db, 'pages', slug));
            setPages(pages.filter((p) => p.slug !== slug));
        } catch (error) {
            console.error('Error deleting page:', error);
            alert('Error al eliminar la página');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Páginas</h1>
                        <p className="text-gray-500 mt-1">Gestiona las páginas estáticas de tu sitio</p>
                    </div>
                    <Link
                        href={`/${locale}/admin1/pages/new`}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nueva Página</span>
                    </Link>
                </div>

                {/* Pages List */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : pages.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay páginas</h3>
                        <p className="text-gray-500 mb-6">Crea tu primera página para empezar</p>
                        <Link
                            href={`/${locale}/admin1/pages/new`}
                            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Crear Página</span>
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Título</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">URL</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Estado</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pages.map((page) => (
                                    <tr key={page.slug} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-900">{page.title}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                /p/{page.slug}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${page.published
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {page.published ? 'Publicada' : 'Borrador'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/${locale}/p/${page.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                                                    title="Ver página"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/${locale}/admin1/pages/edit?slug=${page.slug}`}
                                                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(page.slug)}
                                                    disabled={deleting === page.slug}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                                    title="Eliminar"
                                                >
                                                    {deleting === page.slug ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
