'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect, useRef, useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
    Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Quote, Undo, Redo,
    Heading1, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, Youtube as YoutubeIcon,
    AlignLeft, AlignCenter, AlignRight, Type
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
                autolink: true
            }),
            Youtube.configure({
                controls: true,
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[500px] px-4 py-3 text-gray-900 dark:text-gray-900',
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
            const timestamp = Date.now();
            const filename = `blog/${timestamp}-${file.name}`;
            const storageRef = ref(storage, filename);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            editor.chain().focus().setImage({ src: url }).run();
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
        const previousUrl = editor.getAttributes('link').href;

        // If already linked, ask to remove or edit
        if (previousUrl) {
            editor.chain().focus().unsetLink().run();
            return;
        }

        const url = window.prompt('URL del enlace:', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // If no text is selected, insert the URL as text and link it
        if (editor.state.selection.empty) {
            editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
        } else {
            // update link
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    const addYoutube = () => {
        const url = prompt('Ingrese la URL del video de YouTube:');
        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
                width: 640,
                height: 480,
            });
        }
    };

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
                {/* Text Style */}
                <div className="flex bg-white rounded-lg border border-gray-200 p-1 gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('bold') ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        title="Negrita"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('italic') ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        title="Cursiva"
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('underline') ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        title="Subrayado"
                    >
                        <UnderlineIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Headings */}
                <div className="flex bg-white rounded-lg border border-gray-200 p-1 gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('paragraph') ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        title="Párrafo Normal"
                    >
                        <Type className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        title="Título 1 (Grande)"
                    >
                        <Heading1 className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        title="Título 2 (Mediano)"
                    >
                        <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        title="Título 3 (Pequeño)"
                    >
                        <Heading3 className="w-4 h-4" />
                    </button>
                </div>

                {/* Alignment */}
                <div className="flex bg-white rounded-lg border border-gray-200 p-1 gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        title="Alinear Izquierda"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        title="Centrar"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        title="Alinear Derecha"
                    >
                        <AlignRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Lists & Quotes */}
                <div className="flex bg-white rounded-lg border border-gray-200 p-1 gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('bulletList') ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        title="Lista"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('orderedList') ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        title="Lista numerada"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('blockquote') ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        title="Cita"
                    >
                        <Quote className="w-4 h-4" />
                    </button>
                </div>

                {/* Media */}
                <div className="flex bg-white rounded-lg border border-gray-200 p-1 gap-1">
                    <button
                        type="button"
                        onClick={addLink}
                        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('link') ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        title={editor.isActive('link') ? "Quitar enlace" : "Agregar enlace"}
                    >
                        <LinkIcon className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={addImage}
                        className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600"
                        title="Agregar imagen"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={addYoutube}
                        className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600"
                        title="Insertar Video de Youtube"
                    >
                        <YoutubeIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* History */}
                <div className="flex bg-white rounded-lg border border-gray-200 p-1 gap-1 ml-auto">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="p-1.5 rounded hover:bg-gray-100 transition-colors disabled:opacity-30 text-gray-600"
                        title="Deshacer"
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} className="bg-white min-h-[500px]" />

            {/* Hidden file input for image upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />

            {uploading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20">
                    <span className="text-primary-600 font-medium">Subiendo imagen...</span>
                </div>
            )}
        </div>
    );
}
