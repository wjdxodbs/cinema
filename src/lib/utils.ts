import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind CSS 클래스를 병합하고 충돌을 자동 해결 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

/** TMDB 이미지 경로를 전체 URL로 변환, 경로가 없으면 플레이스홀더 반환 */
export function getImageUrl(
  path: string | null,
  size: string = "w500",
): string {
  if (!path) return "/placeholder-poster.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

/** TanStack Query 무한스크롤용 다음 페이지 번호 계산 */
export function tmdbNextPageParam(lastPage: {
  page: number;
  total_pages: number;
}) {
  return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
}

/** id 기준으로 중복 항목을 제거 (무한스크롤 페이지 간 중복 방지) */
export function deduplicateById<T extends { id: number }>(items: T[]): T[] {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
