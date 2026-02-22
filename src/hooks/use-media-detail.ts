"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getMovieCredits,
  getMovieDetail,
  getMovieVideos,
  getSimilarMovies,
  getSimilarTv,
  getTvCredits,
  getTvDetail,
  getTvVideos,
} from "@/lib/tmdb";
import type { MediaType } from "@/types/tmdb";

export function useMovieDetail(id: number) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetail(id),
    enabled: !!id,
  });
}

export function useMovieCredits(id: number) {
  return useQuery({
    queryKey: ["movie", id, "credits"],
    queryFn: () => getMovieCredits(id),
    enabled: !!id,
  });
}

export function useMovieVideos(id: number) {
  return useQuery({
    queryKey: ["movie", id, "videos"],
    queryFn: () => getMovieVideos(id),
    enabled: !!id,
  });
}

export function useSimilarMovies(id: number) {
  return useQuery({
    queryKey: ["movie", id, "similar"],
    queryFn: () => getSimilarMovies(id),
    enabled: !!id,
  });
}

export function useTvDetail(id: number) {
  return useQuery({
    queryKey: ["tv", id],
    queryFn: () => getTvDetail(id),
    enabled: !!id,
  });
}

export function useTvCredits(id: number) {
  return useQuery({
    queryKey: ["tv", id, "credits"],
    queryFn: () => getTvCredits(id),
    enabled: !!id,
  });
}

export function useTvVideos(id: number) {
  return useQuery({
    queryKey: ["tv", id, "videos"],
    queryFn: () => getTvVideos(id),
    enabled: !!id,
  });
}

export function useSimilarTv(id: number) {
  return useQuery({
    queryKey: ["tv", id, "similar"],
    queryFn: () => getSimilarTv(id),
    enabled: !!id,
  });
}

export function useMediaDetail(id: number, mediaType: MediaType) {
  const movieQuery = useMovieDetail(id);
  const tvQuery = useTvDetail(id);

  return mediaType === "movie" ? movieQuery : tvQuery;
}
