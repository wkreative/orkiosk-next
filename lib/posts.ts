import { db } from './firebase';
import { collection, query, orderBy, getDocs, where, limit } from 'firebase/firestore';

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  author?: string;
  category?: string;
  image?: string;
  // SEO Fields
  focalKeyword?: string;
  metaDescription?: string;
  seoTitle?: string;
  // English translations
  titleEn?: string;
  excerptEn?: string;
  contentEn?: string;
  categoryEn?: string;
  enableComments?: boolean;
}

const BUILD_TIMEOUT = 30000; // 30 seconds timeout for data fetching (increased to prevent 404 errors)

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  const timeoutPromise = new Promise<T>((resolve) => {
    setTimeout(() => {
      console.warn(`Fetch timed out after ${timeoutMs}ms. Using fallback.`);
      resolve(fallback);
    }, timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]);
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const q = query(collection(db, 'posts'), orderBy('date', 'desc'));

    // During build, we want to fail fast if Firestore is unreachable
    const fetchPromise = getDocs(q).then(querySnapshot => {
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          slug: data.slug || doc.id,
          title: data.title || 'Sin título',
          excerpt: data.excerpt || '',
          date: data.date || new Date().toISOString(),
          content: data.content || '',
          author: data.author,
          category: data.category,
          image: data.image,
          focalKeyword: data.focalKeyword,
          metaDescription: data.metaDescription,
          seoTitle: data.seoTitle,
          // English translations
          titleEn: data.titleEn,
          excerptEn: data.excerptEn,
          contentEn: data.contentEn,
          categoryEn: data.categoryEn,
          enableComments: data.enableComments !== false,
        } as Post;
      });
    });

    return await withTimeout(fetchPromise, BUILD_TIMEOUT, []);
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    console.log(`[getPostBySlug] Fetching post with slug: "${slug}"`);
    const q = query(collection(db, 'posts'), where('slug', '==', slug), limit(1));

    const fetchPromise = getDocs(q).then(querySnapshot => {
      if (querySnapshot.empty) {
        console.log(`[getPostBySlug] No post found with slug: "${slug}"`);
        return null;
      }

      const data = querySnapshot.docs[0].data();
      console.log(`[getPostBySlug] Found post: "${data.title}"`);
      return {
        slug: data.slug || querySnapshot.docs[0].id,
        title: data.title || 'Sin título',
        excerpt: data.excerpt || '',
        date: data.date || new Date().toISOString(),
        content: data.content || '',
        author: data.author,
        category: data.category,
        image: data.image,
        focalKeyword: data.focalKeyword,
        metaDescription: data.metaDescription,
        seoTitle: data.seoTitle,
        titleEn: data.titleEn,
        excerptEn: data.excerptEn,
        contentEn: data.contentEn,
        categoryEn: data.categoryEn,
        enableComments: data.enableComments !== false,
      } as Post;
    });

    return await withTimeout(fetchPromise, BUILD_TIMEOUT, null);
  } catch (error) {
    console.error(`[getPostBySlug] Error getting post by slug ${slug}:`, error);
    return null;
  }
}

export async function getRecentPosts(count: number = 3): Promise<Post[]> {
  try {
    const q = query(collection(db, 'posts'), orderBy('date', 'desc'), limit(count));

    const fetchPromise = getDocs(q).then(querySnapshot => {
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          slug: data.slug || doc.id,
          title: data.title || 'Sin título',
          excerpt: data.excerpt || '',
          date: data.date || new Date().toISOString(),
          content: data.content || '',
          author: data.author,
          category: data.category,
          image: data.image,
          focalKeyword: data.focalKeyword,
          metaDescription: data.metaDescription,
          seoTitle: data.seoTitle,
          titleEn: data.titleEn,
          excerptEn: data.excerptEn,
          contentEn: data.contentEn,
          categoryEn: data.categoryEn,
          enableComments: data.enableComments !== false, // Default to true if missing
        } as Post;
      });
    });

    return await withTimeout(fetchPromise, BUILD_TIMEOUT, []);
  } catch (error) {
    console.error('Error getting recent posts:', error);
    return [];
  }
}

export async function getAllCategories(): Promise<string[]> {
  try {
    const posts = await getAllPosts();
    const categories = new Set<string>();

    posts.forEach((post) => {
      if (post.category) {
        categories.add(post.category);
      }
    });

    return Array.from(categories);
  } catch (error) {
    console.error('Error getting all categories:', error);
    return [];
  }
}

export async function updatePost(slug: string, data: Partial<Post>): Promise<void> {
  const { doc, updateDoc } = await import('firebase/firestore');

  // Since slug is the document ID in this system
  const postRef = doc(db, 'posts', slug);
  await updateDoc(postRef, data);
}
