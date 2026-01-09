'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, LogOut } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hola, soy el asistente de Orkiosk. Puedes preguntarme sobre el funcionamiento de los quioscos, el panel de administración o cualquier duda técnica. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = '50px'; // Reset height
        setLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            const assistantMessage: Message = { role: 'assistant', content: data.content };
            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor inténtalo de nuevo.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInputCheck = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        // Auto-grow
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto border-x border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth" ref={scrollRef}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot size={18} className="text-blue-600 dark:text-blue-300" />
                            </div>
                        )}

                        <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-sm'
                                : 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-100 dark:border-zinc-700'
                            }`}>
                            <div className="prose dark:prose-invert prose-sm max-w-none text-sm leading-relaxed break-words">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0 mt-1">
                                <User size={18} className="text-gray-500 dark:text-gray-400" />
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-4 justify-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot size={18} className="text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="bg-gray-100 dark:bg-zinc-800 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5 border border-gray-100 dark:border-zinc-700">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="relative max-w-4xl mx-auto">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInputCheck}
                        onKeyDown={handleKeyDown}
                        placeholder="Escribe tu pregunta sobre Orkiosk aquí..."
                        className="w-full pl-5 pr-14 py-4 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none overflow-hidden shadow-sm transition-all"
                        rows={1}
                        style={{ minHeight: '56px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-zinc-600 transition-colors flex items-center justify-center h-8 w-8"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <p className="text-[10px] text-center text-gray-400 mt-2 uppercase tracking-wide">
                    Orkiosk AI Assistant - BETA
                </p>
            </div>
        </div>
    );
}
