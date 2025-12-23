import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { getAllPosts } from '@/lib/posts'

const STOP_WORDS = new Set([
  'a', 'al', 'algo', 'ante', 'antes', 'bajo', 'bien', 'cada', 'como', 'con',
  'contra', 'cual', 'cuales', 'cuando', 'de', 'del', 'desde', 'donde', 'dos',
  'el', 'ella', 'ellas', 'ellos', 'en', 'entre', 'era', 'eramos', 'es', 'esa',
  'esas', 'ese', 'eso', 'esos', 'esta', 'estas', 'este', 'esto', 'estos',
  'fue', 'fueron', 'ha', 'hasta', 'hay', 'la', 'las', 'le', 'les', 'lo', 'los',
  'mas', 'me', 'mi', 'mientras', 'muy', 'no', 'nos', 'o', 'otra', 'otras',
  'otro', 'otros', 'para', 'pero', 'por', 'porque', 'que', 'se', 'sin', 'sobre',
  'su', 'sus', 'tambien', 'tan', 'tanto', 'te', 'tu', 'tus', 'un', 'una', 'uno',
  'unos', 'unas', 'y', 'ya',
])

function normalizeToken(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractKeywords(text: string): string[] {
  const normalized = normalizeToken(text)
  if (!normalized) {
    return []
  }
  const counts = new Map<string, number>()
  normalized.split(' ').forEach((word) => {
    if (word.length < 3 || STOP_WORDS.has(word)) {
      return
    }
    counts.set(word, (counts.get(word) ?? 0) + 1)
  })
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
}

function buildBlogKeywords(): string[] {
  const posts = getAllPosts()
  const combined = posts
    .map((post) => [post.title, post.excerpt, post.category ?? ''].join(' '))
    .join(' ')
  const keywords = extractKeywords(combined)
  return Array.from(new Set(keywords)).slice(0, 20)
}

export function generateMetadata(): Metadata {
  const description =
    'Descubre consejos, tendencias y novedades sobre optimizacion de negocios, transformacion digital y tecnologia de autoservicio.'
  return {
    title: 'Blog',
    description,
    keywords: buildBlogKeywords(),
    alternates: {
      canonical: 'https://orkiosk.com/blog',
    },
    openGraph: {
      title: 'Blog | Orkiosk',
      description,
      url: 'https://orkiosk.com/blog',
      type: 'website',
    },
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="pt-20 md:pt-24">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-6">
            Blog de <span className="text-gradient">Orkiosk</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre consejos, tendencias y novedades sobre optimizacion de negocios, transformacion digital y tecnologia de autoservicio.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="card group h-full flex flex-col"
                >
                  {/* Date Badge */}
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    {post.category && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span className="text-primary-600 font-medium">{post.category}</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    <Link href={`/blog/${post.slug}`} >
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-6 flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Read More Link */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                  >
                    <span>Leer mas</span>
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">
                No hay artículos publicados aún.
              </p>
              <Link href="/admin" className="btn-primary">Crear Primer Articulo</Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            ¿Quieres estar actualizado?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Suscríbete a nuestro boletín y recibe las últimas noticias sobre tecnología y optimización de negocios.
          </p>
          <Link href="/#contact" className="btn-secondary bg-white text-primary-600 border-white hover:bg-primary-50">Contactanos</Link>
        </div>
      </section>
    </div>
  )
}
