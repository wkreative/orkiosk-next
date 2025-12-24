import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

// Helper to safely parse dates
function safeDate(dateValue: any): Date {
  try {
    // Handle Firestore Timestamp
    if (dateValue?.toDate) {
      return dateValue.toDate()
    }
    // Handle string or Date
    const parsed = new Date(dateValue)
    if (isNaN(parsed.getTime())) {
      return new Date() // Fallback to today
    }
    return parsed
  } catch {
    return new Date() // Fallback to today
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://orkiosk.com'
  const locales = ['es', 'en']
  const posts = await getAllPosts()

  // Static pages
  const staticPages = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: locale === 'es' ? 1 : 0.9,
    },
    {
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: locale === 'es' ? 0.8 : 0.7,
    },
  ])

  // Blog posts with safe date parsing
  const blogPosts = locales.flatMap((locale) =>
    posts.map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: safeDate(post.date),
      changeFrequency: 'monthly' as const,
      priority: locale === 'es' ? 0.6 : 0.5,
    })),
  )

  return [...staticPages, ...blogPosts]
}
