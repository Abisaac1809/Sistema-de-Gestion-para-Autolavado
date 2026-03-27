import { SaleStatus } from "@car-wash/types";

type StatusConfig = {
  bg: string;
  text: string;
  label: string;
};

const STATUS_CONFIG: Record<SaleStatus, StatusConfig> = {
  [SaleStatus.COMPLETED]: {
    bg: "bg-green-100",
    text: "text-green-700",
    label: "Completada",
  },
  [SaleStatus.REFUNDED]: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    label: "Reembolsada",
  },
  [SaleStatus.CANCELLED]: {
    bg: "bg-red-100",
    text: "text-red-700",
    label: "Cancelada",
  },
};

type SaleStatusBadgeProps = {
  status: SaleStatus;
};

export function SaleStatusBadge({ status }: SaleStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
