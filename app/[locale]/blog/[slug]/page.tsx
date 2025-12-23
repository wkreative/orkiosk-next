import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft } from 'lucide-react'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { getTranslations, locales, type Locale, translatePost } from '@/lib/i18n'

interface Props {
  params: { locale: Locale; slug: string }
}

const STOP_WORDS = new Set([
  'a', 'al', 'algo', 'ante', 'antes', 'bajo', 'bien', 'cada', 'como', 'con',
  'contra', 'cual', 'cuales', 'cuando', 'de', 'del', 'desde', 'donde', 'dos',
  'el', 'ella', 'ellas', 'ellos', 'en', 'entre', 'era', 'eramos', 'es', 'esa',
  'esas', 'ese', 'eso', 'esos', 'esta', 'estas', 'este', 'esto', 'estos',
  'fue', 'fueron', 'ha', 'hasta', 'hay', 'la', 'las', 'le', 'les', 'lo', 'los',
  'mas', 'me', 'mi', 'mientras', 'muy', 'no', 'nos', 'o', 'otra', 'otras',
  'otro', 'otros', 'para', 'pero', 'por', 'porque', 'que', 'se', 'sin', 'sobre',
  'su', 'sus', 'tambien', 'tan', 'tanto', 'te', 'tu', 'tus', 'un', 'una', 'uno',
  'unos', 'unas', 'y', 'ya', 'the', 'and', 'for', 'with', 'from', 'that', 'this',
  'you', 'your', 'are', 'was', 'were', 'our', 'not', 'but', 'into', 'over', 'new',
])

function normalizeToken(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
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

function buildKeywords(texts: string[]): string[] {
  const keywords = texts.flatMap((text) => extractKeywords(text))
  return Array.from(new Set(keywords)).slice(0, 20)
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return locales.flatMap((locale) =>
    posts.map((post) => ({
      locale,
      slug: post.slug,
    })),
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) {
    return {
      title: 'Articulo no encontrado',
    }
  }

  const translated = await translatePost(post, params.locale, false)
  const shareUrl = `https://orkiosk.com/${params.locale}/blog/${translated.slug}`
  const imageUrl = translated.image
    ? translated.image.startsWith('http')
      ? translated.image
      : `https://orkiosk.com${translated.image}`
    : 'https://orkiosk.com/images/logo.png'

  return {
    title: translated.title,
    description: translated.excerpt,
    alternates: {
      canonical: shareUrl,
    },
    keywords: buildKeywords([
      translated.title,
      translated.excerpt,
      translated.category ?? '',
      translated.content,
    ]),
    openGraph: {
      title: translated.title,
      description: translated.excerpt,
      type: 'article',
      url: shareUrl,
      publishedTime: translated.date,
      authors: translated.author ? [translated.author] : ['Orkiosk'],
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title: translated.title,
      description: translated.excerpt,
      images: [imageUrl],
    },
  }
}

function formatDate(dateString: string, locale: Locale): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  const copy = await getTranslations(params.locale)

  if (!post) {
    notFound()
  }

  const translated = await translatePost(post, params.locale, true)
  const shareUrl = `https://orkiosk.com/${params.locale}/blog/${translated.slug}`
  const imageUrl = translated.image
    ? translated.image.startsWith('http')
      ? translated.image
      : `https://orkiosk.com${translated.image}`
    : 'https://orkiosk.com/images/logo.png'
  const relatedPosts = await Promise.all(
    getAllPosts()
      .filter((item) => item.slug !== post.slug)
      .slice(0, 3)
      .map((item) => translatePost(item, params.locale, false)),
  )
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: translated.title,
    description: translated.excerpt,
    datePublished: translated.date,
    dateModified: translated.date,
    author: translated.author
      ? { '@type': 'Person', name: translated.author }
      : { '@type': 'Organization', name: 'Orkiosk' },
    publisher: {
      '@type': 'Organization',
      name: 'Orkiosk',
      logo: {
        '@type': 'ImageObject',
        url: 'https://orkiosk.com/images/logo.png',
      },
    },
    url: shareUrl,
    mainEntityOfPage: shareUrl,
    image: [imageUrl],
    keywords: buildKeywords([
      translated.title,
      translated.excerpt,
      translated.category ?? '',
      translated.content,
    ]),
  }

  const renderContent = (content: string) => {
    const paragraphs = content.split('

').filter((p) => p.trim())
    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-8 mb-3">{paragraph.slice(3)}</h2>
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mt-6 mb-2">{paragraph.slice(4)}</h3>
      }
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('
').filter((p) => p.trim())
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4">
            {items.map((item, i) => (
              <li key={i}>{item.slice(2)}</li>
            ))}
          </ul>
        )
      }
      return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>
    })
  }

  return (
    <article className="pt-20 md:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <header className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href={`/${params.locale}/blog`}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>{params.locale === 'en' ? 'Back to blog' : 'Volver al blog'}</span>
          </Link>

          {/* Category & Date */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
            <time dateTime={translated.date} className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(translated.date, params.locale)}
            </time>
            {translated.category && (
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
                {translated.category}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 leading-tight mb-6">
            {translated.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {translated.excerpt}
          </p>

          {/* Author */}
          {translated.author && (
            <div className="mt-6 flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                {translated.author.charAt(0)}
              </div>
              <span className="text-gray-700 font-medium">{translated.author}</span>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          {renderContent(translated.content)}
        </div>
      </div>

      {/* Share Section */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">
            {copy.blogPost.sharePrompt}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://x.com/intent/post?text=${encodeURIComponent(translated.title)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              {copy.blogPost.shareX}
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              {copy.blogPost.shareFacebook}
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              {copy.blogPost.shareLinkedIn}
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${translated.title} ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              {copy.blogPost.shareWhatsapp}
            </a>
          </div>
        </div>
      </section>

      {/* Recommended Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-heading font-semibold text-gray-900 mb-6 text-center">
              {copy.blogPost.recommendedTitle}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${params.locale}/blog/${item.slug}`}
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
