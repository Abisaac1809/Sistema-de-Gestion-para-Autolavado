type SaveButtonProps = {
  isSubmitting?: boolean;
  label?: string;
  loadingLabel?: string;
  type?: "submit" | "button";
  onClick?: () => void;
  form?: string;
};

export function SaveButton({
  isSubmitting = false,
  label = "Guardar",
  loadingLabel = "Guardando...",
  type = "submit",
  onClick,
  form,
}: SaveButtonProps) {
  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={isSubmitting}
      className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
    >
      {isSubmitting ? loadingLabel : label}
    </button>
  );
}
