'use client';

import { useEffect, useState } from 'react'
import { Comment, getComments, deleteComment } from '@/lib/comments'
import CommentForm from './CommentForm'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { Trash2, Reply } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es, enUS } from 'date-fns/locale'

interface CommentsCopy {
    commentsLabel: string
    loadingComments: string
    emptyComments: string
    reply: string
    deleteComment: string
    deleteConfirm: string
    deleteError: string
    justNow: string
    form: {
        title: string
        replyTitle: string
        replyTo: string
        cancel: string
        nameLabel: string
        namePlaceholder: string
        contentLabel: string
        contentPlaceholder: string
        submit: string
        submitting: string
        error: string
    }
}

interface CommentsSectionProps {
    slug: string
    enableComments?: boolean
    locale?: string
    copy: CommentsCopy
}

export default function CommentsSection({
    slug,
    enableComments = true,
    locale = 'es',
    copy
}: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isGlobalEnabled, setIsGlobalEnabled] = useState(true)
    const [replyingTo, setReplyingTo] = useState<{ id: string; author: string } | null>(null)

    const isEnabled = isGlobalEnabled && enableComments

    const fetchComments = async () => {
        try {
            const { getSettings } = await import('@/lib/settings')
            const settings = await getSettings()
            setIsGlobalEnabled(settings.enableComments)

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
        if (!confirm(copy.deleteConfirm)) return

        try {
            await deleteComment(commentId)
            setComments(comments.filter(c => c.id !== commentId))
        } catch (error) {
            console.error('Error deleting comment:', error)
            alert(copy.deleteError)
        }
    }

    const handleReply = (commentId: string, author: string) => {
        setReplyingTo({ id: commentId, author })
        // Scroll to comment form
        const formElement = document.querySelector('.comment-form-container')
        formElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }

    const handleCancelReply = () => {
        setReplyingTo(null)
    }

    const handleCommentAdded = () => {
        fetchComments()
        setReplyingTo(null)
    }

    const renderComment = (comment: Comment, depth: number = 0) => {
        const maxDepth = 3 // Maximum nesting level
        const isNested = depth > 0

        return (
            <div key={comment.id} className={isNested ? 'ml-8 mt-4' : ''}>
                <div className={`bg-gray-50 dark:bg-black rounded-2xl p-6 relative group ${isNested ? 'border-l-4 border-primary-200 dark:border-primary-800' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900 dark:text-white">{comment.author}</h4>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {comment.createdAt?.seconds
                                    ? formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), { addSuffix: true, locale: locale === 'en' ? enUS : es })
                                    : copy.justNow}
                            </span>
                            {isEnabled && depth < maxDepth && (
                                <button
                                    onClick={() => handleReply(comment.id, comment.author)}
                                    className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 p-1 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex items-center gap-1 text-sm"
                                    title={copy.reply}
                                >
                                    <Reply size={14} />
                                    <span className="hidden sm:inline">{copy.reply}</span>
                                </button>
                            )}
                            {user && (
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    title={copy.deleteComment}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                </div>

                {/* Render replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2">
                        {comment.replies.map(reply => renderComment(reply, depth + 1))}
                    </div>
                )}
            </div>
        )
    }

    // Hide completely when disabled
    if (!isEnabled) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-24">
            <div className="border-t border-gray-200 dark:border-gray-800 pt-12 transition-colors duration-300">
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-8">
                    {copy.commentsLabel} ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
                </h2>

                <div className="comment-form-container">
                    <CommentForm
                        slug={slug}
                        onCommentAdded={handleCommentAdded}
                        parentId={replyingTo?.id}
                        parentAuthor={replyingTo?.author}
                        onCancel={replyingTo ? handleCancelReply : undefined}
                        copy={copy.form}
                    />
                </div>

                <div className="space-y-6">
                    {isLoading ? (
                        <p className="text-gray-500 dark:text-gray-400 animate-pulse">{copy.loadingComments}</p>
                    ) : comments.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 italic">{copy.emptyComments}</p>
                    ) : (
                        comments.map(comment => renderComment(comment, 0))
                    )}
                </div>
            </div>
        </div>
    )
}

