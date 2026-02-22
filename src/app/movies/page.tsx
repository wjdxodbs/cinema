"use client";

import { useState, useMemo } from "react";
import { useMoviesByGenre, useMovieGenres, usePopularMovies } from "@/hooks/use-movies";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaGridSkeleton } from "@/components/media/media-card-skeleton";
import { GenreFilter } from "@/components/media/genre-filter";
import { InfiniteScroll } from "@/components/media/infinite-scroll";
import type { Movie } from "@/types/tmdb";

export default function MoviesPage() {
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const { data: genresData } = useMovieGenres();

  const popularQuery = usePopularMovies();
  const genreQuery = useMoviesByGenre(selectedGenreId);

  const activeQuery = selectedGenreId === null ? popularQuery : genreQuery;

  const allMovies = useMemo(() => {
    return (
      activeQuery.data?.pages.flatMap((page) => page.results as Movie[]) ?? []
    );
  }, [activeQuery.data]);

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">영화</h1>

      <div className="mb-6">
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
