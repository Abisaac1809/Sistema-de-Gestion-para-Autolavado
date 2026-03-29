import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import type { PublicCategory, PublicProduct } from "@car-wash/types";
import { DataTable, type Column } from "@/components/DataTable";
import { TableActions } from "@/components/TableActions";

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
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const cat of categories) {
      map[cat.id] = cat.name;
    }
    return map;
  }, [categories]);

  const columns = useMemo<Column<PublicProduct>[]>(
    () => [
      {
        header: "Nombre",
        render: (p) => (
          <div>
            <span className="font-medium text-gray-900">{p.name}</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {!p.isForSale && (
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                  No en venta
                </span>
              )}
              {p.stock === 0 && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                  Sin stock
                </span>
              )}
              {p.stock > 0 && p.stock <= p.minStock && (
                <span className="flex items-center gap-1 bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">
                  <AlertTriangle size={10} />
                  Stock bajo
                </span>
              )}
            </div>
          </div>
        ),
      },
      {
        header: "Categoria",
        render: (p) =>
          p.categoryId && categoryMap[p.categoryId] ? (
            <span className="text-gray-700">{categoryMap[p.categoryId]}</span>
          ) : (
            <span className="text-gray-400 italic">Sin categoria</span>
          ),
      },
      {
        header: "Stock",
        render: (p) => {
          const color =
            p.stock === 0
              ? "text-red-600"
              : p.stock <= p.minStock
                ? "text-orange-600"
                : "text-gray-900";
          return <span className={`font-medium ${color}`}>{p.stock}</span>;
        },
      },
      {
        header: "Precio venta",
        render: (p) => <span className="text-gray-900">${p.costPrice.toFixed(2)}</span>,
      },
      {
        header: "Acciones",
        align: "right",
        render: (p) => (
          <TableActions onEdit={() => onEdit(p)} onDelete={() => onDelete(p)} />
        ),
      },
    ],
    [categoryMap, onEdit, onDelete],
  );

  return (
    <DataTable
      columns={columns}
      data={products}
      keyExtractor={(p) => p.id}
      isLoading={isLoading}
      onRowClick={onRowClick}
      emptyMessage="No se encontraron productos"
    />
  );
}
