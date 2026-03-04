import { SearchSelect } from "@/components/SearchSelect";
import type { PublicCategory } from "@car-wash/types";
import { useCategories } from "../hooks/useCategories";

type CategorySelectProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  error?: string;
};

export function CategorySelect({
  value,
  onChange,
  placeholder,
  error,
}: CategorySelectProps) {
  const { categories, isLoading } = useCategories();

  return (
    <SearchSelect<PublicCategory>
      value={value}
      onChange={onChange}
      options={categories}
      isLoading={isLoading}
      placeholder={placeholder ?? "Todas las categorias"}
      error={error}
      getOptionId={(cat) => cat.id}
      getOptionLabel={(cat) => cat.name}
    />
  );
}
