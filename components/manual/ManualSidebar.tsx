'use client'

import { useState, useEffect } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import type { ManualSection } from '@/lib/manual-utils'
import { cn } from '@/lib/utils'

interface ManualSidebarProps {
    sections: ManualSection[]
    locale: string
}

export default function ManualSidebar({ sections, locale }: ManualSidebarProps) {
    const [activeSection, setActiveSection] = useState<string>('')

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id)
                    }
                })
            },
            { rootMargin: '-20% 0% -35% 0%' }
        )

        sections.forEach((section) => {
            const element = document.getElementById(section.id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [sections])

    return (
        <nav className="hidden lg:block sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                {locale === 'es' ? 'Contenido' : 'Contents'}
            </h2>
            <ul className="space-y-1">
                {sections.map((section) => (
                    <li
                        key={section.id}
                        style={{ paddingLeft: `${(section.level - 2) * 1}rem` }}
                    >
                        <ScrollLink
                            to={section.id}
                            offset={-100}
                            smooth={true}
                            duration={500}
                            spy={true}
                            onSetActive={() => setActiveSection(section.id)}
                            className={cn(
                                "block py-1.5 text-sm transition-colors cursor-pointer border-l-2 pl-4",
                                activeSection === section.id
                                    ? "border-primary-600 text-primary-600 font-medium bg-primary-50/50"
                                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200"
                            )}
                        >
                            {section.title}
                        </ScrollLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
