'use client'

import { useState } from 'react'

interface CommentFormProps {
    slug: string
    onCommentAdded: () => void
}

export default function CommentForm({ slug, onCommentAdded }: CommentFormProps) {
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

            await addComment(slug, author, content)

            setAuthor('')
            setContent('')
            onCommentAdded()
        } catch (err) {
            console.error('Error adding comment:', err)
            setError('Hubo un error al publicar tu comentario. Inténtalo de nuevo.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Deja un comentario</h3>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                </label>
                <input
                    type="text"
                    id="author"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Tu nombre"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Comentario
                </label>
                <textarea
                    id="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Escribe tu opinión..."
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {isSubmitting ? 'Publicando...' : 'Publicar Comentario'}
            </button>
        </form>
    )
}
