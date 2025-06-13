"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token) {
        router.push('/login');
      } else if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      ceo: 'CEO',
      director: 'Director',
      manager: 'Manager',
      analyst: 'Analista',
      viewer: 'Viewer'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getWelcomeMessage = (role: string) => {
    const messages = {
      ceo: 'Obtén insights estratégicos de tu organización',
      director: 'Supervisa las métricas departamentales',
      manager: 'Administra las operaciones de tu equipo',
      analyst: 'Analiza datos detallados y genera reportes',
      viewer: 'Consulta información y reportes disponibles'
    };
    return messages[role as keyof typeof messages] || 'Bienvenido a Infinure';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              ¡Hola, {user.firstName}!
            </h1>
            <p className="text-gray-600">
              {getWelcomeMessage(user.role)}
            </p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                {getRoleDisplayName(user.role)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Última conexión</p>
            <p className="text-sm font-medium text-gray-900">Hoy</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/chat" className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Chat con Datos</h3>
              <p className="text-sm text-gray-500">Haz preguntas en lenguaje natural</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/integrations" className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Integraciones</h3>
              <p className="text-sm text-gray-500">Conecta tus fuentes de datos</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/analytics" className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-500">Revisa estadísticas de uso</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Estado del Sistema
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-500">Conversaciones</div>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-500">Integraciones</div>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-500">Sistema Operativo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Actividad Reciente
          </h3>
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              No hay actividad reciente aún. ¡Comienza haciendo tu primera pregunta!
            </p>
            <div className="mt-4">
              <Link
                href="/dashboard/chat"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Comenzar Chat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 