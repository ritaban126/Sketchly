function normalizeUrl(value?: string) {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/\/+$/, "");
  return `https://${trimmed.replace(/\/+$/, "")}`;
}

export function resolveApiBaseUrl() {
  const configured = normalizeUrl(
    process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL,
  );

  if (configured) return configured;

  if (typeof window !== "undefined") {
    return window.location.origin.replace(/\/+$/, "");
  }

  return "";
}

export const BASE = resolveApiBaseUrl();
