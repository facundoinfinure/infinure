"use client";

import { useEffect, useState } from 'react';

export default function IntegrationsPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectors, setConnectors] = useState<any[]>([]);
  const [connectorLoading, setConnectorLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);
  const apiUrl = (process.env.NEXT_PUBLIC_INTEGRATIONS_API_URL || 'http://localhost:3002') + '/api';

  useEffect(() => {
    setLoading(true);
    fetch(`${apiUrl}/integrations/sources`)
      .then((res) => res.json())
      .then((data) => setSources(data || []))
      .catch(() => setSources([]))
      .finally(() => setLoading(false));
  }, [apiUrl, creating]);

  useEffect(() => {
    setConnectorLoading(true);
    fetch(`${apiUrl}/integrations/connectors?industry=saas`)
      .then((res) => res.json())
      .then((data) => setConnectors(data || []))
      .catch(() => setConnectors([]))
      .finally(() => setConnectorLoading(false));
  }, [apiUrl]);

  const handleConnect = async (connector: any) => {
    const name = prompt(`Nombre para la fuente ${connector.name}:`, connector.name);
    if (!name) return;
    const credsInput = prompt('Ingresa las credenciales JSON para la conexión (ej. {"host":"db","port":5432,"database":"demo","username":"postgres","password":"postgres"})');
    let credentials = {};
    try {
      credentials = credsInput ? JSON.parse(credsInput) : {};
    } catch {
      alert('Credenciales JSON inválidas.');
      return;
    }

    const payload = {
      name,
      type: connector.definitionId,
      credentials,
      syncFrequency: 'hourly'
    };

    setCreating(connector.key);
    try {
      const res = await fetch(`${apiUrl}/integrations/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al crear la fuente');
      alert('Fuente creada correctamente');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setCreating(null);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Data Integrations</h1>

      {/* Configured Sources */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Fuentes Configuradas</h2>
        {loading ? (
          <p>Cargando fuentes…</p>
        ) : (
          <ul className="space-y-2">
            {sources.length === 0 && <p>No hay fuentes configuradas todavía.</p>}
            {sources.map((s) => (
              <li key={s.sourceId} className="border p-3 rounded bg-white shadow">
                <strong>{s.name}</strong> — {s.sourceId}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Available Connectors */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Conectores Disponibles</h2>
        {connectorLoading ? (
          <p>Cargando conectores…</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectors.map((c) => (
              <li key={c.key} className="border p-4 rounded bg-gray-50 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">{c.name}</h3>
                  <p className="text-xs text-gray-500 capitalize">{c.category}</p>
                </div>
                <button
                  className="mt-4 px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:opacity-50"
                  disabled={creating === c.key}
                  onClick={() => handleConnect(c)}
                >
                  {creating === c.key ? 'Creando…' : 'Conectar'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
} 