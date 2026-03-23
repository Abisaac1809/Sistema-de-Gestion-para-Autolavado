import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { NotificationContactToUpdateType } from "@car-wash/types";
import {
  getNotificationContacts,
  getNotificationContact,
  createNotificationContact,
  updateNotificationContact,
  deleteNotificationContact,
} from "../services/notificationContactService";
import type {
  UseNotificationContactsResult,
  UseNotificationContactResult,
  UseNotificationContactsMutationsResult,
} from "../types/notificationContact.dtos";

const QUERY_KEY = ["settings", "notificationContacts"] as const;

export function useNotificationContacts(): UseNotificationContactsResult {
  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getNotificationContacts,
  });

  return {
    contacts: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
  };
}

export function useNotificationContact(id: string | null): UseNotificationContactResult {
  const query = useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => getNotificationContact(id!),
    enabled: !!id,
  });

  return {
    contact: query.data ?? null,
    isLoading: query.isLoading,
  };
}

export function useNotificationContactsMutations(): UseNotificationContactsMutationsResult {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  const createMutation = useMutation({
    mutationFn: createNotificationContact,
    onSuccess: () => { invalidate(); toast.success("Contacto creado correctamente"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: NotificationContactToUpdateType }) =>
      updateNotificationContact(id, payload),
    onSuccess: () => { invalidate(); toast.success("Contacto actualizado correctamente"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotificationContact,
    onSuccess: () => { invalidate(); toast.success("Contacto eliminado"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
