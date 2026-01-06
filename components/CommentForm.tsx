'use client'

import { useState } from 'react'

interface CommentFormCopy {
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

interface CommentFormProps {
    slug: string
    onCommentAdded: () => void
    parentId?: string | null
    parentAuthor?: string
    onCancel?: () => void
    copy: CommentFormCopy
}

export default function CommentForm({ slug, onCommentAdded, parentId, parentAuthor, onCancel, copy }: CommentFormProps) {
    const [author, setAuthor] = useState('')
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            // Dynamic import to avoid SSR issues with Firebase
            const { addComment } = await import('@/lib/comments')

            await addComment(slug, author, content, parentId || null)

            setAuthor('')
            setContent('')
            onCommentAdded()
        } catch (err) {
            console.error('Error adding comment:', err)
            setError(copy.error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-black p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 transition-colors duration-300">
            {parentAuthor && (
                <div className="mb-4 flex items-center justify-between bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">
                    <p className="text-sm text-primary-700 dark:text-primary-300">
                        <span className="font-semibold">{copy.replyTo} {parentAuthor}</span>
                    </p>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
                        >
                            {copy.cancel}
                        </button>
                    )}
                </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {parentId ? copy.replyTitle : copy.title}
            </h3>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {copy.nameLabel}
                </label>
                <input
                    type="text"
                    id="author"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder={copy.namePlaceholder}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {copy.contentLabel}
                </label>
                <textarea
                    id="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder={copy.contentPlaceholder}
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {isSubmitting ? copy.submitting : copy.submit}
            </button>
        </form>
    )
}
