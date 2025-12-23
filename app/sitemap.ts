import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://orkiosk.com'
  const locales = ['es', 'en']
  const posts = getAllPosts()

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

  // Blog posts
  const blogPosts = locales.flatMap((locale) =>
    posts.map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: locale === 'es' ? 0.6 : 0.5,
    })),
  )

  return [...staticPages, ...blogPosts]
}
