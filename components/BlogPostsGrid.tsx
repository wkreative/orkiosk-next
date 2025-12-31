'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Search } from 'lucide-react';

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    category?: string;
    image?: string;
}

interface BlogPostsGridProps {
    posts: Post[];
    blogPrefix: string;
    allLabel?: string;
    readMoreLabel?: string;
}

export default function BlogPostsGrid({
    posts,
    blogPrefix,
    allLabel = 'Todos',
    readMoreLabel = 'Leer más'
}: BlogPostsGridProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryFromUrl = searchParams.get('category') || '';

    const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Extract unique categories (case-insensitive deduplication)
    const categories = useMemo(() => {
        const uniqueCategories = new Map<string, string>();

        posts.forEach((post) => {
            if (post.category) {
                const normalized = post.category.trim().toLowerCase();
                const display = post.category.trim();

                // If not exists, or if current version has uppercase (prefer "Tips" over "tips")
                if (!uniqueCategories.has(normalized) || (display !== normalized && display[0] === display[0].toUpperCase())) {
                    uniqueCategories.set(normalized, display);
                }
            }
        });

        return Array.from(uniqueCategories.values()).sort();
    }, [posts]);

    // Filter posts by category and search query
    const filteredPosts = useMemo(() => {
        let result = posts;

        // Filter by category
        if (selectedCategory) {
            const selectedNormalized = selectedCategory.trim().toLowerCase();
            result = result.filter((post) => {
                if (!post.category) return false;
                return post.category.trim().toLowerCase() === selectedNormalized;
            });
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((post) => {
                return (
                    post.title.toLowerCase().includes(query) ||
                    post.excerpt.toLowerCase().includes(query) ||
                    post.category?.toLowerCase().includes(query)
                );
            });
        }

        return result;
    }, [posts, selectedCategory, searchQuery]);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        const params = new URLSearchParams(searchParams.toString());
        if (category) {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        router.push(`${blogPrefix}?${params.toString()}`, { scroll: false });
    };

    return (
        <>
            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar artículos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
                <div className="flex flex-nowrap overflow-x-auto pb-4 md:pb-0 md:flex-wrap md:justify-center gap-3 mb-8 md:mb-12 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    <button
                        onClick={() => handleCategoryClick('')}
                        className={`px-4 py-2 md:px-5 md:py-2.5 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 flex-shrink-0 ${!selectedCategory
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 scale-105'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                            }`}
                    >
                        {allLabel}
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className={`px-4 py-2 md:px-5 md:py-2.5 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 flex-shrink-0 ${selectedCategory === category
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 scale-105'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            {/* Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                    <article
                        key={post.slug}
                        className="card group h-full flex flex-col animate-fade-in overflow-hidden"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        {/* Featured Image */}
                        <Link href={`${blogPrefix}/${post.slug}`} className="block">
                            <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                                {post.image ? (
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                                        <span className="text-white/80 font-heading text-4xl font-bold">
                                            {post.title.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Link>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                            {/* Category Badge */}
                            {post.category && (
                                <div className="mb-3">
                                    <button
                                        onClick={() => handleCategoryClick(post.category!)}
                                        className="text-primary-600 font-medium text-sm hover:text-primary-700 hover:underline transition-colors"
                                    >
                                        {post.category}
                                    </button>
                                </div>
                            )}

                            {/* Title */}
                            <h2 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                                <Link href={`${blogPrefix}/${post.slug}`}>
                                    {post.title}
                                </Link>
                            </h2>

                            {/* Excerpt */}
                            <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                                {post.excerpt}
                            </p>

                            {/* Read More */}
                            <Link
                                href={`${blogPrefix}/${post.slug}`}
                                className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors mt-auto"
                            >
                                <span>{readMoreLabel}</span>
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            {/* No results */}
            {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        {searchQuery ? 'No se encontraron artículos con esa búsqueda.' : 'No hay artículos en esta categoría.'}
                    </p>
                    <button
                        onClick={() => {
                            setSelectedCategory('');
                            setSearchQuery('');
                            handleCategoryClick('');
                        }}
                        className="mt-4 text-primary-600 font-semibold hover:text-primary-700"
                    >
                        Ver todos los artículos
                    </button>
                </div>
            )}
        </>
    );
}
