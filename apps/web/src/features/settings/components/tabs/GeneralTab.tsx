import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload } from "lucide-react";
import { StoreInfoToUpdate } from "@car-wash/types";
import type { StoreInfoToUpdateType } from "@car-wash/types";
import { useStoreInfo, useStoreInfoMutations } from "../../hooks/useStoreInfo";

export function GeneralTab() {
  const { storeInfo, isLoading } = useStoreInfo();
  const { isUpdating, update } = useStoreInfoMutations();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<StoreInfoToUpdateType>({
    resolver: zodResolver(StoreInfoToUpdate),
    defaultValues: { name: "", rif: "", address: "", phone: "" },
  });

  useEffect(() => {
    if (storeInfo && !isDirty) {
      reset({
        name: storeInfo.name,
        rif: storeInfo.rif,
        address: storeInfo.address,
        phone: storeInfo.phone ?? "",
      });
    }
  }, [storeInfo]); // eslint-disable-line react-hooks/exhaustive-deps

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
    <form onSubmit={handleSubmit((data) => update(data))} className="space-y-6">
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
          {...register("name")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Ej: Autolavado El Rápido"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
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
          {...register("rif")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Ej: J-12345678-9"
        />
        {errors.rif && (
          <p className="text-sm text-red-500">{errors.rif.message}</p>
        )}
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
          {...register("address")}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          placeholder="Dirección completa del negocio"
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
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
          {...register("phone")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Ej: 0414-1234567"
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isUpdating || !isDirty}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUpdating ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
