'use client'

import { useEffect, useState } from 'react'
import { Comment, getComments, deleteComment } from '@/lib/comments'
import CommentForm from './CommentForm'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es, enUS } from 'date-fns/locale'

interface CommentsSectionProps {
    slug: string
    enableComments?: boolean
    locale?: string
    commentsLabel?: string
    loadingLabel?: string
    emptyLabel?: string
}

export default function CommentsSection({
    slug,
    enableComments = true,
    locale = 'es',
    commentsLabel = 'Comentarios',
    loadingLabel = 'Cargando comentarios...',
    emptyLabel = 'Sé el primero en comentar.'
}: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isGlobalEnabled, setIsGlobalEnabled] = useState(true)

    const isEnabled = isGlobalEnabled && enableComments

    const fetchComments = async () => {
        try {
            // Import dynamically to avoid SSR issues if used elsewhere, though this is client comp
            const { getSettings } = await import('@/lib/settings')
            const settings = await getSettings()
            setIsGlobalEnabled(settings.enableComments)

            // Even if disabled, we might want to fetch comments for admin view or if we decide to show them but disable posting
            if (settings.enableComments && enableComments) {
                const data = await getComments(slug)
                setComments(data)
            }
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchComments()

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })

        return () => unsubscribe()
    }, [slug])

    const handleDelete = async (commentId: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) return

        try {
            await deleteComment(commentId)
            // Optimistic update
            setComments(comments.filter(c => c.id !== commentId))
        } catch (error) {
            console.error('Error deleting comment:', error)
            alert('Error al eliminar el comentario.')
        }
    }

    if (!isEnabled && !user) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-24">
            <div className="border-t border-gray-200 pt-12">
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8">
                    {commentsLabel} ({comments.length})
                </h2>

                {isEnabled && <CommentForm slug={slug} onCommentAdded={fetchComments} />}

                <div className="space-y-6">
                    {isLoading ? (
                        <p className="text-gray-500 animate-pulse">{loadingLabel}</p>
                    ) : comments.length === 0 ? (
                        <p className="text-gray-500 italic">{emptyLabel}</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 rounded-2xl p-6 relative group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900">{comment.author}</h4>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500">
                                            {comment.createdAt?.seconds
                                                ? formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), { addSuffix: true, locale: locale === 'en' ? enUS : es })
                                                : 'Recién'}
                                        </span>
                                        {user && (
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                                                title="Eliminar comentario (Admin)"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
