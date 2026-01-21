'use client'

import { useState } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import { ChevronDown, List } from 'lucide-react'
import type { ManualSection } from '@/lib/manual-utils'
import { cn } from '@/lib/utils'

interface ManualMobileNavProps {
    sections: ManualSection[]
    locale: string
}

export default function ManualMobileNav({ sections, locale }: ManualMobileNavProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="lg:hidden mb-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <List className="w-5 h-5 text-primary-600" />
                    <span className="font-bold text-gray-900">
                        {locale === 'es' ? 'Contenido del manual' : 'Manual contents'}
                    </span>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="mt-2 p-2 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="max-h-[60vh] overflow-y-auto p-2">
                        {sections.map((section) => (
                            <li key={section.id} style={{ paddingLeft: `${Math.max(0, section.level - 2) * 1}rem` }}>
                                <ScrollLink
                                    to={section.id}
                                    offset={-80}
                                    smooth={true}
                                    onClick={() => setIsOpen(false)}
                                    className="block py-3 px-4 text-sm font-bold text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors border-l-2 border-transparent"
                                >
                                    <span className="first-letter:uppercase lowercase">
                                        {section.title}
                                    </span>
                                </ScrollLink>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
