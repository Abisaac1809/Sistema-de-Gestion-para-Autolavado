type CancelButtonProps = {
  onClick: () => void;
  label?: string;
};

export function CancelButton({ onClick, label = "Cancelar" }: CancelButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      {label}
    </button>
  );
}
