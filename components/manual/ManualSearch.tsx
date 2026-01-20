'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Command, X } from 'lucide-react'
import { Link as ScrollLink } from 'react-scroll'
import type { ManualSection } from '@/lib/manual-utils'

interface ManualSearchProps {
    sections: ManualSection[]
    locale: string
}

export default function ManualSearch({ sections, locale }: ManualSearchProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<ManualSection[]>([])
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(true)
            }
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
        if (query.trim() === '') {
            setResults([])
            return
        }
        const filtered = sections.filter(s =>
            s.title.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filtered)
    }, [query, sections])

    return (
        <div className="relative w-full max-w-xl mx-auto mb-8">
            <div
                className="relative group cursor-text"
                onClick={() => setIsOpen(true)}
            >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                <input
                    type="text"
                    readOnly
                    placeholder={locale === 'es' ? 'Buscar en el manual... (Ctrl + K)' : 'Search manual... (Ctrl + K)'}
                    className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm group-hover:shadow-md"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400">
                    <Command className="w-3 h-3" /> K
                </div>
            </div>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        ref={dropdownRef}
                        className="absolute top-0 left-0 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200"
                    >
                        <div className="p-4 border-b border-gray-50 flex items-center gap-3">
                            <Search className="w-5 h-5 text-primary-500" />
                            <input
                                autoFocus
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={locale === 'es' ? '¿Qué estás buscando?' : 'What are you looking for?'}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder:text-gray-400"
                            />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto p-2">
                            {results.length > 0 ? (
                                <div className="grid gap-1">
                                    {results.map((result) => (
                                        <ScrollLink
                                            key={result.id}
                                            to={result.id}
                                            offset={-100}
                                            smooth={true}
                                            onClick={() => {
                                                setIsOpen(false)
                                                setQuery('')
                                            }}
                                            className="flex flex-col p-3 rounded-xl hover:bg-primary-50 group transition-colors cursor-pointer"
                                        >
                                            <span className="text-sm font-bold text-gray-900 group-hover:text-primary-700 capitalize-first">
                                                {result.title.toLowerCase()}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {locale === 'es' ? 'Sección' : 'Section'} {result.level === 2 ? 'Principal' : 'Subsección'}
                                            </span>
                                        </ScrollLink>
                                    ))}
                                </div>
                            ) : query ? (
                                <div className="py-12 text-center">
                                    <p className="text-sm text-gray-500">
                                        {locale === 'es' ? 'No encontramos coincidencias para' : 'No matches found for'} "{query}"
                                    </p>
                                </div>
                            ) : (
                                <div className="py-8 px-4 text-center">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-4">
                                        {locale === 'es' ? 'Sugerencias' : 'Suggestions'}
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {sections.slice(0, 5).map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => setQuery(s.title)}
                                                className="px-3 py-1.5 bg-gray-50 hover:bg-primary-50 text-gray-600 hover:text-primary-600 rounded-full text-xs transition-colors border border-gray-100"
                                            >
                                                {s.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
