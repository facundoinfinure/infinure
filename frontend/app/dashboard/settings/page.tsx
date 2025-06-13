"use client";

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Configuración</h1>

      <section>
        <h2 className="text-lg font-semibold mb-2">Perfil de la organización</h2>
        <p className="text-sm text-gray-600">Funcionalidad de edición pendiente.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Usuarios</h2>
        <p className="text-sm text-gray-600">Módulo de gestión de usuarios en desarrollo.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Facturación</h2>
        <p className="text-sm text-gray-600">Próximamente integración con proveedor de pagos.</p>
      </section>
    </div>
  );
} 