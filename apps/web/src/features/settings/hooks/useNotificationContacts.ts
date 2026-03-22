import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type {
  PublicNotificationContact,
  NotificationContactToCreateType,
  NotificationContactToUpdateType,
} from "@car-wash/types";
import {
  getNotificationContacts,
  createNotificationContact,
  updateNotificationContact,
  deleteNotificationContact,
} from "../services/notificationContactService";

export type UseNotificationContactsResult = {
  contacts: PublicNotificationContact[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  create: (payload: NotificationContactToCreateType) => void;
  update: (args: { id: string; payload: NotificationContactToUpdateType }) => void;
  remove: (id: string) => void;
};

export function useNotificationContacts(): UseNotificationContactsResult {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["settings", "notificationContacts"],
    queryFn: getNotificationContacts,
    select: (data) => data.data,
  });

  const createMutation = useMutation({
    mutationFn: createNotificationContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "notificationContacts"] });
      toast.success("Contacto creado correctamente");
    },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: NotificationContactToUpdateType }) =>
      updateNotificationContact(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "notificationContacts"] });
      toast.success("Contacto actualizado correctamente");
    },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotificationContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "notificationContacts"] });
      toast.success("Contacto eliminado");
    },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  return {
    contacts: query.data ?? [],
    isLoading: query.isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
  };
}
