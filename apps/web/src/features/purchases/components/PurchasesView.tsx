import { useState } from "react";
import { Search, ShoppingCart, DollarSign, Package, Truck } from "lucide-react";
import { CreateButton } from "@/components/CreateButton";
import { PageView } from "@/components/PageView";
import type { PublicPurchase, PurchaseToCreateType } from "@car-wash/types";
import { usePurchases, usePurchasesMutations } from "../hooks/usePurchases";
import { usePaymentMethods } from "@/features/settings/hooks/usePaymentMethods";
import { KpiCard } from "@/components/KpiCard";
import { PurchasesTable } from "./PurchasesTable";
import { PurchaseForm } from "./PurchaseForm";
import { PurchaseDetailModal } from "./PurchaseDetailModal";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";

export function PurchasesView() {
  const { purchases, meta, isLoading, filters, filterActions } = usePurchases();
  const { create, remove, isCreating, isDeleting } = usePurchasesMutations();
  const { paymentMethods } = usePaymentMethods();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PublicPurchase | null>(null);

  const handleCreate = (data: PurchaseToCreateType) => {
    create(data);
    setShowCreateModal(false);
  };

  const handleView = (purchase: PublicPurchase) => {
    setSelectedPurchase(purchase);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (purchase: PublicPurchase) => {
    setSelectedPurchase(purchase);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (selectedPurchase) {
      remove(selectedPurchase.id);
    }
    setShowDeleteDialog(false);
    setSelectedPurchase(null);
  };

  // KPI computations
  const totalSpend = purchases.reduce((sum, p) => sum + p.totalUsd, 0);
  const totalItemsReceived = purchases.reduce(
    (sum, p) => sum + p.details.reduce((dSum, d) => dSum + d.quantity, 0),
    0
  );
  const uniqueProviders = new Set(purchases.map((p) => p.providerName)).size;

  return (
    <PageView
      title="Historial de Compras"
      subtitle="Registra y consulta las compras de inventario."
      action={<CreateButton title="Registrar Compra" onClick={() => setShowCreateModal(true)} />}
    >
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          value={String(meta?.totalRecords ?? 0)}
          label="Total Compras"
          icon={ShoppingCart}
          colorClass="bg-blue-50 text-blue-600"
        />
        <KpiCard
          value={`$${totalSpend.toFixed(2)}`}
          label="Gasto Total"
          icon={DollarSign}
          colorClass="bg-green-50 text-green-600"
        />
        <KpiCard
          value={String(totalItemsReceived)}
          label="Productos Recibidos"
          icon={Package}
          colorClass="bg-purple-50 text-purple-600"
        />
        <KpiCard
          value={String(uniqueProviders)}
          label="Proveedores Unicos"
          icon={Truck}
          colorClass="bg-orange-50 text-orange-600"
        />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar por proveedor..."
            value={filters.search}
            onChange={(e) => filterActions.setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => filterActions.setFromDate(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
          aria-label="Desde"
          title="Desde"
        />

        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => filterActions.setToDate(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
          aria-label="Hasta"
          title="Hasta"
        />

        <select
          value={filters.paymentMethodId}
          onChange={(e) => filterActions.setPaymentMethodId(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">Todos los metodos</option>
          {paymentMethods.map((pm) => (
            <option key={pm.id} value={pm.id}>
              {pm.name}
            </option>
          ))}
        </select>

        {(filters.search || filters.fromDate || filters.toDate || filters.paymentMethodId) && (
          <button
            type="button"
            onClick={filterActions.resetFilters}
            className="text-sm text-gray-500 hover:text-gray-800 underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
        </div>
      ) : (
        <PurchasesTable
          purchases={purchases}
          onView={handleView}
          onDelete={handleDeleteClick}
          disabled={isCreating || isDeleting}
        />
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Pagina {meta.currentPage} de {meta.totalPages} ({meta.totalRecords} compras)
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

      {/* Modals */}
      <PurchaseForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        isSubmitting={isCreating}
      />

      <PurchaseDetailModal
        purchase={selectedPurchase}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedPurchase(null);
        }}
      />

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedPurchase(null);
        }}
        title="Eliminar compra"
        message={`¿Estas seguro de que deseas eliminar la compra de "${selectedPurchase?.providerName}"? Esta accion no se puede deshacer.`}
        isLoading={isDeleting}
      />
    </PageView>
  );
}
