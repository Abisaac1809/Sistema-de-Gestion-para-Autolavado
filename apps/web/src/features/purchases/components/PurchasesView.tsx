import { useState } from "react";
import { ShoppingCart, DollarSign, Package, Truck } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { CreateButton } from "@/components/buttons/CreateButton";
import { PageView } from "@/components/PageView";
import type { PublicPurchase, PurchaseToCreateType } from "@car-wash/types";
import { usePurchases, usePurchasesMutations } from "../hooks/usePurchases";
import { usePaymentMethods } from "@/features/settings/hooks/usePaymentMethods";
import { KpiCard } from "@/components/KpiCard";
import { PurchasesTable } from "./PurchasesTable";
import { PurchaseForm } from "./PurchaseForm";
import { PurchaseDetailModal } from "./PurchaseDetailModal";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { Pagination } from "@/components/Pagination";

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
        <div className="flex-1 min-w-[200px] max-w-xs">
          <SearchInput
            value={filters.search}
            onChange={filterActions.setSearch}
            placeholder="Buscar por proveedor..."
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
      <PurchasesTable
        purchases={purchases}
        isLoading={isLoading}
        onView={handleView}
        onDelete={handleDeleteClick}
        disabled={isCreating || isDeleting}
      />

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
