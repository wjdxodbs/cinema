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

async function fetchTmdb<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
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

// Trending
export async function getTrending(
  mediaType: "movie" | "tv" | "all" = "all",
  timeWindow: "day" | "week" = "week",
  page: number = 1
): Promise<TrendingResponse> {
  return fetchTmdb(`/trending/${mediaType}/${timeWindow}`, { page: String(page) });
}

// Movies
export async function getPopularMovies(page: number = 1): Promise<PaginatedResponse<Movie>> {
  return fetchTmdb("/movie/popular", { page: String(page) });
}

export async function getMoviesByGenre(
  genreId: number,
  page: number = 1
): Promise<PaginatedResponse<Movie>> {
  return fetchTmdb("/discover/movie", {
    with_genres: String(genreId),
    page: String(page),
    sort_by: "popularity.desc",
  });
}

export async function getMovieDetail(id: number): Promise<Movie> {
  return fetchTmdb(`/movie/${id}`);
}

export async function getMovieCredits(id: number): Promise<Credits> {
  return fetchTmdb(`/movie/${id}/credits`);
}

export async function getMovieVideos(id: number): Promise<VideosResponse> {
  return fetchTmdb(`/movie/${id}/videos`);
}

export async function getSimilarMovies(id: number, page: number = 1): Promise<PaginatedResponse<Movie>> {
  return fetchTmdb(`/movie/${id}/similar`, { page: String(page) });
}

// TV Shows
export async function getPopularTv(page: number = 1): Promise<PaginatedResponse<TvShow>> {
  return fetchTmdb("/tv/popular", { page: String(page) });
}

export async function getTvByGenre(
  genreId: number,
  page: number = 1
): Promise<PaginatedResponse<TvShow>> {
  return fetchTmdb("/discover/tv", {
    with_genres: String(genreId),
    page: String(page),
    sort_by: "popularity.desc",
  });
}

export async function getTvDetail(id: number): Promise<TvShow> {
  return fetchTmdb(`/tv/${id}`);
}

export async function getTvCredits(id: number): Promise<Credits> {
  return fetchTmdb(`/tv/${id}/credits`);
}

export async function getTvVideos(id: number): Promise<VideosResponse> {
  return fetchTmdb(`/tv/${id}/videos`);
}

export async function getSimilarTv(id: number, page: number = 1): Promise<PaginatedResponse<TvShow>> {
  return fetchTmdb(`/tv/${id}/similar`, { page: String(page) });
}

// Search
export async function searchMulti(
  query: string,
  page: number = 1
): Promise<PaginatedResponse<Movie | TvShow>> {
  return fetchTmdb("/search/multi", { query, page: String(page) });
}

// Genres
export async function getMovieGenres(): Promise<{ genres: Genre[] }> {
  return fetchTmdb("/genre/movie/list");
}

export async function getTvGenres(): Promise<{ genres: Genre[] }> {
  return fetchTmdb("/genre/tv/list");
}
