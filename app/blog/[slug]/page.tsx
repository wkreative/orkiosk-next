import { redirect } from 'next/navigation'

export default function BlogPostRedirect({ params }: { params: { slug: string } }) {
  redirect(`/es/blog/${params.slug}`)
}
