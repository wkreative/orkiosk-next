import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft } from 'lucide-react'
import { getPostBySlug, getAllPosts } from '@/lib/posts'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Artículo no encontrado',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: post.author ? [post.author] : ['Orkiosk'],
      images: post.image ? [{ url: post.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
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

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  const shareUrl = `https://orkiosk.com/blog/${params.slug}`
  const relatedPosts = getAllPosts()
    .filter((item) => item.slug !== post?.slug)
    .slice(0, 3)

  if (!post) {
    notFound()
  }

  // Simple markdown rendering (for production, use @tailwindcss/typography)
  const renderContent = (content: string) => {
    const paragraphs = content.split('\n\n').filter(p => p.trim())
    return paragraphs.map((paragraph, index) => {
      // Headers
      if (paragraph.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-8 mb-3">{paragraph.slice(3)}</h2>
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mt-6 mb-2">{paragraph.slice(4)}</h3>
      }
      // Lists
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(p => p.trim())
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4">
            {items.map((item, i) => (
              <li key={i}>{item.slice(2)}</li>
            ))}
          </ul>
        )
      }
      // Paragraphs
      return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>
    })
  }

  return (
    <article className="pt-20 md:pt-24">
      {/* Hero Section */}
      <header className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Volver al blog</span>
          </Link>

          {/* Category & Date */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
            <time dateTime={post.date} className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(post.date)}
            </time>
            {post.category && (
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
                {post.category}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author */}
          {post.author && (
            <div className="mt-6 flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                {post.author.charAt(0)}
              </div>
              <span className="text-gray-700 font-medium">{post.author}</span>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          {renderContent(post.content)}
        </div>
      </div>

      {/* Share Section */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">
            ¿Te gustó este artículo? Compártelo con otros
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://x.com/intent/post?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              Compartir en X
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              Compartir en Facebook
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              Compartir en LinkedIn
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              Compartir en WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Recommended Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-heading font-semibold text-gray-900 mb-6 text-center">
              Publicaciones recomendadas
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group rounded-2xl border border-gray-200 p-5 text-left transition-colors hover:border-primary-300"
                >
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                    {item.category || 'Orkiosk'}
                  </p>
                  <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </article>
  )
}
