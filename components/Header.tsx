'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Globe } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export type NavItem = {
  name: string
  href: string
  external?: boolean
}

export type HeaderCopy = {
  nav: NavItem[]
  ctaLabel: string
  homeHref?: string
  ctaHref?: string
  aria: {
    navLabel: string
    openMenu: string
    closeMenu: string
  }
}

const defaultCopy: HeaderCopy = {
  nav: [
    { name: 'Inicio', href: '/' },
    { name: 'Beneficios', href: '/#benefits' },
    { name: 'Blog', href: '/blog' },
    { name: 'Client Portal', href: 'https://orkiosk.com/admin/', external: true },
    { name: 'Contacto', href: '/#contact' },
  ],
  ctaLabel: 'Agendar Demo',
  homeHref: '/',
  ctaHref: '/#contact',
  aria: {
    navLabel: 'Navegación principal',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
  },
}

export default function Header({ copy = defaultCopy }: { copy?: HeaderCopy }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktopLangOpen, setIsDesktopLangOpen] = useState(false)
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false)

  const desktopLangRef = useRef<HTMLDivElement>(null)
  const mobileLangRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const [hash, setHash] = useState('')
  const pathname = usePathname() ?? '/'
  const segments = pathname.split('/').filter(Boolean)
  const currentLocale = segments[0] === 'en' ? 'en' : 'es'
  const restPath = segments[0] === 'en' || segments[0] === 'es'
    ? `/${segments.slice(1).join('/')}`
    : pathname

  const localeHref = (locale: 'es' | 'en') => {
    const suffix = restPath === '/' ? '' : restPath
    return `/${locale}${suffix}${hash}`
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setHash(window.location.hash)
  }, [pathname])

  // Desktop language dropdown - click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopLangRef.current && !desktopLangRef.current.contains(event.target as Node)) {
        setIsDesktopLangOpen(false)
      }
    }
    if (isDesktopLangOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDesktopLangOpen])

  // Mobile language dropdown - click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileLangRef.current && !mobileLangRef.current.contains(event.target as Node)) {
        setIsMobileLangOpen(false)
      }
    }
    if (isMobileLangOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileLangOpen])

  // Mobile menu - click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/90 dark:bg-black/90 backdrop-blur-lg shadow-lg'
        : 'bg-transparent'
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label={copy.aria.navLabel}>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href={copy.homeHref ?? '/'} className="flex items-center group" aria-label="Ir al inicio">
            <span className="font-logo text-2xl md:text-3xl tracking-tight text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors">
              Orkiosk
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {copy.nav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/10"
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Desktop Theme Toggle */}
            <ThemeToggle />

            {/* Desktop Language Switcher */}
            <div ref={desktopLangRef} className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
                onClick={() => setIsDesktopLangOpen(!isDesktopLangOpen)}
                aria-expanded={isDesktopLangOpen}
                aria-haspopup="true"
              >
                <span>{currentLocale.toUpperCase()}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isDesktopLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden z-50">
                  <a
                    href={localeHref('es')}
                    className={`block px-4 py-2 text-sm transition-colors ${currentLocale === 'es' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    Español
                  </a>
                  <a
                    href={localeHref('en')}
                    className={`block px-4 py-2 text-sm transition-colors ${currentLocale === 'en' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    English
                  </a>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href={copy.ctaHref ?? '/#contact'}
              className="btn-primary text-sm"
            >
              {copy.ctaLabel}
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Language Switcher */}
            <div className="relative" ref={mobileLangRef}>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => {
                  setIsMobileLangOpen(!isMobileLangOpen)
                  setIsMobileMenuOpen(false)
                }}
                aria-expanded={isMobileLangOpen}
                aria-haspopup="true"
                aria-label="Seleccionar idioma"
              >
                <Globe className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
              {isMobileLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden z-50">
                  <a
                    href={localeHref('es')}
                    className={`block px-4 py-2.5 text-sm transition-colors ${currentLocale === 'es' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    Español
                  </a>
                  <a
                    href={localeHref('en')}
                    className={`block px-4 py-2.5 text-sm transition-colors ${currentLocale === 'en' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    English
                  </a>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="relative" ref={mobileMenuRef}>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen)
                  setIsMobileLangOpen(false)
                }}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? copy.aria.closeMenu : copy.aria.openMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-900 dark:text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
                )}
              </button>

              {/* Mobile Navigation Popup */}
              {isMobileMenuOpen && (
                <div
                  id="mobile-menu"
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden z-50"
                >
                  <div className="py-2">
                    {copy.nav.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2 px-3">
                      <Link
                        href={copy.ctaHref ?? '/#contact'}
                        className="btn-primary w-full text-center block text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {copy.ctaLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
