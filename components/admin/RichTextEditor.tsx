'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEffect, useRef, useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
    Bold, Italic, List, ListOrdered, Quote, Undo, Redo,
    Heading1, Heading2, Link as LinkIcon, Image as ImageIcon
} from 'lucide-react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: content,
        immediatelyRender: false, // Fix SSR hydration issue
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[500px] px-4 py-3',
            },
        },
    });

    // Update editor content when prop changes (for editing existing posts)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);

            // Create a unique filename
            const timestamp = Date.now();
            const filename = `blog/${timestamp}-${file.name}`;
            const storageRef = ref(storage, filename);

            // Upload file
            await uploadBytes(storageRef, file);

            // Get download URL
            const url = await getDownloadURL(storageRef);

            // Insert image into editor
            editor.chain().focus().setImage({ src: url }).run();

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen. Por favor intenta de nuevo.');
        } finally {
            setUploading(false);
        }
    };

    const addImage = () => {
        fileInputRef.current?.click();
    };

    const addLink = () => {
        const url = window.prompt('URL del enlace:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('bold') ? 'bg-white shadow-sm' : ''}`}
                    title="Negrita"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('italic') ? 'bg-white shadow-sm' : ''}`}
                    title="Cursiva"
                >
                    <Italic className="w-4 h-4" />
                </button>

                <div className="w-px bg-gray-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-white shadow-sm' : ''}`}
                    title="Título 1"
                >
                    <Heading1 className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-white shadow-sm' : ''}`}
                    title="Título 2"
                >
                    <Heading2 className="w-4 h-4" />
                </button>

                <div className="w-px bg-gray-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('bulletList') ? 'bg-white shadow-sm' : ''}`}
                    title="Lista"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('orderedList') ? 'bg-white shadow-sm' : ''}`}
                    title="Lista numerada"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('blockquote') ? 'bg-white shadow-sm' : ''}`}
                    title="Cita"
                >
                    <Quote className="w-4 h-4" />
                </button>

                <div className="w-px bg-gray-300 mx-1" />

                <button
                    type="button"
                    onClick={addLink}
                    className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('link') ? 'bg-white shadow-sm' : ''}`}
                    title="Agregar enlace"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={addImage}
                    className="p-2 rounded hover:bg-white transition-colors"
                    title="Agregar imagen"
                >
                    <ImageIcon className="w-4 h-4" />
                </button>

                <div className="w-px bg-gray-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-white transition-colors disabled:opacity-30"
                    title="Deshacer"
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-white transition-colors disabled:opacity-30"
                    title="Rehacer"
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} className="bg-white" />

            {/* Hidden file input for image upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
        </div>
    );
}
