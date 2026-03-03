import { SettingsTabs } from "@/features/settings/components/SettingsTabs";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-1 text-sm text-gray-500">
          Administra la información del negocio, tasas de cambio, métodos de pago y contactos de notificacion.
        </p>
      </div>

      <SettingsTabs />
    </div>
  );
}
