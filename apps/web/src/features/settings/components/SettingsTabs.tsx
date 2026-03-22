import { useState } from "react";
import type { PublicPaymentMethod, PaymentMethodToUpdateType } from "@car-wash/types";
import { useStoreInfo } from "../hooks/useStoreInfo";
import { useExchangeRate } from "../hooks/useExchangeRate";
import { usePaymentMethods } from "../hooks/usePaymentMethods";
import { useNotificationContacts } from "../hooks/useNotificationContacts";
import { GeneralTab } from "./tabs/GeneralTab";
import { CurrencyTab } from "./tabs/CurrencyTab";
import { PaymentMethodsTab } from "./tabs/PaymentMethodsTab";
import { NotificationContactsTab } from "./tabs/NotificationContactsTab";

type Tab = "general" | "currency" | "paymentMethods" | "notificationContacts";

type TabConfig = {
  id: Tab;
  label: string;
};

const TABS: TabConfig[] = [
  { id: "general", label: "General" },
  { id: "currency", label: "Configuración de Monedas" },
  { id: "paymentMethods", label: "Métodos de Pago" },
  { id: "notificationContacts", label: "Contactos de Notificacion" },
];

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  const storeInfo = useStoreInfo();
  const exchangeRate = useExchangeRate();
  const paymentMethods = usePaymentMethods();
  const notificationContacts = useNotificationContacts();

  function handleSaveChanges(methods: PublicPaymentMethod[]) {
    methods.forEach((method) => {
      const original = paymentMethods.paymentMethods.find((m) => m.id === method.id);
      if (original && original.isActive !== method.isActive) {
        const payload: PaymentMethodToUpdateType = { isActive: method.isActive };
        paymentMethods.update({ id: method.id, payload });
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div
        role="tablist"
        className="flex border-b border-gray-200"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                isActive
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab panels — all rendered but hidden to preserve state across tab switches */}
      <div
        id="panel-general"
        role="tabpanel"
        aria-labelledby="tab-general"
        hidden={activeTab !== "general"}
      >
        <GeneralTab
          storeInfo={storeInfo.storeInfo}
          isLoading={storeInfo.isLoading}
          isSaving={storeInfo.isSaving}
          onSave={storeInfo.save}
        />
      </div>

      <div
        id="panel-currency"
        role="tabpanel"
        aria-labelledby="tab-currency"
        hidden={activeTab !== "currency"}
      >
        <CurrencyTab
          config={exchangeRate.config}
          isLoading={exchangeRate.isLoading}
          isSaving={exchangeRate.isSaving}
          isSyncing={exchangeRate.isSyncing}
          onSave={exchangeRate.save}
          onSync={exchangeRate.sync}
        />
      </div>

      <div
        id="panel-paymentMethods"
        role="tabpanel"
        aria-labelledby="tab-paymentMethods"
        hidden={activeTab !== "paymentMethods"}
      >
        <PaymentMethodsTab
          paymentMethods={paymentMethods.paymentMethods}
          isLoading={paymentMethods.isLoading}
          isCreating={paymentMethods.isCreating}
          isSaving={paymentMethods.isSaving}
          onCreate={paymentMethods.create}
          onToggle={paymentMethods.update}
          onDelete={paymentMethods.remove}
          onSaveChanges={handleSaveChanges}
        />
      </div>

      <div
        id="panel-notificationContacts"
        role="tabpanel"
        aria-labelledby="tab-notificationContacts"
        hidden={activeTab !== "notificationContacts"}
      >
        <NotificationContactsTab
          contacts={notificationContacts.contacts}
          isLoading={notificationContacts.isLoading}
          isCreating={notificationContacts.isCreating}
          isUpdating={notificationContacts.isUpdating}
          isDeleting={notificationContacts.isDeleting}
          onCreate={notificationContacts.create}
          onUpdate={notificationContacts.update}
          onDelete={notificationContacts.remove}
        />
      </div>
    </div>
  );
}
