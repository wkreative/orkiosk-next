'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = new Set<string>();
        posts.forEach((post) => {
            if (post.category) {
                cats.add(post.category);
            }
        });
        return Array.from(cats).sort();
    }, [posts]);

    // Filter posts by category
    const filteredPosts = useMemo(() => {
        if (!selectedCategory) return posts;
        return posts.filter((post) => post.category === selectedCategory);
    }, [posts, selectedCategory]);

    return (
        <>
            {/* Category Filter */}
            {categories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    <button
                        onClick={() => setSelectedCategory('')}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${!selectedCategory
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 scale-105'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                            }`}
                    >
                        {allLabel}
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${selectedCategory === category
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
                        className="card group h-full flex flex-col animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        {/* Category Badge */}
                        {post.category && (
                            <div className="mb-4">
                                <span className="text-primary-600 font-medium text-sm">{post.category}</span>
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
                    </article>
                ))}
            </div>

            {/* No results */}
            {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No hay artículos en esta categoría.</p>
                    <button
                        onClick={() => setSelectedCategory('')}
                        className="mt-4 text-primary-600 font-semibold hover:text-primary-700"
                    >
                        Ver todos los artículos
                    </button>
                </div>
            )}
        </>
    );
}
