'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { db, storage } from '@/lib/firebase';
import { collection, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Save, X, Image as ImageIcon, Loader2, ArrowLeft, Globe, Hash } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface PostFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function PostForm({ initialData, isEditing }: PostFormProps) {
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale || 'es';

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        image: '',
        date: new Date().toISOString().split('T')[0],
        author: 'Admin',
        // SEO Fields
        focalKeyword: '',
        metaDescription: '',
        seoTitle: '',
        noIndex: false,
        enableComments: true,
        // English translations
        titleEn: '',
        excerptEn: '',
        contentEn: '',
        categoryEn: '',
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleAIGenerate = async (provider: 'openai' | 'gemini') => {
        const topicInput = document.getElementById('ai-topic-input') as HTMLInputElement;
        const topic = topicInput?.value;

        if (!topic) {
            setError('Por favor, ingresa un tema para generar el contenido.');
            return;
        }

        setGenerating(true);
        setError('');

        try {
            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, provider }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error en la generación');
            }

            // Autofill form
            setFormData(prev => ({
                ...prev,
                title: data.title,
                slug: data.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
                excerpt: data.excerpt,
                content: data.content,
                category: data.category,
                focalKeyword: data.focalKeyword,
                seoTitle: data.seoTitle,
                metaDescription: data.metaDescription,
                noIndex: false, // Default for new generated content
                enableComments: true, // Default for new generated content
                titleEn: data.titleEn,
                excerptEn: data.excerptEn,
                contentEn: data.contentEn,
                categoryEn: data.categoryEn,
            }));

        } catch (err: any) {
            console.error('AI Gen Error:', err);
            setError(`Error al generar: ${err.message}`);
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...formData,
                ...initialData,
                date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : formData.date,
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // Auto-generate slug from title if not editing a specific slug manually
            if (name === 'title' && !isEditing) {
                newData.slug = value
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }
            return newData;
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const storageRef = ref(storage, `blog/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            null,
            (error) => {
                console.error('Upload error:', error);
                setError('Error al subir la imagen');
                setUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setFormData(prev => ({ ...prev, image: downloadURL }));
                setUploading(false);
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Check if user is authenticated
            const { auth } = await import('@/lib/firebase');
            if (!auth.currentUser) {
                setError('Error: Debes estar autenticado para publicar. Por favor, inicia sesión nuevamente.');
                setLoading(false);
                return;
            }

            const postData = {
                ...formData,
                lastUpdated: serverTimestamp(),
            };

            console.log('Guardando post:', { slug: formData.slug, title: formData.title });

            if (isEditing && initialData.id) {
                await updateDoc(doc(db, 'posts', initialData.id), postData);
                console.log('Post actualizado exitosamente');
            } else {
                // Check if slug is unique (simplified)
                await setDoc(doc(db, 'posts', formData.slug), postData);
                console.log('Post creado exitosamente');
            }

            // Show success message before redirect
            alert(isEditing ? '✅ Post actualizado exitosamente!' : '✅ Post publicado exitosamente!');
            router.push(`/${locale}/admin1/dashboard`);
        } catch (err: any) {
            console.error('Error saving post:', err);

            // More specific error messages
            let errorMessage = 'Error al guardar el post.';

            if (err.code === 'permission-denied') {
                errorMessage = '❌ Error de permisos: Asegúrate de estar autenticado correctamente.';
            } else if (err.code === 'unavailable') {
                errorMessage = '❌ Error de conexión: Verifica tu conexión a internet.';
            } else if (err.message) {
                errorMessage = `❌ Error: ${err.message}`;
            }

            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-white rounded-full transition-colors text-gray-500"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-bold font-heading text-gray-900">
                    {isEditing ? 'Editar Entrada' : 'Nueva Entrada'}
                </h1>
                {!isEditing && (
                    <div className="flex items-center space-x-2">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Tema del artículo..."
                                id="ai-topic-input"
                                className="w-64 px-4 py-2 border border-purple-200 rounded-lg text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                            />
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 p-2 hidden group-focus-within:block z-50">
                                <p className="text-xs text-gray-500 mb-2 px-2">Generar con:</p>
                                <button
                                    type="button"
                                    onClick={() => handleAIGenerate('openai')}
                                    disabled={generating}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-md transition-colors flex items-center"
                                >
                                    <span className="mr-2">🤖</span> OpenAI (GPT-4)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAIGenerate('gemini')}
                                    disabled={generating}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md transition-colors flex items-center"
                                >
                                    <span className="mr-2">✨</span> Gemini Pro
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                const topicInput = document.getElementById('ai-topic-input') as HTMLInputElement;
                                if (topicInput?.value) handleAIGenerate('openai'); // Default to OpenAI
                            }}
                            disabled={generating}
                            className={`px-4 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-all flex items-center space-x-2 ${generating
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-purple-200'
                                }`}
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Escribiendo...</span>
                                </>
                            ) : (
                                <>
                                    <span>✨</span>
                                    <span>Generar Borrador</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Título de la entrada</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Ej: Cómo optimizar tu negocio con kioscos"
                                className="w-full px-4 py-3 text-xl font-bold border-0 border-b-2 border-gray-100 focus:border-primary-500 outline-none transition-all placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Extracto</label>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Una breve descripción para los listados de blog..."
                                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm leading-relaxed focus:bg-white focus:border-primary-200 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Contenido (Español)</label>
                            <RichTextEditor
                                content={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                            />
                        </div>
                    </div>

                    {/* English Translation Section */}
                    <div className="bg-white p-8 rounded-2xl border border-blue-200 shadow-sm space-y-6">
                        <div className="flex items-center space-x-2 border-b border-blue-100 pb-4">
                            <span className="text-2xl">🇺🇸</span>
                            <h2 className="font-bold text-blue-800">English Translation</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Title (English)</label>
                            <input
                                type="text"
                                name="titleEn"
                                value={formData.titleEn}
                                onChange={handleChange}
                                placeholder="Ex: How to optimize your business with kiosks"
                                className="w-full px-4 py-3 text-xl font-bold border-0 border-b-2 border-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Content (English)</label>
                            <RichTextEditor
                                content={formData.contentEn}
                                onChange={(contentEn) => setFormData({ ...formData, contentEn })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Excerpt (English)</label>
                            <textarea
                                name="excerptEn"
                                value={formData.excerptEn}
                                onChange={handleChange}
                                rows={3}
                                placeholder="A brief description for blog listings..."
                                className="w-full px-4 py-3 bg-blue-50 border border-transparent rounded-xl text-sm leading-relaxed focus:bg-white focus:border-blue-200 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Category (English)</label>
                            <input
                                type="text"
                                name="categoryEn"
                                value={formData.categoryEn}
                                onChange={handleChange}
                                placeholder="Ex: Technology"
                                className="w-full px-4 py-2 bg-blue-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-200 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="font-bold text-gray-900 border-b border-gray-50 pb-4 flex items-center">
                            <Globe className="w-5 h-5 mr-2 text-primary-600" />
                            Configuración
                        </h2>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Fecha</label>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Autor</label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="Ej: Admin"
                                className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary-200 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Categoría</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Ej: Tecnología"
                                className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary-200 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Slug / URL</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="slug"
                                    required
                                    disabled={isEditing}
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm font-mono disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Comments Toggle */}
                        <div className="pt-4 border-t border-gray-100">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.enableComments}
                                    onChange={(e) => setFormData({ ...formData, enableComments: e.target.checked })}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Habilitar comentarios</span>
                                    <p className="text-xs text-gray-400">Permite usuarios comentar</p>
                                </div>
                            </label>
                        </div>

                        {/* SEO Section */}
                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-sm font-bold text-primary-600 mb-4 uppercase tracking-wide flex items-center">
                                <Hash className="w-4 h-4 mr-2" />
                                Optimización SEO
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">
                                        Palabra Clave Focal
                                        <span className="text-gray-400 font-normal ml-1">(Keyword principal)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="focalKeyword"
                                        value={formData.focalKeyword}
                                        onChange={handleChange}
                                        placeholder="Ej: quioscos de autoservicio"
                                        className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary-200 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">
                                        Título SEO
                                        <span className="text-gray-400 font-normal ml-1">(Opcional - usa título del post por defecto)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="seoTitle"
                                        value={formData.seoTitle}
                                        onChange={handleChange}
                                        placeholder="Título optimizado para buscadores"
                                        maxLength={60}
                                        className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary-200 outline-none"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">{formData.seoTitle.length}/60 caracteres</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">
                                        Meta Descripción
                                        <span className="text-gray-400 font-normal ml-1">(Aparece en resultados de búsqueda)</span>
                                    </label>
                                    <textarea
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleChange}
                                        placeholder="Describe tu artículo en 155 caracteres..."
                                        maxLength={155}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary-200 outline-none resize-none"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">{formData.metaDescription.length}/155 caracteres</p>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.noIndex}
                                            onChange={(e) => setFormData({ ...formData, noIndex: e.target.checked })}
                                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">No indexar en buscadores</span>
                                            <p className="text-xs text-gray-400">Evita que esta entrada aparezca en Google</p>
                                        </div>
                                    </label>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="font-bold text-gray-900 border-b border-gray-50 pb-4 flex items-center">
                            <ImageIcon className="w-5 h-5 mr-2 text-primary-600" />
                            Imagen Destacada
                        </h2>

                        <div className="space-y-4">
                            {formData.image && (
                                <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-100 group">
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                    disabled={uploading}
                                />
                                <label
                                    htmlFor="image-upload"
                                    className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:bg-gray-50 hover:border-primary-300 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    {uploading ? (
                                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                                    ) : (
                                        <>
                                            <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                {formData.image ? 'Cambiar Imagen' : 'Subir Imagen'}
                                            </span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        {error && (
                            <div className="mb-4 text-xs font-bold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl hover:bg-primary-700 shadow-xl shadow-primary-200 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>{isEditing ? 'Guardar Cambios' : 'Publicar Entrada'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div >
            </form >
        </div >
    );
}
