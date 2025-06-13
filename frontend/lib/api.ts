export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(`${base}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
} 