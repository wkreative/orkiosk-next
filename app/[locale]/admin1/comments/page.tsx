'use client';

import React, { useEffect, useState } from 'react';
import { getAllComments, addAdminReply, deleteCommentAndReplies, Comment } from '@/lib/comments';
import { getAllPosts, Post } from '@/lib/posts';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { MessageSquare, Trash2, Reply, Search, Loader2, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const params = useParams();
    const locale = params?.locale || 'es';
    const isSpanish = locale === 'es';

    const copy = isSpanish ? {
        title: 'Gestión de Comentarios',
        totalComments: 'Total de Comentarios',
        search: 'Buscar por autor o publicación...',
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
        loading: 'Cargando comentarios...'
    } : {
        title: 'Comments Management',
        totalComments: 'Total Comments',
        search: 'Search by author or post...',
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
        loading: 'Loading comments...'
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                window.location.href = `/${locale}/admin1/login`;
            } else {
                fetchComments();
            }
        });

        return () => unsubscribe();
    }, [locale]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const [commentsData, posts] = await Promise.all([
                getAllComments(),
                getAllPosts()
            ]);

            // Add post titles to comments
            const commentsWithTitles = commentsData.map((comment: Comment) => {
                const post = posts.find((p: Post) => p.slug === comment.slug);
                return {
                    ...comment,
                    postTitle: post?.title || comment.slug
                };
            });

            setComments(commentsWithTitles);
            setFilteredComments(commentsWithTitles);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleReply = async (commentId: string) => {
        if (!replyContent.trim() || !auth.currentUser) return;

        try {
            setSubmitting(true);
            await addAdminReply(commentId, replyContent, auth.currentUser.email || 'admin');
            setReplyContent('');
            setReplyingTo(null);
            await fetchComments();
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
            await fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert(isSpanish ? 'Error al eliminar comentario' : 'Error deleting comment');
        } finally {
            setSubmitting(false);
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
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{copy.title}</h1>
                <div className="flex items-center gap-4">
                    <div className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-2">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary-600" />
                            <span className="text-sm text-gray-600">{copy.totalComments}:</span>
                            <span className="text-lg font-semibold text-primary-700">{comments.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={copy.search}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Comments List */}
            {filteredComments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">{copy.noComments}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredComments.map((comment) => (
                        <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                            {/* Comment Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900">{comment.author}</span>
                                        {comment.parentId && (
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                                {isSpanish ? 'Respuesta' : 'Reply'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <Link
                                            href={`/${locale}/${comment.slug}`}
                                            target="_blank"
                                            className="flex items-center gap-1 hover:text-primary-600"
                                        >
                                            <span>{comment.postTitle}</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                        <span>•</span>
                                        <span>
                                            {comment.createdAt
                                                ? formatDistanceToNow(comment.createdAt.toDate(), {
                                                    addSuffix: true,
                                                    locale: isSpanish ? es : undefined
                                                })
                                                : 'Just now'}
                                        </span>
                                        {getReplyCount(comment.id) > 0 && (
                                            <>
                                                <span>•</span>
                                                <span>{getReplyCount(comment.id)} {copy.replies}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Comment Content */}
                            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{comment.content}</p>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {replyingTo === comment.id ? (
                                    <div className="flex-1 flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder={copy.replyPlaceholder}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleReply(comment.id)}
                                            disabled={submitting || !replyContent.trim()}
                                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {copy.send}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setReplyingTo(null);
                                                setReplyContent('');
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            {copy.cancel}
                                        </button>
                                    </div>
                                ) : deleteConfirm === comment.id ? (
                                    <div className="flex-1 flex items-center gap-2">
                                        <span className="text-sm text-gray-700">{copy.confirmDelete}</span>
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            disabled={submitting}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                        >
                                            {copy.confirm}
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(null)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            {copy.cancel}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setReplyingTo(comment.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                        >
                                            <Reply className="w-4 h-4" />
                                            {copy.reply}
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(comment.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        </div>
    );
}
