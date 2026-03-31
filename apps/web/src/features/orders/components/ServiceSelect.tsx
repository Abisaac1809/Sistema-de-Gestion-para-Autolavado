import { useQuery } from "@tanstack/react-query";
import { SearchSelect } from "@/components/SearchSelect";
import type { PublicService } from "@car-wash/types";
import { getServices } from "@/features/services/services/serviceService";

type ServiceSelectProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  onSelect?: (item: PublicService | null) => void;
  error?: string;
};

export function ServiceSelect({ value, onChange, onSelect, error }: ServiceSelectProps) {
  const query = useQuery({
    queryKey: ["services", "select-active"],
    queryFn: () => getServices({ page: 1, limit: 100, status: true }),
  });

  const handleChange = (id: string | null) => {
    onChange(id);
    if (onSelect) {
      const item = id ? (query.data?.data ?? []).find((s) => s.id === id) ?? null : null;
      onSelect(item);
    }
  };

  return (
    <SearchSelect<PublicService>
      value={value}
      onChange={handleChange}
      options={query.data?.data ?? []}
      isLoading={query.isLoading}
      placeholder="Buscar servicio..."
      error={error}
      getOptionId={(s) => s.id}
      getOptionLabel={(s) => s.name}
    />
  );
}
