"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Home' },
  { href: '/dashboard/chat', label: 'Chat' },
  { href: '/dashboard/integrations', label: 'Integraciones' },
  { href: '/dashboard/analytics', label: 'Analytics' },
  { href: '/dashboard/settings', label: 'Configuración' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-full border-r bg-white flex flex-col">
      <div className="px-4 py-6 text-lg font-bold">Infinure</div>
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded px-3 py-2 text-sm ${active ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 