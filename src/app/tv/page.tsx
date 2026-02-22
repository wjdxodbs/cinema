"use client";

import { useState, useMemo } from "react";
import { usePopularTv, useTvByGenre, useTvGenres } from "@/hooks/use-tv";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaGridSkeleton } from "@/components/media/media-card-skeleton";
import { GenreFilter } from "@/components/media/genre-filter";
import { InfiniteScroll } from "@/components/media/infinite-scroll";
import type { TvShow } from "@/types/tmdb";

export default function TvPage() {
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const { data: genresData } = useTvGenres();

  const popularQuery = usePopularTv();
  const genreQuery = useTvByGenre(selectedGenreId);

  const activeQuery = selectedGenreId === null ? popularQuery : genreQuery;

  const allShows = useMemo(() => {
    return (
      activeQuery.data?.pages.flatMap((page) => page.results as TvShow[]) ?? []
    );
  }, [activeQuery.data]);

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">TV 프로그램</h1>

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
          <MediaGrid items={allShows} mediaType="tv" />
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
