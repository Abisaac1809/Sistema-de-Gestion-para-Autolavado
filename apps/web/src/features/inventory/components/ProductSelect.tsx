import { useQuery } from "@tanstack/react-query";
import type { PublicProduct } from "@car-wash/types";
import { SearchSelect } from "@/components/SearchSelect";
import { getProducts } from "../services/productService";

type ProductSelectProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  error?: string;
};

export function ProductSelect({
  value,
  onChange,
  placeholder,
  error,
}: ProductSelectProps) {
  const query = useQuery({
    queryKey: ["inventory", "products", "select-all"],
    queryFn: () => getProducts({ page: 1, limit: 200 }),
  });

  return (
    <SearchSelect<PublicProduct>
      value={value}
      onChange={onChange}
      options={query.data?.data ?? []}
      isLoading={query.isLoading}
      placeholder={placeholder ?? "Buscar producto..."}
      error={error}
      getOptionId={(p) => p.id}
      getOptionLabel={(p) => p.name}
    />
  );
}
