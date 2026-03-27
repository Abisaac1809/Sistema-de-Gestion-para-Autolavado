import { useQuery } from "@tanstack/react-query";
import type { PublicCustomer } from "@car-wash/types";
import { getCustomers } from "../services/customerService";

export type UseCustomersResult = {
  customers: PublicCustomer[];
  isLoading: boolean;
};

export function useCustomers(search: string = ""): UseCustomersResult {
  const query = useQuery({
    queryKey: ["customers", "select", search],
    queryFn: () => getCustomers({ search: search || undefined, page: 1, limit: 50 }),
  });

  return {
    customers: query.data?.data ?? [],
    isLoading: query.isLoading,
  };
}
