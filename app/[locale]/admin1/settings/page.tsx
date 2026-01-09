'use client'

import { useState, useEffect } from 'react'
import { getSettings, saveSettings } from '@/lib/config'
import { Eye, EyeOff, Save, Loader2, Sparkles, MessageSquare, Sliders } from 'lucide-react'

export default function SettingsPage() {
    const [openaiKey, setOpenaiKey] = useState('')
    const [geminiKey, setGeminiKey] = useState('')
    const [googleSheetId, setGoogleSheetId] = useState('')
    const [showOpenai, setShowOpenai] = useState(false)
    const [showGemini, setShowGemini] = useState(false)
    const [showSheetId, setShowSheetId] = useState(false)

    // Advanced Config
    const [systemPrompt, setSystemPrompt] = useState('')
    const [aiModel, setAiModel] = useState('gpt-4o')
    const [maxTokens, setMaxTokens] = useState(2500)
    const [temperature, setTemperature] = useState(0.7)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const SYSTEM_PROMPT_DEFAULT = `You are an expert content writer for Orkiosk, a leading technology company specializing in self-service kiosks, POS systems, and digital solutions for restaurants.

YOUR GOAL:
Generate a high-quality, professional, and SEO-optimized blog post based on the User's Topic.

STRICT EDITORIAL GUIDELINES:
1.  **Identity**: Position Orkiosk as an authority.
2.  **Multilingual**: Generate content for TWO versions:
    *   **Spanish (ES)**: Use "quiosco" (NEVER "kiosko"). Tone: Professional, authoritative, accessible.
    *   **English (EN-US)**: Native US B2B tone (targeting owners/operators). NOT a literal translation; adapt for the US market context.
3.  **Structure**:
    *   Engaging Introduction.
    *   Informative Body (using <h2>, <h3>, <ul>).
    *   Strategic Conclusion with a subtle invitation to explore Orkiosk solutions.
4.  **Formatting**:
    *   Use HTML tags for the content (<h2>, <p>, <ul>, <li>, <strong>).
    *   **BOLD** the word "Orkiosk" and the "Focal Keyword" whenever they appear naturally.
5.  **Length**: APPROXIMATELY 900+ words per language.

OFFICIAL CATEGORIES (Pick one):
*   ES: [Tecnología de Autoservicio, Transformación Digital, Optimización y Crecimiento de Negocios, Tendencias e Innovación, Perspectivas & Vida Digital]
*   EN: [Self-Service Technology, Digital Transformation, Business Optimization & Growth, Trends & Innovation, Perspectives & Digital Life]

OUTPUT FORMAT:
Return ONLY a valid JSON object.`;

    useEffect(() => {
        async function loadSettings() {
            try {
                const settings = await getSettings()
                if (settings.openaiApiKey) setOpenaiKey(settings.openaiApiKey)
                if (settings.geminiApiKey) setGeminiKey(settings.geminiApiKey)
                if (settings.systemPrompt) setSystemPrompt(settings.systemPrompt)
                else setSystemPrompt(SYSTEM_PROMPT_DEFAULT)

                if (settings.googleSheetId) setGoogleSheetId(settings.googleSheetId)
                if (settings.aiModel) setAiModel(settings.aiModel)
                if (settings.maxTokens) setMaxTokens(settings.maxTokens)
                if (settings.temperature) setTemperature(settings.temperature)

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
                googleSheetId: googleSheetId,
                systemPrompt: systemPrompt,
                aiModel: aiModel,
                maxTokens: Number(maxTokens),
                temperature: Number(temperature),
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
                        Administra las claves de API y el comportamiento de la IA.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm border border-red-100">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm border border-green-100">
                        {success}
                    </div>
                )}

                {/* API Keys Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-lg leading-6 font-bold text-gray-900 mb-6 flex items-center">
                        <Save className="w-5 h-5 mr-2 text-primary-600" />
                        Llaves de API (API Keys)
                    </h3>

                    <div className="space-y-6">
                        {/* OpenAI Key */}
                        <div>
                            <label htmlFor="openai" className="block text-sm font-bold text-gray-700 mb-2">
                                OpenAI API Key
                            </label>
                            <div className="relative">
                                <input
                                    type={showOpenai ? 'text' : 'password'}
                                    id="openai"
                                    value={openaiKey}
                                    onChange={(e) => setOpenaiKey(e.target.value)}
                                    className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border pr-10"
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
                        </div>

                        {/* Gemini Key */}
                        <div>
                            <label htmlFor="gemini" className="block text-sm font-bold text-gray-700 mb-2">
                                Gemini API Key
                            </label>
                            <div className="relative">
                                <input
                                    type={showGemini ? 'text' : 'password'}
                                    id="gemini"
                                    value={geminiKey}
                                    onChange={(e) => setGeminiKey(e.target.value)}
                                    className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border pr-10"
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
                        </div>

                        {/* Google Sheet ID */}
                        <div>
                            <label htmlFor="sheetId" className="block text-sm font-bold text-gray-700 mb-2">
                                Google Sheet ID (Chat Knowledge Base)
                            </label>
                            <div className="relative">
                                <input
                                    type={showSheetId ? 'text' : 'password'}
                                    id="sheetId"
                                    value={googleSheetId}
                                    onChange={(e) => setGoogleSheetId(e.target.value)}
                                    className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border pr-10"
                                    placeholder="1BxiMVs0XRA5nLFd..."
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSheetId(!showSheetId)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showSheetId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                ID de la hoja de cálculo de Google. Asegúrate de compartir la hoja con el email de servicio.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Advanced Configuration */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-lg leading-6 font-bold text-gray-900 mb-6 flex items-center">
                        <Sliders className="w-5 h-5 mr-2 text-primary-600" />
                        Configuración Avanzada de IA
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Modelo de IA
                            </label>
                            <select
                                value={aiModel}
                                onChange={(e) => setAiModel(e.target.value)}
                                className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border"
                            >
                                <option value="gpt-4o">GPT-4o (Recomendado)</option>
                                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Rápido)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Temperatura ({temperature})
                            </label>
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={temperature}
                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Preciso</span>
                                <span>Creativo</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Max Tokens
                            </label>
                            <input
                                type="number"
                                value={maxTokens}
                                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                                className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                            <span>System Prompt (Instrucciones Maestras)</span>
                            <span className="text-xs font-normal text-gray-500">Define la personalidad y reglas de la IA</span>
                        </label>
                        <div className="relative">
                            <MessageSquare className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                            <textarea
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                rows={15}
                                className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pl-10 p-3 border font-mono text-xs leading-relaxed"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-xl shadow-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all active:scale-95"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Guardar Toda la Configuración
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
