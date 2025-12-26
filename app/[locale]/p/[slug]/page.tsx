import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug, getPublishedPages } from '@/lib/pages'
import { getTranslations, type Locale } from '@/lib/i18n'
import SiteShell from '@/components/SiteShell'

interface Props {
    params: { locale: Locale; slug: string }
}

export async function generateStaticParams() {
    const pages = await getPublishedPages()
    const locales = ['es', 'en']

    return locales.flatMap((locale) =>
        pages.map((page) => ({
            locale,
            slug: page.slug,
        }))
    )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const page = await getPageBySlug(params.slug)

    if (!page) {
        return { title: 'Página no encontrada' }
    }

    const title = page.seoTitle || page.title
    const description = page.metaDescription || `${page.title} - Orkiosk`
    const url = `https://orkiosk.com/${params.locale}/${params.slug}`

    const imageUrl = 'https://orkiosk.com/images/logo.png'

    return {
        title,
        description,
        keywords: page.focalKeyword,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            type: 'website',
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

export default async function DynamicPage({ params }: Props) {
    const page = await getPageBySlug(params.slug)
    const copy = await getTranslations(params.locale)

    if (!page || !page.published) {
        notFound()
    }

    return (
        <SiteShell locale={params.locale} copy={copy}>
            <article className="pt-4">
                {/* Hero Section */}
                <header className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 leading-tight">
                            {page.title}
                        </h1>
                    </div>
                </header>

                {/* Content */}
                <section className="py-12 md:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </div>
                </section>
            </article>
        </SiteShell>
    )
}
