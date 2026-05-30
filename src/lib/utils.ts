import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToFirstError() {
  setTimeout(() => {
    const first = document.querySelector('[data-field-error="true"]');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 0);
}
