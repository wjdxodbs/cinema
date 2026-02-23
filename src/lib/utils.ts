import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export function getImageUrl(path: string | null, size: string = "w500"): string {
  if (!path) return "/placeholder-poster.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function tmdbNextPageParam(lastPage: { page: number; total_pages: number }) {
  return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
}

export function deduplicateById<T extends { id: number }>(items: T[]): T[] {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
