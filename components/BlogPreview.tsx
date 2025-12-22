import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { getRecentPosts, type Post } from '@/lib/posts'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="card group h-full flex flex-col">
      {/* Date Badge */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <Calendar className="w-4 h-4" />
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        {post.category && (
          <>
            <span className="text-gray-300">•</span>
            <span className="text-primary-600 font-medium">{post.category}</span>
          </>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
        <Link href={`/blog/${post.slug}`} className="before:absolute before:inset-0">
          {post.title}
        </Link>
      </h3>

      {/* Excerpt */}
      <p className="text-gray-600 mb-6 flex-grow">
        {post.excerpt}
      </p>

      {/* Read More Link */}
      <Link
        href={`/blog/${post.slug}`}
        className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
      >
        <span>Leer más</span>
        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </article>
  )
}

export default function BlogPreview() {
  const recentPosts = getRecentPosts(3)

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
            Blog
          </span>
          <h2
            id="blog-heading"
            className="section-title"
          >
            Últimos Artículos
          </h2>
          <p className="section-subtitle mt-4">
            Descubre consejos, tendencias y novedades sobre optimización de negocios, transformación digital y tecnología de autoservicio.
          </p>
        </div>

        {/* Posts Grid */}
        {recentPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No hay artículos publicados aún.
            </p>
            <Link href="/admin" className="btn-primary">
              Crear Primer Artículo
            </Link>
          </div>
        )}

        {/* View All Link */}
        {recentPosts.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="btn-secondary"
            >
              Ver Todos los Artículos
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
