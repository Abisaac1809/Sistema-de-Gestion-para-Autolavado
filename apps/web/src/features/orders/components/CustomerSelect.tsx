import { SearchSelect } from "@/components/SearchSelect";
import type { PublicCustomer } from "@car-wash/types";
import { useCustomers } from "../hooks/useCustomers";

type CustomerSelectProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  error?: string;
};

export function CustomerSelect({ value, onChange, error }: CustomerSelectProps) {
  const { customers, isLoading } = useCustomers();

  return (
    <SearchSelect<PublicCustomer>
      value={value}
      onChange={onChange}
      options={customers}
      isLoading={isLoading}
      placeholder="Buscar cliente..."
      error={error}
      getOptionId={(c) => c.id}
      getOptionLabel={(c) => c.fullName}
    />
  );
}
