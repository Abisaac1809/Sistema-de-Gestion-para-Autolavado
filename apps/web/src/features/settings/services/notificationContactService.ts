import type { 
    NotificationContactToCreateType,
    NotificationContactToUpdateType,
    PublicNotificationContact,
    ListOfNotificationContacts
} from "@car-wash/types";
import { api } from "@/services/axiosInstance";

export async function getNotificationContact(id: string): Promise<PublicNotificationContact> {
    const response = await api.get<PublicNotificationContact>(`/api/config/notifications/${id}`);
    return response.data;
}

export async function getNotificationContacts(): Promise<ListOfNotificationContacts> {
    const response = await api.get<ListOfNotificationContacts>("/api/config/notifications");
    return response.data;
}

export async function createNotificationContact(payload: NotificationContactToCreateType): Promise<PublicNotificationContact> {
    const response = await api.post<PublicNotificationContact>("/api/config/notifications", payload);
    return response.data;
}

export async function updateNotificationContact(id: string, payload: NotificationContactToUpdateType): Promise<PublicNotificationContact> {
    const response = await api.patch<PublicNotificationContact>(`/api/config/notifications/${id}`, payload);
    return response.data;
}

export async function deleteNotificationContact(id: string): Promise<void> {
    await api.delete(`/api/config/notifications/${id}`);
}