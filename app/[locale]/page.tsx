import type { Metadata } from 'next'
import { getRecentPosts } from '@/lib/posts'
import { getTranslations, locales, type Locale, translatePost } from '@/lib/i18n'
import SiteShell from '@/components/SiteShell'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import BlogPreview from '@/components/BlogPreview'
import Contact from '@/components/Contact'

interface PageProps {
  params: { locale: Locale }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const copy = await getTranslations(params.locale)
  const title = copy.hero.heading
  const description = copy.hero.subheading
  const url = `https://orkiosk.com/${params.locale}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const copy = await getTranslations(params.locale)
  const recentPosts = await getRecentPosts(3)
  const posts = await Promise.all(
    recentPosts.map((post) => translatePost(post, params.locale, false)),
  )

  return (
    <SiteShell locale={params.locale} copy={copy}>
      <Hero copy={copy.hero} />
      <Features copy={copy.features} locale={params.locale} />
      <BlogPreview posts={posts} copy={copy.blogPreview} locale={params.locale} />
      <Contact copy={copy.contact} />
    </SiteShell>
  )
}
