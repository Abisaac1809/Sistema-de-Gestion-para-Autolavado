import { useEffect, useState } from "react";
import {
  ProductToCreate,
  ProductToUpdate,
  UnitType,
  type PublicProduct,
  type ProductToCreateType,
  type ProductToUpdateType,
} from "@car-wash/types";
import { Modal } from "@/components/Modal";
import { CategorySelect } from "./CategorySelect";
import { UNIT_TYPE_LABELS } from "../utils/unitTypeLabels";

type ProductFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ProductToCreateType | ProductToUpdateType) => void;
  initialData?: PublicProduct | null;
  isSubmitting: boolean;
  onOpenCategoryForm: () => void;
};

type FormErrors = Record<string, string>;

const UNIT_TYPE_OPTIONS = Object.values(UnitType);

export function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
  onOpenCategoryForm,
}: ProductFormProps) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [unitType, setUnitType] = useState<string | null>(null);
  const [costPrice, setCostPrice] = useState(0);
  const [isForSale, setIsForSale] = useState(false);
  const [status, setStatus] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = !!initialData;

  // Populate or reset form when opening
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setCategoryId(initialData.categoryId);
        setStock(initialData.stock);
        setMinStock(initialData.minStock);
        setUnitType(initialData.unitType ?? null);
        setCostPrice(initialData.costPrice);
        setIsForSale(initialData.isForSale);
        setStatus(initialData.status);
      } else {
        setName("");
        setCategoryId(null);
        setStock(0);
        setMinStock(0);
        setUnitType(null);
        setCostPrice(0);
        setIsForSale(false);
        setStatus(true);
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Reset errors when modal closes
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isEditing) {
      const payload = {
        name,
        categoryId: categoryId ?? undefined,
        minStock,
        unitType: (unitType as UnitType) ?? undefined,
        costPrice,
        isForSale,
        status,
      };
      const result = ProductToUpdate.safeParse(payload);
      if (!result.success) {
        const newErrors: FormErrors = {};
        for (const issue of result.error.issues) {
          const key = String(issue.path[0]);
          if (!newErrors[key]) newErrors[key] = issue.message;
        }
        setErrors(newErrors);
        return;
      }
      setErrors({});
      onSubmit(result.data);
    } else {
      const payload = {
        name,
        categoryId: categoryId ?? undefined,
        stock,
        minStock,
        unitType: (unitType as UnitType) ?? undefined,
        costPrice,
        isForSale,
        status,
      };
      const result = ProductToCreate.safeParse(payload);
      if (!result.success) {
        const newErrors: FormErrors = {};
        for (const issue of result.error.issues) {
          const key = String(issue.path[0]);
          if (!newErrors[key]) newErrors[key] = issue.message;
        }
        setErrors(newErrors);
        return;
      }
      setErrors({});
      onSubmit(result.data);
    }
  }

  const inputBase =
    "rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 w-full";
  const inputNormal = `${inputBase} border-gray-200`;
  const inputError = `${inputBase} border-red-500`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar producto" : "Crear producto"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Name — full width */}
          <div className="sm:col-span-2">
            <label
              htmlFor="product-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="product-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Shampoo para autos"
              className={errors.name ? inputError : inputNormal}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Category with "+" button */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <CategorySelect
                  value={categoryId}
                  onChange={setCategoryId}
                  placeholder="Sin categoria"
                  error={errors.categoryId}
                />
              </div>
              <button
                type="button"
                onClick={onOpenCategoryForm}
                title="Crear nueva categoria"
                className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors text-lg font-medium"
              >
                +
              </button>
            </div>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>
            )}
          </div>

          {/* Stock — read-only on edit */}
          <div>
            <label
              htmlFor="product-stock"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Stock
              {isEditing && (
                <span className="ml-1 text-xs text-gray-400">(no editable)</span>
              )}
            </label>
            <input
              id="product-stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              min={0}
              disabled={isEditing}
              className={
                isEditing
                  ? `${inputNormal} bg-gray-100 text-gray-500 cursor-not-allowed`
                  : errors.stock
                  ? inputError
                  : inputNormal
              }
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-red-600">{errors.stock}</p>
            )}
          </div>

          {/* Min Stock */}
          <div>
            <label
              htmlFor="product-minStock"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Stock minimo
            </label>
            <input
              id="product-minStock"
              type="number"
              value={minStock}
              onChange={(e) => setMinStock(Number(e.target.value))}
              min={0}
              className={errors.minStock ? inputError : inputNormal}
            />
            {errors.minStock && (
              <p className="mt-1 text-xs text-red-600">{errors.minStock}</p>
            )}
          </div>

          {/* Unit Type */}
          <div>
            <label
              htmlFor="product-unitType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tipo de unidad
            </label>
            <select
              id="product-unitType"
              value={unitType ?? ""}
              onChange={(e) => setUnitType(e.target.value || null)}
              className={errors.unitType ? inputError : inputNormal}
            >
              <option value="">Sin tipo</option>
              {UNIT_TYPE_OPTIONS.map((val) => (
                <option key={val} value={val}>
                  {UNIT_TYPE_LABELS[val]}
                </option>
              ))}
            </select>
            {errors.unitType && (
              <p className="mt-1 text-xs text-red-600">{errors.unitType}</p>
            )}
          </div>

          {/* Cost Price */}
          <div>
            <label
              htmlFor="product-costPrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Precio de venta
            </label>
            <input
              id="product-costPrice"
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(Number(e.target.value))}
              min={0}
              step="0.01"
              className={errors.costPrice ? inputError : inputNormal}
            />
            {errors.costPrice && (
              <p className="mt-1 text-xs text-red-600">{errors.costPrice}</p>
            )}
          </div>

          {/* isForSale toggle */}
          <div className="flex items-center justify-between sm:col-span-1">
            <label
              htmlFor="product-isForSale"
              className="text-sm font-medium text-gray-700"
            >
              En venta
            </label>
            <button
              id="product-isForSale"
              type="button"
              role="switch"
              aria-checked={isForSale}
              onClick={() => setIsForSale((prev) => !prev)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 ${
                isForSale ? "bg-gray-900" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform ${
                  isForSale ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Status toggle */}
          <div className="flex items-center justify-between sm:col-span-1">
            <label
              htmlFor="product-status"
              className="text-sm font-medium text-gray-700"
            >
              Activo
            </label>
            <button
              id="product-status"
              type="button"
              role="switch"
              aria-checked={status}
              onClick={() => setStatus((prev) => !prev)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 ${
                status ? "bg-gray-900" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform ${
                  status ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
