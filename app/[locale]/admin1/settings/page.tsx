'use client'

import { useState, useEffect } from 'react'
import { getSettings, saveSettings } from '@/lib/config'
import { Eye, EyeOff, Save, Loader2 } from 'lucide-react'
import { getTranslations, type Locale } from '@/lib/i18n'

export default function SettingsPage({ params }: { params: { locale: Locale } }) {
    const [openaiKey, setOpenaiKey] = useState('')
    const [geminiKey, setGeminiKey] = useState('')
    const [showOpenai, setShowOpenai] = useState(false)
    const [showGemini, setShowGemini] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        async function loadSettings() {
            try {
                const settings = await getSettings()
                if (settings.openaiApiKey) setOpenaiKey(settings.openaiApiKey)
                if (settings.geminiApiKey) setGeminiKey(settings.geminiApiKey)
            } catch (err) {
                console.error(err)
                setError('Error loading settings')
            } finally {
                setLoading(false)
            }
        }
        loadSettings()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setSuccess('')

        try {
            await saveSettings({
                openaiApiKey: openaiKey,
                geminiApiKey: geminiKey,
            })
            setSuccess('Configuración guardada correctamente')
        } catch (err) {
            console.error(err)
            setError('Error al guardar la configuración')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Configuración
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Administra las claves de API para la generación automática de contenido.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm">
                            {success}
                        </div>
                    )}

                    {/* OpenAI Key */}
                    <div>
                        <label htmlFor="openai" className="block text-sm font-medium text-gray-700 mb-1">
                            OpenAI API Key
                        </label>
                        <div className="relative">
                            <input
                                type={showOpenai ? 'text' : 'password'}
                                id="openai"
                                value={openaiKey}
                                onChange={(e) => setOpenaiKey(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border pr-10"
                                placeholder="sk-..."
                            />
                            <button
                                type="button"
                                onClick={() => setShowOpenai(!showOpenai)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showOpenai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Necesaria para generar contenido usando GPT-4o.
                        </p>
                    </div>

                    {/* Gemini Key */}
                    <div>
                        <label htmlFor="gemini" className="block text-sm font-medium text-gray-700 mb-1">
                            Gemini API Key
                        </label>
                        <div className="relative">
                            <input
                                type={showGemini ? 'text' : 'password'}
                                id="gemini"
                                value={geminiKey}
                                onChange={(e) => setGeminiKey(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border pr-10"
                                placeholder="AIza..."
                            />
                            <button
                                type="button"
                                onClick={() => setShowGemini(!showGemini)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Necesaria para generar contenido usando Google Gemini Pro.
                        </p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar Configuración
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
