import { useQuery } from "@tanstack/react-query";
import { SearchSelect } from "@/components/SearchSelect";
import type { PublicCustomer, ListOfCustomers } from "@car-wash/types";
import { api } from "@/services/axiosInstance";

type CustomerSelectProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  error?: string;
};

export function CustomerSelect({ value, onChange, error }: CustomerSelectProps) {
  const query = useQuery({
    queryKey: ["customers", "select-all"],
    queryFn: async () => {
      const res = await api.get<ListOfCustomers>("/api/customers", {
        params: { limit: 100, page: 1 },
      });
      return res.data;
    },
  });

  return (
    <SearchSelect<PublicCustomer>
      value={value}
      onChange={onChange}
      options={query.data?.data ?? []}
      isLoading={query.isLoading}
      placeholder="Buscar cliente..."
      error={error}
      getOptionId={(c) => c.id}
      getOptionLabel={(c) => c.fullName}
    />
  );
}
