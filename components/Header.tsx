'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Beneficios', href: '/#benefits' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contacto', href: '/#contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isMobileMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navegacion principal">
        <div className="relative flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group" aria-label="Ir al inicio">
              <span className="font-logo text-2xl font-bold tracking-tighter text-gray-900 group-hover:text-primary-600 transition-colors">
                Orkiosk
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center rounded-full border border-gray-200/70 bg-white/70 px-2 py-1 shadow-sm backdrop-blur-md">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute inset-0 rounded-full bg-primary-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          {/* CTA Button & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Link
                href="/#contact"
                className="btn-primary py-2.5 px-5 text-sm shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all"
              >
                Agendar Demo
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <button
          type="button"
          aria-hidden={!isMobileMenuOpen}
          className={`md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          id="mobile-menu"
          className={`md:hidden fixed inset-x-0 top-16 z-50 transition-all duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
        >
          <div className="mx-4 rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-xl backdrop-blur-md">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-3">
              <Link
                href="/#contact"
                className="btn-primary w-full justify-center text-center py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Agendar Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
