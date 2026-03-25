"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { usePopularTv, useTvByGenre, useTvGenres } from "@/hooks/use-tv";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaGridSkeleton } from "@/components/skeletons/media-card-skeleton";
import { GenreFilter } from "@/components/media/genre-filter";
import { InfiniteScroll } from "@/components/media/infinite-scroll";
import { deduplicateById } from "@/lib/utils";
import type { TvShow } from "@/types/tmdb";

export function TvContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const genreParam = searchParams.get("genre");
  const selectedGenreId = genreParam ? parseInt(genreParam) : null;

  const { data: genresData } = useTvGenres();

  function setSelectedGenreId(id: number | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === null) {
      params.delete("genre");
    } else {
      params.set("genre", String(id));
    }
    router.replace(`/tv?${params.toString()}`, { scroll: false });
  }

  const popularQuery = usePopularTv();
  const genreQuery = useTvByGenre(selectedGenreId);

  const activeQuery = selectedGenreId === null ? popularQuery : genreQuery;

  const allShows = deduplicateById(
    activeQuery.data?.pages.flatMap((page) => page.results as TvShow[]) ?? [],
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="font-display text-2xl md:text-3xl text-white">TV</h1>
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
