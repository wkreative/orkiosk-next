'use client'

import { useState, useRef } from 'react'
import Barcode from 'react-barcode'
import { Download, Copy, Check } from 'lucide-react'

export default function BarcodePage() {
    const [text, setText] = useState('123456789012')
    const [format, setFormat] = useState('CODE128')
    const [copied, setCopied] = useState(false)
    const barcodeRef = useRef<HTMLDivElement>(null)

    const formats = [
        'CODE128',
        'EAN13',
        'UPC',
        'CODE39',
        'ITF14',
        'MSI',
        'pharmacode',
        'codabar'
    ]

    const downloadBarcode = () => {
        const svg = barcodeRef.current?.querySelector('svg')
        if (!svg) return

        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)
            const pngFile = canvas.toDataURL('image/png')

            const downloadLink = document.createElement('a')
            downloadLink.download = `barcode-${text}.png`
            downloadLink.href = pngFile
            downloadLink.click()
        }

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    }

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                        Generador de Códigos de Barras
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Crea códigos de barras profesionales de forma instantánea
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                    {/* Input Section */}
                    <div className="space-y-6 mb-8">
                        <div>
                            <label htmlFor="barcode-text" className="block text-sm font-semibold text-gray-700 mb-2">
                                Texto del Código de Barras
                            </label>
                            <div className="relative">
                                <input
                                    id="barcode-text"
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-lg"
                                    placeholder="Ingresa el texto..."
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

                        <div>
                            <label htmlFor="format" className="block text-sm font-semibold text-gray-700 mb-2">
                                Formato
                            </label>
                            <select
                                id="format"
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-lg bg-white"
                            >
                                {formats.map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                            Vista Previa
                        </h3>
                        <div ref={barcodeRef} className="flex justify-center items-center min-h-[150px] bg-white rounded-xl p-6">
                            {text && (
                                <Barcode
                                    value={text}
                                    format={format}
                                    displayValue={true}
                                    fontSize={16}
                                    height={80}
                                    margin={10}
                                />
                            )}
                        </div>
                    </div>

                    {/* Download Button */}
                    <button
                        onClick={downloadBarcode}
                        disabled={!text}
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
                    >
                        <Download className="w-5 h-5" />
                        Descargar Código de Barras
                    </button>

                    {/* Info */}
                    <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                        <h4 className="font-semibold text-blue-900 mb-2">💡 Formatos Soportados</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li><strong>CODE128:</strong> Uso general, alfanumérico</li>
                            <li><strong>EAN13:</strong> Productos retail (13 dígitos)</li>
                            <li><strong>UPC:</strong> Productos USA/Canadá (12 dígitos)</li>
                            <li><strong>CODE39:</strong> Industrial, alfanumérico</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-gray-500 text-sm">
                    <p>Generado por <span className="font-semibold text-primary-600">Orkiosk</span></p>
                </div>
            </div>
        </div>
    )
}
