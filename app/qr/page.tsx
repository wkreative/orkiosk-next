'use client'

import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Copy, Check, Link as LinkIcon, Wifi, Mail, Smartphone } from 'lucide-react'

type QRType = 'text' | 'url' | 'email' | 'wifi' | 'phone'

export default function QRPage() {
    const [qrType, setQRType] = useState<QRType>('text')
    const [value, setValue] = useState('https://orkiosk.com')
    const [size, setSize] = useState(256)
    const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
    const [copied, setCopied] = useState(false)
    const qrRef = useRef<HTMLDivElement>(null)

    const errorLevels = [
        { value: 'L', label: 'Bajo (7%)', description: 'Más rápido de escanear' },
        { value: 'M', label: 'Medio (15%)', description: 'Balance recomendado' },
        { value: 'Q', label: 'Alto (25%)', description: 'Más robusto' },
        { value: 'H', label: 'Muy Alto (30%)', description: 'Máxima corrección' }
    ]

    const qrTypes = [
        { id: 'text', label: 'Texto', icon: Smartphone },
        { id: 'url', label: 'URL', icon: LinkIcon },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'wifi', label: 'WiFi', icon: Wifi }
    ]

    const downloadQR = () => {
        const svg = qrRef.current?.querySelector('svg')
        if (!svg) return

        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            canvas.width = size
            canvas.height = size
            ctx?.drawImage(img, 0, 0)
            const pngFile = canvas.toDataURL('image/png')

            const downloadLink = document.createElement('a')
            downloadLink.download = `qr-code-${Date.now()}.png`
            downloadLink.href = pngFile
            downloadLink.click()
        }

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    }

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const getPlaceholder = () => {
        switch (qrType) {
            case 'url': return 'https://ejemplo.com'
            case 'email': return 'correo@ejemplo.com'
            case 'wifi': return 'WIFI:T:WPA;S:NombreRed;P:Contraseña;;'
            case 'phone': return '+1234567890'
            default: return 'Ingresa tu texto aquí...'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Generador de Códigos QR
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Crea códigos QR personalizados para cualquier propósito
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                    {/* QR Type Selector */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Tipo de Contenido
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {qrTypes.map(type => {
                                const Icon = type.icon
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setQRType(type.id as QRType)}
                                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${qrType === type.id
                                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                            }`}
                                    >
                                        <Icon className="w-6 h-6" />
                                        <span className="text-sm font-medium">{type.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Input Section */}
                    <div className="space-y-6 mb-8">
                        <div>
                            <label htmlFor="qr-value" className="block text-sm font-semibold text-gray-700 mb-2">
                                Contenido del QR
                            </label>
                            <div className="relative">
                                <textarea
                                    id="qr-value"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                                    placeholder={getPlaceholder()}
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="absolute right-3 top-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Copiar texto"
                                >
                                    {copied ? (
                                        <Check className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <Copy className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="size" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tamaño (px)
                                </label>
                                <input
                                    id="size"
                                    type="range"
                                    min="128"
                                    max="512"
                                    step="32"
                                    value={size}
                                    onChange={(e) => setSize(Number(e.target.value))}
                                    className="w-full"
                                />
                                <div className="text-center text-sm text-gray-600 mt-1">{size}px</div>
                            </div>

                            <div>
                                <label htmlFor="error-level" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Corrección de Errores
                                </label>
                                <select
                                    id="error-level"
                                    value={errorLevel}
                                    onChange={(e) => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white"
                                >
                                    {errorLevels.map(level => (
                                        <option key={level.value} value={level.value}>
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                            Vista Previa
                        </h3>
                        <div ref={qrRef} className="flex justify-center items-center bg-white rounded-xl p-8">
                            {value && (
                                <QRCodeSVG
                                    value={value}
                                    size={size}
                                    level={errorLevel}
                                    includeMargin={true}
                                />
                            )}
                        </div>
                    </div>

                    {/* Download Button */}
                    <button
                        onClick={downloadQR}
                        disabled={!value}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
                    >
                        <Download className="w-5 h-5" />
                        Descargar Código QR
                    </button>

                    {/* Info */}
                    <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-100">
                        <h4 className="font-semibold text-purple-900 mb-2">💡 Niveles de Corrección de Errores</h4>
                        <p className="text-sm text-purple-700 mb-3">
                            Un nivel más alto permite que el QR sea escaneado incluso si está parcialmente dañado.
                        </p>
                        <ul className="text-sm text-purple-700 space-y-1">
                            {errorLevels.map(level => (
                                <li key={level.value}>
                                    <strong>{level.label}:</strong> {level.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-gray-500 text-sm">
                    <p>Generado por <span className="font-semibold text-purple-600">Orkiosk</span></p>
                </div>
            </div>
        </div>
    )
}
