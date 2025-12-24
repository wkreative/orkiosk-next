'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import PostForm from '@/components/admin/PostForm';

export default function NewPostPage() {
    return (
        <AdminLayout>
            <div className="py-4">
                <PostForm />
            </div>
        </AdminLayout>
    );
}
