import { AlertTriangle, Package, Pencil, Trash2 } from "lucide-react";
import type { PublicCategory, PublicProduct } from "@car-wash/types";
import { LoadingIndicator } from "@/components/LoadingIndicator";

type ProductTableProps = {
  products: PublicProduct[];
  categories: PublicCategory[];
  isLoading: boolean;
  onRowClick: (product: PublicProduct) => void;
  onEdit: (product: PublicProduct) => void;
  onDelete: (product: PublicProduct) => void;
};

export function ProductTable({
  products,
  categories,
  isLoading,
  onRowClick,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    categoryMap[cat.id] = cat.name;
  }

  if (isLoading) {
    return <LoadingIndicator rows={5} />;
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package size={48} className="text-gray-300 mb-4" />
        <h3 className="text-base font-semibold text-gray-700 mb-1">
          No se encontraron productos
        </h3>
        <p className="text-sm text-gray-400">
          Intenta ajustar los filtros o agrega un nuevo producto
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoria
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precio venta
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stockColor =
              product.stock === 0
                ? "text-red-600"
                : product.stock <= product.minStock
                  ? "text-orange-600"
                  : "text-gray-900";

            return (
              <tr
                key={product.id}
                onClick={() => onRowClick(product)}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {/* Name + badges */}
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">
                    {product.name}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {!product.isForSale && (
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                        No en venta
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                        Sin stock
                      </span>
                    )}
                    {product.stock > 0 && product.stock <= product.minStock && (
                      <span className="flex items-center gap-1 bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">
                        <AlertTriangle size={10} />
                        Stock bajo
                      </span>
                    )}
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-4 text-sm">
                  {product.categoryId && categoryMap[product.categoryId] ? (
                    <span className="text-gray-700">
                      {categoryMap[product.categoryId]}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">Sin categoria</span>
                  )}
                </td>

                {/* Stock */}
                <td className={`py-3 px-4 text-sm font-medium ${stockColor}`}>
                  {product.stock}
                </td>

                {/* Price */}
                <td className="py-3 px-4 text-sm text-gray-900">
                  ${product.costPrice.toFixed(2)}
                </td>

                {/* Actions */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(product);
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded"
                      aria-label="Editar producto"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(product);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
