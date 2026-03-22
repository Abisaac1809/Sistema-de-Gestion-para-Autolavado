import { useState } from "react";
import { Plus } from "lucide-react";
import type {
  PublicProduct,
  ProductToCreateType,
  ProductToUpdateType,
  CategoryToCreateType,
} from "@car-wash/types";
import { useProducts, useProductsMutations } from "../hooks/useProducts";
import { useCategories, useCategoriesMutations } from "../hooks/useCategories";
import { FilterBar } from "./FilterBar";
import { ProductTable } from "./ProductTable";
import { ProductForm } from "./ProductForm";
import { CategoryForm } from "./CategoryForm";
import { ProductDetailView } from "./ProductDetailView";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";

type ModalState = {
  productForm: boolean;
  categoryForm: boolean;
  productDetail: boolean;
  deleteConfirm: boolean;
};

export function InventoryView() {
  const { products, meta, isLoading, filters, filterActions } = useProducts();
  const { create, update, remove, isCreating, isUpdating, isDeleting } = useProductsMutations();

  const { categories } = useCategories();
  const { create: createCategory, isCreating: isCategoryCreating } = useCategoriesMutations();

  const [modalState, setModalState] = useState<ModalState>({
    productForm: false,
    categoryForm: false,
    productDetail: false,
    deleteConfirm: false,
  });

  const [editingProduct, setEditingProduct] = useState<PublicProduct | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<PublicProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<PublicProduct | null>(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setModalState((prev) => ({ ...prev, productForm: true }));
  };

  const handleEditProduct = (product: PublicProduct) => {
    setEditingProduct(product);
    setModalState((prev) => ({ ...prev, productForm: true }));
  };

  const handleRowClick = (product: PublicProduct) => {
    setSelectedProduct(product);
    setModalState((prev) => ({ ...prev, productDetail: true }));
  };

  const handleDeleteClick = (product: PublicProduct) => {
    setDeletingProduct(product);
    setModalState((prev) => ({ ...prev, deleteConfirm: true }));
  };

  const handleProductSubmit = (values: ProductToCreateType | ProductToUpdateType) => {
    if (editingProduct) {
      update({ id: editingProduct.id, payload: values as ProductToUpdateType });
    } else {
      create(values as ProductToCreateType);
    }
    setModalState((prev) => ({ ...prev, productForm: false }));
    setEditingProduct(null);
  };

  const handleCategorySubmit = (values: CategoryToCreateType) => {
    createCategory(values);
    setModalState((prev) => ({ ...prev, categoryForm: false }));
  };

  const handleDeleteConfirm = () => {
    if (deletingProduct) {
      remove(deletingProduct.id);
    }
    setModalState((prev) => ({ ...prev, deleteConfirm: false }));
    setDeletingProduct(null);
  };

  const handleClearFilters = () => {
    filterActions.setSearch("");
    filterActions.setCategoryId(null);
    filterActions.setIsForSale("all");
  };

  const getCategoryName = (product: PublicProduct): string | null => {
    if (!product.categoryId) return null;
    const cat = categories.find((c) => c.id === product.categoryId);
    return cat ? cat.name : null;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona tus productos, stock y categorias.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProduct}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          Nuevo producto
        </button>
      </div>

      {/* FilterBar */}
      <FilterBar
        search={filters.search}
        onSearchChange={filterActions.setSearch}
        categoryId={filters.categoryId}
        onCategoryChange={filterActions.setCategoryId}
        isForSale={filters.isForSale}
        onIsForSaleChange={filterActions.setIsForSale}
        onClearFilters={handleClearFilters}
      />

      {/* ProductTable */}
      <div className="mt-4">
        <ProductTable
          products={products}
          categories={categories}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          onEdit={handleEditProduct}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Pagina {meta.currentPage} de {meta.totalPages} ({meta.totalRecords} productos)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={meta.currentPage <= 1}
              onClick={() => filterActions.setPage(meta.currentPage - 1)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={meta.currentPage >= meta.totalPages}
              onClick={() => filterActions.setPage(meta.currentPage + 1)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* ProductForm modal */}
      <ProductForm
        isOpen={modalState.productForm}
        onClose={() => {
          setModalState((prev) => ({ ...prev, productForm: false }));
          setEditingProduct(null);
        }}
        onSubmit={handleProductSubmit}
        initialData={editingProduct}
        isSubmitting={isCreating || isUpdating}
        onOpenCategoryForm={() =>
          setModalState((prev) => ({ ...prev, categoryForm: true }))
        }
      />

      {/* CategoryForm modal */}
      <CategoryForm
        isOpen={modalState.categoryForm}
        onClose={() => setModalState((prev) => ({ ...prev, categoryForm: false }))}
        onSubmit={handleCategorySubmit}
        isSubmitting={isCategoryCreating}
      />

      {/* ProductDetailView modal */}
      <ProductDetailView
        isOpen={modalState.productDetail}
        onClose={() => {
          setModalState((prev) => ({ ...prev, productDetail: false }));
          setSelectedProduct(null);
        }}
        productId={selectedProduct?.id ?? null}
        categoryName={selectedProduct ? getCategoryName(selectedProduct) : null}
      />

      {/* ConfirmationDialog for delete */}
      <ConfirmationDialog
        isOpen={modalState.deleteConfirm}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setModalState((prev) => ({ ...prev, deleteConfirm: false }));
          setDeletingProduct(null);
        }}
        title="Eliminar producto"
        message={`¿Estas seguro de que deseas eliminar "${deletingProduct?.name}"? Esta accion no se puede deshacer.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
