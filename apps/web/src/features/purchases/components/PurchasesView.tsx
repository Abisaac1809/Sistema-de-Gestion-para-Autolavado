import { useState } from "react";
import { ShoppingCart, DollarSign, Package, Truck } from "lucide-react";
import { CreateButton } from "@/components/buttons/CreateButton";
import { PageView } from "@/components/PageView";
import type { PublicPurchase, PurchaseToCreateType } from "@car-wash/types";
import { usePurchases, usePurchasesMutations } from "../hooks/usePurchases";
import { usePaymentMethods } from "@/features/settings/hooks/usePaymentMethods";
import { KpiCard } from "@/components/KpiCard";
import { PurchasesTable } from "./PurchasesTable";
import { PurchasesFilterBar } from "./PurchasesFilterBar";
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
      <PurchasesFilterBar
        search={filters.search}
        onSearchChange={filterActions.setSearch}
        fromDate={filters.fromDate}
        onFromDateChange={filterActions.setFromDate}
        toDate={filters.toDate}
        onToDateChange={filterActions.setToDate}
        paymentMethodId={filters.paymentMethodId}
        onPaymentMethodChange={filterActions.setPaymentMethodId}
        paymentMethods={paymentMethods}
        hasActiveFilters={!!(filters.search || filters.fromDate || filters.toDate || filters.paymentMethodId)}
        onClearFilters={filterActions.resetFilters}
      />

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
