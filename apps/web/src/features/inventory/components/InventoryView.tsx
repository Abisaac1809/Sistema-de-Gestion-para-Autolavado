import { useState } from "react";
import { CreateButton } from "@/components/buttons/CreateButton";
import { PageView } from "@/components/PageView";
import type {
  PublicProduct,
  ProductToCreateType,
  ProductToUpdateType,
  CategoryToCreateType,
} from "@car-wash/types";
import { useProducts, useProductsMutations } from "../hooks/useProducts";
import { useCategories, useCategoriesMutations } from "../hooks/useCategories";
import { IsForSaleFilter } from "../types/products.dtos";
import { FilterBar } from "./FilterBar";
import { ProductTable } from "./ProductTable";
import { ProductForm } from "./ProductForm";
import { CategoryForm } from "./CategoryForm";
import { ProductDetailView } from "./ProductDetailView";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { Pagination } from "@/components/Pagination";

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
    filterActions.setIsForSale(IsForSaleFilter.All);
  };

  const getCategoryName = (product: PublicProduct): string | null => {
    if (!product.categoryId) return null;
    const cat = categories.find((c) => c.id === product.categoryId);
    return cat ? cat.name : null;
  };

  return (
    <PageView
      title="Inventario"
      subtitle="Gestiona tus productos, stock y categorias."
      action={<CreateButton title="Nuevo producto" onClick={handleAddProduct} />}
    >
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
      {meta && (
        <Pagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          totalRecords={meta.totalRecords}
          limit={meta.limit}
          onPageChange={filterActions.setPage}
        />
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
    </PageView>
  );
}
