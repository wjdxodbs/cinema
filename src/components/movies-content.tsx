"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useMoviesByGenre,
  useMovieGenres,
  usePopularMovies,
} from "@/hooks/use-movies";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaGridSkeleton } from "@/components/skeletons/media-card-skeleton";
import { GenreFilter } from "@/components/media/genre-filter";
import { InfiniteScroll } from "@/components/media/infinite-scroll";
import { deduplicateById } from "@/lib/utils";
import type { Movie } from "@/types/tmdb";

export function MoviesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const genreParam = searchParams.get("genre");
  const selectedGenreId = genreParam ? parseInt(genreParam) : null;

  const { data: genresData } = useMovieGenres();

  function setSelectedGenreId(id: number | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === null) {
      params.delete("genre");
    } else {
      params.set("genre", String(id));
    }
    router.replace(`/movies?${params.toString()}`, { scroll: false });
  }

  const popularQuery = usePopularMovies();
  const genreQuery = useMoviesByGenre(selectedGenreId);

  const activeQuery = selectedGenreId === null ? popularQuery : genreQuery;

  const allMovies = deduplicateById(
    activeQuery.data?.pages.flatMap((page) => page.results as Movie[]) ?? [],
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="font-display text-2xl md:text-3xl text-white">영화</h1>
        <GenreFilter
          genres={genresData?.genres ?? []}
          selectedGenreId={selectedGenreId}
          onGenreChange={setSelectedGenreId}
        />
      </div>

      {activeQuery.isPending ? (
        <MediaGridSkeleton />
      ) : (
        <>
          <MediaGrid items={allMovies} mediaType="movie" />
          <InfiniteScroll
            onLoadMore={() => activeQuery.fetchNextPage()}
            hasNextPage={activeQuery.hasNextPage}
            isFetchingNextPage={activeQuery.isFetchingNextPage}
          />
        </>
      )}
    </div>
  );
}
