import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { type Post } from '@/lib/posts'

export type BlogPreviewCopy = {
  label: string
  title: string
  subtitle: string
  readMore: string
  emptyMessage: string
  emptyButton: string
  viewAll: string
}

const defaultCopy: BlogPreviewCopy = {
  label: 'Blog',
  title: '?ltimos Art?culos',
  subtitle:
    'Descubre consejos, tendencias y novedades sobre optimizaci?n de negocios, transformaci?n digital y tecnolog?a de autoservicio.',
  readMore: 'Leer m?s',
  emptyMessage: 'No hay art?culos publicados a?n.',
  emptyButton: 'Crear Primer Art?culo',
  viewAll: 'Ver Todos los Art?culos',
}

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function PostCard({ post, locale, copy }: { post: Post; locale: string; copy: BlogPreviewCopy }) {
  const blogHref = `/${locale}/blog/${post.slug}`

  return (
    <article className="card group h-full flex flex-col">
      {/* Date Badge */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <Calendar className="w-4 h-4" />
        <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
        {post.category && (
          <>
            <span className="text-gray-300">|</span>
            <span className="text-primary-600 font-medium">{post.category}</span>
          </>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
        <Link href={blogHref}>
          {post.title}
        </Link>
      </h3>

      {/* Excerpt */}
      <p className="text-gray-600 mb-6 flex-grow">
        {post.excerpt}
      </p>

      {/* Read More Link */}
      <Link
        href={blogHref}
        className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
      >
        <span>{copy.readMore}</span>
        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </article>
  )
}

export default function BlogPreview({
  posts,
  copy = defaultCopy,
  locale = 'es',
}: {
  posts: Post[]
  copy?: BlogPreviewCopy
  locale?: string
}) {
  const blogIndexHref = `/${locale}/blog`
  const adminHref = 'https://orkiosk-web.web.app/admin'

  return (
    <section
      id="blog"
      className="py-20 md:py-32 bg-gray-50"
      aria-labelledby="blog-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
            {copy.label}
          </span>
          <h2
            id="blog-heading"
            className="section-title"
          >
            {copy.title}
          </h2>
          <p className="section-subtitle mt-4">
            {copy.subtitle}
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} copy={copy} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              {copy.emptyMessage}
            </p>
            <Link href={adminHref} className="btn-primary">
              {copy.emptyButton}
            </Link>
          </div>
        )}

        {/* View All Link */}
        {posts.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href={blogIndexHref}
              className="btn-secondary"
            >
              {copy.viewAll}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
