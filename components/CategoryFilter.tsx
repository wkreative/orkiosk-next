'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface CategoryFilterProps {
    categories: string[];
    locale: string;
    allLabel?: string;
}

export default function CategoryFilter({ categories, locale, allLabel = 'Todos' }: CategoryFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentCategory = searchParams.get('category') || '';

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (category) {
            params.set('category', category);
        } else {
            params.delete('category');
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    if (categories.length === 0) return null;

    return (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
                onClick={() => handleCategoryChange('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!currentCategory
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
            >
                {allLabel}
            </button>
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentCategory === category
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
