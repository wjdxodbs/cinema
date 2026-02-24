"use client";

import { useState } from "react";
import { usePopularTv, useTvByGenre, useTvGenres } from "@/hooks/use-tv";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaGridSkeleton } from "@/components/skeletons/media-card-skeleton";
import { GenreFilter } from "@/components/media/genre-filter";
import { InfiniteScroll } from "@/components/media/infinite-scroll";
import { deduplicateById } from "@/lib/utils";
import type { TvShow } from "@/types/tmdb";

export function TvContent() {
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const { data: genresData } = useTvGenres();

  const popularQuery = usePopularTv();
  const genreQuery = useTvByGenre(selectedGenreId);

  const activeQuery = selectedGenreId === null ? popularQuery : genreQuery;

  const allShows = deduplicateById(
    activeQuery.data?.pages.flatMap((page) => page.results as TvShow[]) ?? [],
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
          TV 프로그램
        </h1>
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
