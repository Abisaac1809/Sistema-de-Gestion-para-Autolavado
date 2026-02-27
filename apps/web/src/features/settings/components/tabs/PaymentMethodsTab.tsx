import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import type {
  PublicPaymentMethod,
  PaymentMethodToCreateType,
  PaymentMethodToUpdateType,
} from "@car-wash/types";

type PaymentMethodsTabProps = {
  paymentMethods: PublicPaymentMethod[];
  isLoading: boolean;
  isCreating: boolean;
  createError: string | null;
  isSaving: boolean;
  saveSuccess: boolean;
  onCreate: (payload: PaymentMethodToCreateType) => void;
  onToggle: (args: { id: string; payload: PaymentMethodToUpdateType }) => void;
  onDelete: (id: string) => void;
  onSaveChanges: (methods: PublicPaymentMethod[]) => void;
};

export function PaymentMethodsTab({
  paymentMethods,
  isLoading,
  isCreating,
  createError,
  isSaving,
  saveSuccess,
  onCreate,
  onToggle,
  onDelete,
  onSaveChanges,
}: PaymentMethodsTabProps) {
  const [newMethodName, setNewMethodName] = useState("");
  const [pendingMethods, setPendingMethods] = useState<PublicPaymentMethod[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setPendingMethods(paymentMethods);
  }, [paymentMethods]);

  function handleCreate() {
    const name = newMethodName.trim();
    if (name.length < 2) return;
    onCreate({ name, isActive: true });
    setNewMethodName("");
  }

  function handleLocalToggle(id: string) {
    setPendingMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );
  }

  function handleSaveChanges() {
    onSaveChanges(pendingMethods);
  }

  function handleConfirmDelete(id: string) {
    onDelete(id);
    setConfirmDeleteId(null);
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Métodos de pago</h2>

      {/* Add new method */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMethodName}
          onChange={(e) => setNewMethodName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCreate();
            }
          }}
          placeholder="Nombre del método de pago"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={isCreating || newMethodName.trim().length < 2}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isCreating ? "Agregando..." : "Agregar"}
        </button>
      </div>
      {createError && <p className="text-sm text-red-600">{createError}</p>}

      {/* Methods list */}
      {pendingMethods.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-medium text-gray-500">
            No hay métodos de pago configurados
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Agrega un método de pago usando el campo de arriba.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {pendingMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {/* Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={method.isActive}
                  onClick={() => handleLocalToggle(method.id)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 ${
                    method.isActive ? "bg-gray-900" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform ${
                      method.isActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {method.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {method.isActive ? "Activo" : "Inactivo"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Status badge */}
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    method.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {method.isActive ? "Disponible" : "No disponible"}
                </span>

                {/* Delete / confirm */}
                {confirmDeleteId === method.id ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">¿Eliminar?</span>
                    <button
                      type="button"
                      onClick={() => handleConfirmDelete(method.id)}
                      className="font-medium text-red-600 hover:text-red-700"
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="font-medium text-gray-500 hover:text-gray-700"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(method.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Eliminar ${method.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save changes */}
      {pendingMethods.length > 0 && (
        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
          {saveSuccess && (
            <p className="text-sm text-green-600">Cambios guardados correctamente.</p>
          )}
        </div>
      )}
    </div>
  );
}
