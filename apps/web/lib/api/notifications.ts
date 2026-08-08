import { BASE } from "./base";

export async function listNotifications() {
  const res = await fetch(`${BASE}/api/notifications`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

export async function markNotificationRead(notificationId: string) {
  const res = await fetch(`${BASE}/api/notifications/${notificationId}/read`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to mark notification as read");
  return res.json();
}
