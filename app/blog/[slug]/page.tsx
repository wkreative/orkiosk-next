import { redirect } from 'next/navigation'
import { getAllPosts } from '@/lib/posts'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostRedirect({ params }: { params: { slug: string } }) {
  redirect(`/es/blog/${params.slug}`)
}
