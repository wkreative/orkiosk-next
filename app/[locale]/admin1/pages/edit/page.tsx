'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Save, ArrowLeft, Loader2, Hash, Globe } from 'lucide-react';
import Link from 'next/link';

export default function EditPagePage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const locale = params?.locale || 'es';
    const slug = searchParams.get('slug');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        focalKeyword: '',
        metaDescription: '',
        seoTitle: '',
        published: false,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (slug) {
            fetchPage();
        }
    }, [slug]);

    const fetchPage = async () => {
        try {
            const pageRef = doc(db, 'pages', slug as string);
            const pageDoc = await getDoc(pageRef);

            if (pageDoc.exists()) {
                const data = pageDoc.data();
                setFormData({
                    title: data.title || '',
                    slug: data.slug || slug || '',
                    content: data.content || '',
                    focalKeyword: data.focalKeyword || '',
                    metaDescription: data.metaDescription || '',
                    seoTitle: data.seoTitle || '',
                    published: data.published || false,
                });
            }
        } catch (err) {
            console.error('Error fetching page:', err);
            setError('Error al cargar la página');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.slug) {
            setError('Título y URL son requeridos');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const pageRef = doc(db, 'pages', formData.slug);
            await setDoc(pageRef, {
                ...formData,
                updatedAt: serverTimestamp(),
            }, { merge: true });
            router.push(`/${locale}/admin1/pages`);
        } catch (err: any) {
            console.error('Error saving page:', err);
            setError('Error al guardar la página');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={`/${locale}/admin1/pages`}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Editar Página</h1>
                            <p className="text-gray-500 mt-1">Modifica el contenido de la página</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.published}
                                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Publicada</span>
                        </label>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Guardar</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Título</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 text-xl font-bold border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                        <Globe className="w-4 h-4 mr-2" />
                                        URL (slug)
                                    </label>
                                    <div className="flex items-center">
                                        <span className="text-gray-400 mr-2">orkiosk.com/</span>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Contenido</label>
                            <RichTextEditor
                                content={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                            />
                        </div>
                    </div>

                    {/* Sidebar - SEO */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h3 className="text-sm font-bold text-primary-600 mb-4 uppercase tracking-wide flex items-center">
                                <Hash className="w-4 h-4 mr-2" />
                                Optimización SEO
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">
                                        Palabra Clave Focal
                                    </label>
                                    <input
                                        type="text"
                                        name="focalKeyword"
                                        value={formData.focalKeyword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary-200 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">
                                        Título SEO
                                    </label>
                                    <input
                                        type="text"
                                        name="seoTitle"
                                        value={formData.seoTitle}
                                        onChange={handleChange}
                                        maxLength={60}
                                        className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary-200 outline-none"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">{formData.seoTitle.length}/60</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">
                                        Meta Descripción
                                    </label>
                                    <textarea
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleChange}
                                        maxLength={155}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary-200 outline-none resize-none"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">{formData.metaDescription.length}/155</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
