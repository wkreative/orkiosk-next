'use client';

import React, { useEffect, useState } from 'react';
import { getAllComments, addAdminReply, deleteCommentAndReplies, Comment } from '@/lib/comments';
import { getAllPosts, Post, updatePost } from '@/lib/posts';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { MessageSquare, Trash2, Reply, Search, Loader2, ExternalLink, Settings, Shield, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import SettingsPanel from '@/components/admin/SettingsPanel';

export default function CommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [postsSearchTerm, setPostsSearchTerm] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'moderation' | 'settings'>('moderation');

    const params = useParams();
    const locale = params?.locale || 'es';
    const isSpanish = locale === 'es';

    const copy = isSpanish ? {
        title: 'Gestión de Comentarios',
        moderationTab: 'Moderación',
        settingsTab: 'Configuración',
        totalComments: 'Total de Comentarios',
        search: 'Buscar por autor o contenido...',
        searchPosts: 'Buscar publicación...',
        noComments: 'No hay comentarios',
        author: 'Autor',
        comment: 'Comentario',
        post: 'Publicación',
        date: 'Fecha',
        actions: 'Acciones',
        reply: 'Responder',
        delete: 'Eliminar',
        cancel: 'Cancelar',
        send: 'Enviar',
        confirmDelete: '¿Eliminar este comentario y todas sus respuestas?',
        confirm: 'Confirmar',
        replyPlaceholder: 'Escribe tu respuesta...',
        replies: 'respuestas',
        loading: 'Cargando datos...',
        settingsTitle: 'Configuración de Comentarios',
        perPostSettings: 'Configuración por Publicación',
        enableComments: 'Habilitar Comentarios',
        status: 'Estado',
        enabled: 'Habilitado',
        disabled: 'Deshabilitado'
    } : {
        title: 'Comments Management',
        moderationTab: 'Moderation',
        settingsTab: 'Settings',
        totalComments: 'Total Comments',
        search: 'Search by author or content...',
        searchPosts: 'Search post...',
        noComments: 'No comments',
        author: 'Author',
        comment: 'Comment',
        post: 'Post',
        date: 'Date',
        actions: 'Actions',
        reply: 'Reply',
        delete: 'Delete',
        cancel: 'Cancel',
        send: 'Send',
        confirmDelete: 'Delete this comment and all its replies?',
        confirm: 'Confirm',
        replyPlaceholder: 'Write your reply...',
        replies: 'replies',
        loading: 'Loading data...',
        settingsTitle: 'Comments Settings',
        perPostSettings: 'Per-Post Settings',
        enableComments: 'Enable Comments',
        status: 'Status',
        enabled: 'Enabled',
        disabled: 'Disabled'
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                window.location.href = `/${locale}/admin1/login`;
            } else {
                fetchData();
            }
        });

        return () => unsubscribe();
    }, [locale]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [commentsData, postsData] = await Promise.all([
                getAllComments(),
                getAllPosts()
            ]);

            // Add post titles to comments
            const commentsWithTitles = commentsData.map((comment: Comment) => {
                const post = postsData.find((p: Post) => p.slug === comment.slug);
                return {
                    ...comment,
                    postTitle: post?.title || comment.slug
                };
            });

            setComments(commentsWithTitles);
            setFilteredComments(commentsWithTitles);

            setPosts(postsData);
            setFilteredPosts(postsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter comments
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredComments(comments);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = comments.filter(comment =>
                comment.author.toLowerCase().includes(term) ||
                comment.postTitle?.toLowerCase().includes(term) ||
                comment.content.toLowerCase().includes(term)
            );
            setFilteredComments(filtered);
        }
    }, [searchTerm, comments]);

    // Filter posts
    useEffect(() => {
        if (postsSearchTerm.trim() === '') {
            setFilteredPosts(posts);
        } else {
            const term = postsSearchTerm.toLowerCase();
            const filtered = posts.filter(post =>
                post.title.toLowerCase().includes(term) ||
                post.slug.toLowerCase().includes(term)
            );
            setFilteredPosts(filtered);
        }
    }, [postsSearchTerm, posts]);

    const handleReply = async (commentId: string) => {
        if (!replyContent.trim() || !auth.currentUser) return;

        try {
            setSubmitting(true);
            await addAdminReply(commentId, replyContent, auth.currentUser.email || 'admin');
            setReplyContent('');
            setReplyingTo(null);
            await fetchData();
        } catch (error) {
            console.error('Error adding reply:', error);
            alert(isSpanish ? 'Error al agregar respuesta' : 'Error adding reply');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            setSubmitting(true);
            await deleteCommentAndReplies(commentId);
            setDeleteConfirm(null);
            await fetchData();
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert(isSpanish ? 'Error al eliminar comentario' : 'Error deleting comment');
        } finally {
            setSubmitting(false);
        }
    };

    const togglePostComments = async (slug: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            const updatedPosts = posts.map(p =>
                p.slug === slug ? { ...p, enableComments: !currentStatus } : p
            );
            setPosts(updatedPosts);

            await updatePost(slug, { enableComments: !currentStatus });
        } catch (error) {
            console.error('Error updating post settings:', error);
            // Revert on error
            fetchData();
            alert('Error updating post settings');
        }
    };

    const getReplyCount = (commentId: string) => {
        return comments.filter(c => c.parentId === commentId).length;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                    <span className="text-gray-600">{copy.loading}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{copy.title}</h1>
                    <p className="text-gray-500 mt-1">Administra los comentarios y configuraciones de tu blog</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-auto">
                    <button
                        onClick={() => setActiveTab('moderation')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'moderation'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Shield className="w-4 h-4" />
                        {copy.moderationTab}
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'settings'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Settings className="w-4 h-4" />
                        {copy.settingsTab}
                    </button>
                </div>
            </div>

            {activeTab === 'moderation' ? (
                /* MODERATION TAB */
                <>
                    {/* Stats & Search */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
                            <div className="bg-primary-50 p-2 rounded-lg">
                                <MessageSquare className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">{copy.totalComments}</p>
                                <p className="text-xl font-bold text-gray-900">{comments.length}</p>
                            </div>
                        </div>

                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={copy.search}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Comments List */}
                    {filteredComments.length === 0 ? (
                        <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">{copy.noComments}</h3>
                            <p className="text-gray-500 text-sm">No se encontraron comentarios con los filtros actuales.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredComments.map((comment) => (
                                <div key={comment.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    {/* Comment Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-gray-900">{comment.author}</span>
                                                {comment.parentId && (
                                                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-medium">
                                                        {isSpanish ? 'Respuesta' : 'Reply'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                                                    {comment.postTitle}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {comment.createdAt
                                                        ? formatDistanceToNow(comment.createdAt.toDate(), {
                                                            addSuffix: true,
                                                            locale: isSpanish ? es : undefined
                                                        })
                                                        : 'Just now'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comment Content */}
                                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                        <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{comment.content}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                                        {replyingTo === comment.id ? (
                                            <div className="flex-1 flex items-center gap-2 animate-fade-in">
                                                <input
                                                    type="text"
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                    placeholder={copy.replyPlaceholder}
                                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleReply(comment.id)}
                                                    disabled={submitting || !replyContent.trim()}
                                                    className="px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50"
                                                >
                                                    {copy.send}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setReplyingTo(null);
                                                        setReplyContent('');
                                                    }}
                                                    className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                                                >
                                                    {copy.cancel}
                                                </button>
                                            </div>
                                        ) : deleteConfirm === comment.id ? (
                                            <div className="flex-1 flex items-center gap-3 animate-fade-in bg-red-50 p-2 rounded-lg">
                                                <span className="text-sm text-red-700 font-medium ml-2">{copy.confirmDelete}</span>
                                                <div className="flex gap-2 ml-auto">
                                                    <button
                                                        onClick={() => handleDelete(comment.id)}
                                                        disabled={submitting}
                                                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 uppercase tracking-wide"
                                                    >
                                                        {copy.confirm}
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-3 py-1.5 bg-white border border-red-200 text-red-700 text-xs font-bold rounded-lg hover:bg-red-50 uppercase tracking-wide"
                                                    >
                                                        {copy.cancel}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setReplyingTo(comment.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                                                >
                                                    <Reply className="w-4 h-4" />
                                                    {copy.reply}
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(comment.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium ml-auto"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    {copy.delete}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                /* SETTINGS TAB */
                <div className="space-y-8 animate-fade-in">
                    {/* Global Settings */}
                    <SettingsPanel />

                    {/* Per-Post Settings */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{copy.perPostSettings}</h3>
                                <p className="text-sm text-gray-500">Activa o desactiva comentarios para publicaciones específicas</p>
                            </div>

                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={postsSearchTerm}
                                    onChange={(e) => setPostsSearchTerm(e.target.value)}
                                    placeholder={copy.searchPosts}
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{copy.post}</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">{copy.status}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredPosts.map((post) => (
                                        <tr key={post.slug} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                                                        <a
                                                            href={`/${locale}/blog/${post.slug}`}
                                                            target="_blank"
                                                            className="text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1 mt-0.5"
                                                        >
                                                            {post.slug} <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => togglePostComments(post.slug, post.enableComments ?? true)}
                                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${(post.enableComments ?? true) ? 'bg-green-500' : 'bg-gray-200'
                                                        }`}
                                                    role="switch"
                                                    aria-checked={post.enableComments ?? true}
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${(post.enableComments ?? true) ? 'translate-x-5' : 'translate-x-0'
                                                            }`}
                                                    />
                                                </button>
                                                <span className={`block text-xs font-medium mt-1 ${(post.enableComments ?? true) ? 'text-green-600' : 'text-gray-500'
                                                    }`}>
                                                    {(post.enableComments ?? true) ? copy.enabled : copy.disabled}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredPosts.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No se encontraron publicaciones.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
