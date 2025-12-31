'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/lib/settings';

export default function SettingsPanel() {
    const [enableComments, setEnableComments] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            const settings = await getSettings();
            setEnableComments(settings.enableComments);
            setLoading(false);
        }
        fetch();
    }, []);

    const toggleComments = async () => {
        const newState = !enableComments;
        setEnableComments(newState);
        await updateSettings({ enableComments: newState });
    };

    if (loading) return <div className="p-4 text-gray-500">Cargando configuración...</div>;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Configuración General</h3>

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h4 className="font-medium text-gray-900">Comentarios en el Blog</h4>
                    <p className="text-sm text-gray-500">
                        Habilita o deshabilita la sección de comentarios para todos los artículos.
                    </p>
                </div>

                <button
                    onClick={toggleComments}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${enableComments ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                    role="switch"
                    aria-checked={enableComments}
                >
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enableComments ? 'translate-x-5' : 'translate-x-0'
                            }`}
                    />
                </button>
            </div>
        </div>
    );
}
