import type {
  PublicNotificationContact,
  ListOfNotificationContacts,
  NotificationContactToCreateType,
  NotificationContactToUpdateType,
} from "@car-wash/types";

export type UseNotificationContactsResult = {
  contacts: PublicNotificationContact[];
  meta: ListOfNotificationContacts["meta"] | null;
  isLoading: boolean;
};

export type UseNotificationContactResult = {
  contact: PublicNotificationContact | null;
  isLoading: boolean;
};

export type UseNotificationContactsMutationsResult = {
  create: (payload: NotificationContactToCreateType) => void;
  update: (args: { id: string; payload: NotificationContactToUpdateType }) => void;
  remove: (id: string) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
};
