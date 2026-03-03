import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  createError: string | null;
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
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: NotificationContactToUpdateType }) =>
      updateNotificationContact(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "notificationContacts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotificationContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "notificationContacts"] });
    },
  });

  return {
    contacts: query.data ?? [],
    isLoading: query.isLoading,
    isCreating: createMutation.isPending,
    createError: createMutation.isError
      ? (createMutation.error as Error)?.message ?? "Error al crear"
      : null,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
  };
}
