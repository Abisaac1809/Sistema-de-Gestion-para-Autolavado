type PaymentMethodColors = {
  bg: string;
  text: string;
};

function getPaymentMethodColor(name: string): PaymentMethodColors {
  const lower = name.toLowerCase();
  if (lower.includes("efectivo")) {
    return { bg: "bg-green-100", text: "text-green-700" };
  }
  if (lower.includes("movil")) {
    return { bg: "bg-purple-100", text: "text-purple-700" };
  }
  if (lower.includes("tarjeta")) {
    return { bg: "bg-pink-100", text: "text-pink-700" };
  }
  return { bg: "bg-gray-100", text: "text-gray-700" };
}

type PaymentMethodBadgeProps = {
  name: string;
};

export function PaymentMethodBadge({ name }: PaymentMethodBadgeProps) {
  const { bg, text } = getPaymentMethodColor(name);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bg} ${text}`}
    >
      {name}
    </span>
  );
}
