import "server-only";

import type {
  Credits,
  Genre,
  Movie,
  PaginatedResponse,
  TrendingResponse,
  TvShow,
  VideosResponse,
} from "@/types/tmdb";

const BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY || "";

/**
 * TMDB API에 요청을 보내는 공통 함수
 * API 키와 한국어 설정을 자동으로 추가하며, 5분간 ISR 캐싱 적용
 */
async function fetchTmdb<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "ko-KR");
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 * 5 },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/** 트렌딩 미디어 목록 조회 (일간/주간, 영화/TV/전체) */
export async function getTrending(
  mediaType: "movie" | "tv" | "all" = "all",
  timeWindow: "day" | "week" = "week",
  page: number = 1,
): Promise<TrendingResponse> {
  return fetchTmdb(`/trending/${mediaType}/${timeWindow}`, {
    page: String(page),
  });
}

/** 인기 영화 목록 조회 (페이지네이션) */
export async function getPopularMovies(
  page: number = 1,
): Promise<PaginatedResponse<Movie>> {
  return fetchTmdb("/movie/popular", { page: String(page) });
}

/** 특정 장르의 영화 목록 조회 (인기순 정렬) */
export async function getMoviesByGenre(
  genreId: number,
  page: number = 1,
): Promise<PaginatedResponse<Movie>> {
  return fetchTmdb("/discover/movie", {
    with_genres: String(genreId),
    page: String(page),
    sort_by: "popularity.desc",
  });
}

/** 영화 상세 정보 조회 */
export async function getMovieDetail(id: number): Promise<Movie> {
  return fetchTmdb(`/movie/${id}`);
}

/** 영화 출연진 및 제작진 정보 조회 */
export async function getMovieCredits(id: number): Promise<Credits> {
  return fetchTmdb(`/movie/${id}/credits`);
}

/** 영화 관련 동영상(예고편 등) 목록 조회 */
export async function getMovieVideos(id: number): Promise<VideosResponse> {
  return fetchTmdb(`/movie/${id}/videos`);
}

/** 비슷한 영화 목록 조회 */
export async function getSimilarMovies(
  id: number,
  page: number = 1,
): Promise<PaginatedResponse<Movie>> {
  return fetchTmdb(`/movie/${id}/similar`, { page: String(page) });
}

/** 인기 TV 프로그램 목록 조회 (페이지네이션) */
export async function getPopularTv(
  page: number = 1,
): Promise<PaginatedResponse<TvShow>> {
  return fetchTmdb("/tv/popular", { page: String(page) });
}

/** 특정 장르의 TV 프로그램 목록 조회 (인기순 정렬) */
export async function getTvByGenre(
  genreId: number,
  page: number = 1,
): Promise<PaginatedResponse<TvShow>> {
  return fetchTmdb("/discover/tv", {
    with_genres: String(genreId),
    page: String(page),
    sort_by: "popularity.desc",
  });
}

/** TV 프로그램 상세 정보 조회 */
export async function getTvDetail(id: number): Promise<TvShow> {
  return fetchTmdb(`/tv/${id}`);
}

/** TV 프로그램 출연진 및 제작진 정보 조회 */
export async function getTvCredits(id: number): Promise<Credits> {
  return fetchTmdb(`/tv/${id}/credits`);
}

/** TV 프로그램 관련 동영상(예고편 등) 목록 조회 */
export async function getTvVideos(id: number): Promise<VideosResponse> {
  return fetchTmdb(`/tv/${id}/videos`);
}

/** 비슷한 TV 프로그램 목록 조회 */
export async function getSimilarTv(
  id: number,
  page: number = 1,
): Promise<PaginatedResponse<TvShow>> {
  return fetchTmdb(`/tv/${id}/similar`, { page: String(page) });
}

/** 영화 + TV 통합 검색 */
export async function searchMulti(
  query: string,
  page: number = 1,
): Promise<PaginatedResponse<Movie | TvShow>> {
  return fetchTmdb("/search/multi", { query, page: String(page) });
}

/** 영화 장르 목록 조회 */
export async function getMovieGenres(): Promise<{ genres: Genre[] }> {
  return fetchTmdb("/genre/movie/list");
}

/** TV 프로그램 장르 목록 조회 */
export async function getTvGenres(): Promise<{ genres: Genre[] }> {
  return fetchTmdb("/genre/tv/list");
}
