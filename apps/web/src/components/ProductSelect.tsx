import { useQuery } from "@tanstack/react-query";
import type { PublicProduct } from "@car-wash/types";
import { SearchSelect } from "@/components/SearchSelect";
import { getProducts } from "@/features/inventory/services/productService";

type ProductSelectProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  onSelect?: (item: PublicProduct | null) => void;
  placeholder?: string;
  error?: string;
};

export function ProductSelect({ value, onChange, onSelect, placeholder, error }: ProductSelectProps) {
  const query = useQuery({
    queryKey: ["inventory", "products", "select-all"],
    queryFn: () => getProducts({ page: 1, limit: 100 }),
  });

  const handleChange = (id: string | null) => {
    onChange(id);
    if (onSelect) {
      const item = id ? (query.data?.data ?? []).find((p) => p.id === id) ?? null : null;
      onSelect(item);
    }
  };

  return (
    <SearchSelect<PublicProduct>
      value={value}
      onChange={handleChange}
      options={query.data?.data ?? []}
      isLoading={query.isLoading}
      placeholder={placeholder ?? "Buscar producto..."}
      error={error}
      getOptionId={(p) => p.id}
      getOptionLabel={(p) => p.name}
    />
  );
}
