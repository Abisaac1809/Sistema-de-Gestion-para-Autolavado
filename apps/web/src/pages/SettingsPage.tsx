import { SettingsTabs } from "@/features/settings/components/SettingsTabs";
import { PageView } from "@/components/PageView";

export function SettingsPage() {
  return (
    <PageView
      title="Configuración"
      subtitle="Administra la información del negocio, tasas de cambio, métodos de pago y contactos de notificacion."
    >
      <SettingsTabs />
    </PageView>
  );
}
