import { useEffect, useState, useRef } from "react";
import { CloudUpload } from "lucide-react";
import type { PublicStoreInfo, StoreInfoToUpdateType } from "@car-wash/types";

type GeneralTabProps = {
  storeInfo: PublicStoreInfo | undefined;
  isLoading: boolean;
  isSaving: boolean;
  onSave: (payload: StoreInfoToUpdateType) => void;
};

export function GeneralTab({
  storeInfo,
  isLoading,
  isSaving,
  onSave,
}: GeneralTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<StoreInfoToUpdateType>({
    name: "",
    rif: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (storeInfo) {
      setForm({
        name: storeInfo.name,
        rif: storeInfo.rif,
        address: storeInfo.address,
        phone: storeInfo.phone ?? "",
      });
    }
  }, [storeInfo]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: StoreInfoToUpdateType = {
      name: form.name,
      rif: form.rif,
      address: form.address,
      phone: form.phone || undefined,
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

      {/* Phone */}
      <div className="space-y-1">
        <label
          htmlFor="store-phone"
          className="block text-sm font-medium text-gray-700"
        >
          Teléfono
        </label>
        <input
          id="store-phone"
          type="text"
          value={form.phone || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Ej: 0414-1234567"
        />
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
      </div>
    </form>
  );
}
