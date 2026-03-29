import { Plus } from "lucide-react";

type CreateButtonProps = {
  title: string;
  onClick: () => void;
};

export function CreateButton({ title, onClick }: CreateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
    >
      <Plus size={18} />
      {title}
    </button>
  );
}
