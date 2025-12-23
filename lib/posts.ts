import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function resolvePostSlug(data: Record<string, unknown>, fileName: string): string {
  const rawSlug = typeof data.slug === 'string' ? data.slug : fileName.replace(/\.md$/, '')
  return slugify(rawSlug)
}

export interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  content: string
  author?: string
  category?: string
  image?: string
}

export function getAllPosts(): Post[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug: resolvePostSlug(data, fileName),
        title: data.title || 'Sin titulo',
        excerpt: data.excerpt || '',
        date: data.date || new Date().toISOString(),
        content,
        author: data.author,
        category: data.category,
        image: data.image,
      }
    })

  // Sort posts by date
  return allPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const normalizedSlug = slugify(slug)
    const fileNames = fs.readdirSync(postsDirectory)
    const match = fileNames.find((fileName) => {
      if (!fileName.endsWith('.md')) {
        return false
      }
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      return resolvePostSlug(data, fileName) === normalizedSlug
    })

    if (!match) {
      return null
    }

    const fullPath = path.join(postsDirectory, match)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug: resolvePostSlug(data, match),
      title: data.title || 'Sin titulo',
      excerpt: data.excerpt || '',
      date: data.date || new Date().toISOString(),
      content,
      author: data.author,
      category: data.category,
      image: data.image,
    }
  } catch {
    return null
  }
}

export function getRecentPosts(count: number = 3): Post[] {
  const allPosts = getAllPosts()
  return allPosts.slice(0, count)
}

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const categories = new Set<string>()

  posts.forEach((post) => {
    if (post.category) {
      categories.add(post.category)
    }
  })

  return Array.from(categories)
}
