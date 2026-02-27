import { useEffect, useState, useRef } from "react";
import { X, Plus, CloudUpload } from "lucide-react";
import type { PublicStoreInfo, StoreInfoToUpdateType } from "@car-wash/types";
import type { GeneralTabFormValues } from "../../schemas/settings.schemas";

type GeneralTabProps = {
  storeInfo: PublicStoreInfo | undefined;
  isLoading: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
  onSave: (payload: StoreInfoToUpdateType) => void;
};

export function GeneralTab({
  storeInfo,
  isLoading,
  isSaving,
  saveSuccess,
  saveError,
  onSave,
}: GeneralTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<GeneralTabFormValues>({
    name: "",
    rif: "",
    address: "",
    phones: [""],
  });
  const [newPhone, setNewPhone] = useState("");

  useEffect(() => {
    if (storeInfo) {
      setForm({
        name: storeInfo.name,
        rif: storeInfo.rif,
        address: storeInfo.address,
        phones: storeInfo.phone ? [storeInfo.phone] : [""],
      });
    }
  }, [storeInfo]);

  function handleAddPhone() {
    const trimmed = newPhone.trim();
    if (!trimmed) return;
    setForm((prev) => ({ ...prev, phones: [...prev.phones, trimmed] }));
    setNewPhone("");
  }

  function handleRemovePhone(index: number) {
    setForm((prev) => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: StoreInfoToUpdateType = {
      name: form.name,
      rif: form.rif,
      address: form.address,
      // Map phones[0] to the backend's single `phone` field.
      // The backend only supports one phone number.
      phone: form.phones[0] ?? undefined,
    };
    onSave(payload);
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Información del negocio
      </h2>

      {/* Logo upload */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Logo</label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white cursor-pointer"
        >
          <CloudUpload className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">
            Haz clic para subir una imagen
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Name */}
      <div className="space-y-1">
        <label
          htmlFor="store-name"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre del negocio
        </label>
        <input
          id="store-name"
          type="text"
          value={form.name || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Ej: Autolavado El Rápido"
        />
      </div>

      {/* RIF */}
      <div className="space-y-1">
        <label
          htmlFor="store-rif"
          className="block text-sm font-medium text-gray-700"
        >
          RIF
        </label>
        <input
          id="store-rif"
          type="text"
          value={form.rif || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, rif: e.target.value }))}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Ej: J-12345678-9"
        />
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label
          htmlFor="store-address"
          className="block text-sm font-medium text-gray-700"
        >
          Dirección
        </label>
        <textarea
          id="store-address"
          value={form.address || ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, address: e.target.value }))
          }
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          placeholder="Dirección completa del negocio"
        />
      </div>

      {/* Phones */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Teléfonos
        </label>
        <div className="space-y-2">
          {form.phones.map((phone, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={phone || ""}
                onChange={(e) => {
                  const updated = [...form.phones];
                  updated[index] = e.target.value;
                  setForm((prev) => ({ ...prev, phones: updated }));
                }}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Ej: 0414-1234567"
              />
              {form.phones.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemovePhone(index)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Eliminar teléfono"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddPhone();
              }
            }}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Agregar otro teléfono"
          />
          <button
            type="button"
            onClick={handleAddPhone}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </button>
        {saveSuccess && (
          <p className="text-sm text-green-600">Cambios guardados correctamente.</p>
        )}
        {saveError && (
          <p className="text-sm text-red-600">{saveError}</p>
        )}
      </div>
    </form>
  );
}
