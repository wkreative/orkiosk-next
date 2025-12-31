import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft } from 'lucide-react'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { getTranslations, locales, type Locale, translatePost } from '@/lib/i18n'
import SiteShell from '@/components/SiteShell'
import CommentsSection from '@/components/CommentsSection'

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
  const posts = await getAllPosts()
  return locales.flatMap((locale) =>
    posts.map((post) => ({
      locale,
      slug: post.slug,
    })),
  )
}

// Revalidate every 60 seconds and allow dynamic params for new posts
export const revalidate = 60
export const dynamicParams = true

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const copy = await getTranslations(params.locale)
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const translatedPost = await translatePost(post, params.locale, false)
  const url = `https://orkiosk.com/${params.locale}/blog/${params.slug}`

  // Use SEO fields if provided, otherwise use defaults
  const title = translatedPost.seoTitle || translatedPost.title
  const description = translatedPost.metaDescription || translatedPost.excerpt

  // Build keywords: prioritize focal keyword, then extract from content
  let keywords = []
  if (translatedPost.focalKeyword) {
    keywords.push(translatedPost.focalKeyword)
  }
  if (translatedPost.category) {
    keywords.push(translatedPost.category)
  }
  // Extract additional keywords from title and excerpt
  const additionalKeywords = buildKeywords([translatedPost.title, translatedPost.excerpt])
  keywords = [...keywords, ...additionalKeywords].slice(0, 10) // Max 10 keywords

  // Ensure absolute URL for image
  const imageUrl = translatedPost.image
    ? translatedPost.image.startsWith('http')
      ? translatedPost.image
      : `https://orkiosk.com${translatedPost.image}`
    : 'https://orkiosk.com/images/logo.png'

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: translatedPost.date,
      authors: [translatedPost.author || 'Orkiosk'],
      section: translatedPost.category,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
  const post = await getPostBySlug(params.slug)
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
  const allPosts = await getAllPosts()
  const relatedPosts = await Promise.all(
    allPosts
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
    // If content is HTML (from visual editor), render it directly
    if (content.includes('<')) {
      return (
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    }

    // Otherwise, render as Markdown (legacy content)
    const paragraphs = content.split('\n\n').filter((p) => p.trim())
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
        const items = paragraph.split('\n').filter((p) => p.trim())
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
    <SiteShell locale={params.locale} copy={copy}>
      <article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Full-Width Hero Image */}
        {translated.image && (
          <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
            <img
              src={translated.image}
              alt={translated.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        )}

        {/* Post Info Section */}
        <header className={`py-12 md:py-16 ${translated.image ? 'bg-white' : 'bg-gradient-to-b from-primary-50 to-white pt-20'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Link */}
            <Link
              href={`/${params.locale}/blog`}
              className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>{params.locale === 'en' ? 'Back to blog' : 'Volver al blog'}</span>
            </Link>

            {/* Category */}
            {translated.category && (
              <div className="mb-6">
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium text-sm">
                  {translated.category}
                </span>
              </div>
            )}

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
              <div className="mt-8 flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {translated.author.charAt(0)}
                </div>
                <div>
                  <span className="text-gray-900 font-medium block">{translated.author}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(translated.date).toLocaleDateString(params.locale === 'en' ? 'en-US' : 'es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>



        // Inside BlogPostPage function, before Share Section:

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose prose-lg max-w-none">
            {renderContent(translated.content)}
          </div>
        </div>

        {/* Comments Section */}
        <CommentsSection slug={translated.slug} />

        {/* Share Section */}
        <section className="py-12 bg-gray-50 border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-600 mb-4">
              {copy.blogPost.sharePrompt}
            </p>
            <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-center">
              <a
                href={`https://x.com/intent/post?text=${encodeURIComponent(translated.title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                {copy.blogPost.shareX}
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                {copy.blogPost.shareFacebook}
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                {copy.blogPost.shareLinkedIn}
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${translated.title} ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M18.88 3.518A10.45 10.45 0 0011.516.44h-.016c-5.776 0-10.472 4.696-10.476 10.474a10.435 10.435 0 001.603 5.56L.96 23.01l6.674-1.752a10.451 10.451 0 005.003 1.15h.007c5.776 0 10.472-4.697 10.476-10.476a10.437 10.437 0 00-4.24-8.414zM12.636 19.34a8.877 8.877 0 01-4.526-1.157l-.325-.192-3.363.882.898-3.278-.212-.338A8.86 8.86 0 012.613 10.915c.003-4.9 3.992-8.887 8.892-8.887.005 0 .01.002.015.002 4.904.004 8.887 3.987 8.887 8.891a8.877 8.877 0 01-7.771 8.419zm4.869-6.657c-.267-.133-1.58-.78-1.824-.87-.245-.088-.423-.132-.601.134-.179.266-.69.87-.846 1.047-.155.178-.311.199-.578.066-.267-.133-1.127-.416-2.147-1.325-.795-.71-1.332-1.586-1.488-1.854-.156-.266-.017-.41.116-.543.12-.121.267-.312.4-.468.134-.155.179-.266.267-.444.089-.178.045-.333-.022-.467-.067-.133-.601-1.448-.823-1.983-.217-.52-.437-.45-.601-.458l-.512-.008c-.178 0-.467.067-.711.333-.245.267-.935.913-.935 2.226s.957 2.583 1.09 2.76c.134.178 1.884 2.877 4.565 4.035 1.554.671 2.158.647 2.946.568.873-.087 1.58-.646 1.802-1.27.222-.623.222-1.157.155-1.269-.067-.112-.244-.178-.511-.312z" clipRule="evenodd" /></svg>
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
    </SiteShell>
  )
}
