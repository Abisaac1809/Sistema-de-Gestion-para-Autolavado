import type { PublicProduct } from "@car-wash/types";
import { Modal } from "@/components/Modal";
import { UNIT_TYPE_LABELS } from "../utils/unitTypeLabels";

type ProductDetailViewProps = {
  isOpen: boolean;
  onClose: () => void;
  product: PublicProduct | null;
  categoryName: string | null;
};

export function ProductDetailView({
  isOpen,
  onClose,
  product,
  categoryName,
}: ProductDetailViewProps) {
  if (!product) return null;

  const unitLabel = product.unitType
    ? (UNIT_TYPE_LABELS[product.unitType] ?? product.unitType)
    : null;

  const stockColor =
    product.stock === 0
      ? "text-red-600 font-semibold"
      : product.stock <= product.minStock
      ? "text-orange-500 font-semibold"
      : "text-gray-900";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      size="lg"
    >
      <div className="mt-4 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">

          {/* Nombre */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Nombre
            </p>
            <p className="text-sm text-gray-900 font-medium">{product.name}</p>
          </div>

          {/* Categoria */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Categoria
            </p>
            {categoryName ? (
              <p className="text-sm text-gray-900 font-medium">{categoryName}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">Sin categoria</p>
            )}
          </div>

          {/* Stock */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Stock
            </p>
            <p className={`text-sm font-medium ${stockColor}`}>
              {product.stock}
            </p>
          </div>

          {/* Stock minimo */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Stock minimo
            </p>
            <p className="text-sm text-gray-900 font-medium">
              {product.minStock}
            </p>
          </div>

          {/* Tipo de unidad */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Tipo de unidad
            </p>
            {unitLabel ? (
              <p className="text-sm text-gray-900 font-medium">{unitLabel}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">No definido</p>
            )}
          </div>

          {/* Precio de venta */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Precio de venta
            </p>
            <p className="text-sm text-gray-900 font-medium">
              ${product.costPrice.toFixed(2)}
            </p>
          </div>

          {/* En venta */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              En venta
            </p>
            {product.isForSale ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Si
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                No
              </span>
            )}
          </div>

          {/* Estado */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Estado
            </p>
            {product.status ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Activo
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                Inactivo
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
