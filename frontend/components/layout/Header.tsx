+"use client";
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="w-full h-14 border-b bg-white flex items-center justify-between px-4 shadow-sm">
      <div className="font-medium">Panel de Control</div>
      <button className="text-sm text-red-600" onClick={logout}>
        Cerrar sesión
      </button>
    </header>
  );
} 