import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PublicCategory, CategoryToCreateType } from "@car-wash/types";
import { getCategories, createCategory } from "../services/categoryService";

export type UseCategoriesResult = {
  categories: PublicCategory[];
  isLoading: boolean;
  isCreating: boolean;
  create: (payload: CategoryToCreateType) => void;
};

export function useCategories(): UseCategoriesResult {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["inventory", "categories"],
    queryFn: getCategories,
    select: (data) => data.data,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "categories"] });
    },
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isCreating: createMutation.isPending,
    create: createMutation.mutate,
  };
}
