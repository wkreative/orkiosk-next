'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import PostForm from '@/components/admin/PostForm';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function EditPostPage() {
    const params = useParams();
    const id = params?.id as string;
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            const docRef = doc(db, 'posts', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setPost({ id: docSnap.id, ...docSnap.data() });
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="py-4">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : post ? (
                    <PostForm initialData={post} isEditing={true} />
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900">Post no encontrado</h2>
                        <p className="text-gray-500 mt-2">El پست que buscas no existe o fue eliminado.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
