'use client';

import { useState, useEffect } from 'react';
import { Loader2, User, Ban, CheckCircle, Search } from 'lucide-react';

interface ChatUser {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    disabled: boolean;
    lastSignInTime: string;
    creationTime: string;
}

export default function ChatUsersPage() {
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [toggling, setToggling] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.users) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAccess = async (uid: string, currentStatus: boolean) => {
        setToggling(uid);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, disabled: !currentStatus })
            });
            const data = await res.json();
            if (data.success) {
                setUsers(prev => prev.map(u =>
                    u.uid === uid ? { ...u, disabled: !currentStatus } : u
                ));
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error al actualizar el estado del usuario');
        } finally {
            setToggling(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.displayName?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Usuarios del Chat
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Gestiona quién tiene acceso a la plataforma.
                    </p>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                            placeholder="Buscar por email o nombre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Usuario</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Último Acceso</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Acciones</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredUsers.map((user) => (
                            <tr key={user.uid}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                                            {user.photoURL ? (
                                                <img className="h-10 w-10 rounded-full" src={user.photoURL} alt="" />
                                            ) : (
                                                <User className="h-5 w-5 text-gray-500" />
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-medium text-gray-900">{user.displayName || 'Sin Nombre'}</div>
                                            <div className="text-gray-500">{user.email}</div>
                                            <div className="text-xs text-gray-400 font-mono mt-0.5">{user.uid}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {user.disabled ? (
                                        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                            Desactivado
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                            Activo
                                        </span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {user.lastSignInTime ? new Date(user.lastSignInTime).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <button
                                        onClick={() => toggleAccess(user.uid, user.disabled)}
                                        disabled={toggling === user.uid}
                                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${user.disabled
                                                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                            } disabled:opacity-50 transition-colors`}
                                    >
                                        {toggling === user.uid ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : user.disabled ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-1.5" />
                                                Activar Acceso
                                            </>
                                        ) : (
                                            <>
                                                <Ban className="w-4 h-4 mr-1.5" />
                                                Bloquear Acceso
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
