import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export function buildImageUrl(file: string | null | undefined): string | null {
  if (!file) return null;
  if (file.startsWith("http://") || file.startsWith("https://")) return file;
  const stripped = file.startsWith("/") ? file.slice(1) : file;
  return `${baseUrl}/${stripped}`;
}

export function scrollToFirstError() {
  setTimeout(() => {
    const first = document.querySelector('[data-field-error="true"]');
    if (first) first.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 0);
}
