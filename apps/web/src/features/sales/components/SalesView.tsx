import { useState } from "react";
import type { PublicSale } from "@car-wash/types";
import { CreateButton } from "@/components/CreateButton";
import { PageView } from "@/components/PageView";
import { useSales, useSalesMutations } from "../hooks/useSales";
import { useSalesKpis } from "../hooks/useSalesKpis";
import { usePaymentMethods } from "@/features/settings/hooks/usePaymentMethods";
import { SalesKpiSection } from "./SalesKpiSection";
import { SalesFilterBar } from "./SalesFilterBar";
import { SalesTable } from "./SalesTable";
import { QuickSaleModal } from "./QuickSaleModal";
import { SaleDetailModal } from "./SaleDetailModal";
import { Pagination } from "@/components/Pagination";
import type { SaleToCreateType } from "../types/sales.dtos";

export function SalesView() {
  const { sales, meta, isLoading, filters, filterActions } = useSales();
  const { create, isCreating } = useSalesMutations();
  const { revenue, breakdown, isLoading: kpisLoading } = useSalesKpis();
  const { paymentMethods } = usePaymentMethods();

  const [showQuickSaleModal, setShowQuickSaleModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<PublicSale | null>(null);

  const handleCreate = (data: SaleToCreateType) => {
    create(data, { onSuccess: () => setShowQuickSaleModal(false) });
  };

  const handleView = (sale: PublicSale) => {
    setSelectedSale(sale);
    setShowDetailModal(true);
  };

  const filteredSales = filters.paymentMethodId
    ? sales.filter((s) =>
        s.payments?.some((p) => p.paymentMethod.id === filters.paymentMethodId)
      )
    : sales;

  return (
    <PageView
      title="Ventas"
      subtitle="Consulta y gestiona las ventas del negocio."
      action={<CreateButton title="Venta Rapida" onClick={() => setShowQuickSaleModal(true)} />}
    >
      {/* KPI section */}
      <SalesKpiSection revenue={revenue} breakdown={breakdown} isLoading={kpisLoading} />

      {/* Filter bar */}
      <SalesFilterBar
        filters={filters}
        filterActions={filterActions}
        paymentMethods={paymentMethods}
      />

      {/* Table */}
      <SalesTable sales={filteredSales} isLoading={isLoading} onView={handleView} />

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

      {/* Quick sale modal */}
      <QuickSaleModal
        isOpen={showQuickSaleModal}
        onClose={() => setShowQuickSaleModal(false)}
        onSubmit={handleCreate}
        isSubmitting={isCreating}
      />

      {/* Sale detail modal */}
      <SaleDetailModal
        sale={selectedSale}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedSale(null);
        }}
      />
    </PageView>
  );
}
