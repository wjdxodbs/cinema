"use client";

import { BookmarkX, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaGrid } from "@/components/media/media-grid";
import { useWatchlistStore } from "@/store/watchlist";
import type { Media, WatchlistItem } from "@/types/tmdb";

function toMedia(item: WatchlistItem): Media {
  return {
    id: item.id,
    media_type: item.media_type,
    title: item.media_type === "movie" ? item.title : undefined,
    name: item.media_type === "tv" ? item.title : undefined,
    overview: item.overview,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    vote_average: item.vote_average,
    vote_count: 0,
    popularity: 0,
    release_date: item.media_type === "movie" ? item.release_date : undefined,
    first_air_date: item.media_type === "tv" ? item.release_date : undefined,
    genre_ids: item.genre_ids,
    adult: false,
  };
}

export default function WatchlistPage() {
  const { items, clearAll } = useWatchlistStore();

  const mediaItems = items.map(toMedia);

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6">찜 목록</h1>
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <BookmarkX className="h-20 w-20 mb-4 opacity-20" />
          <p className="text-xl mb-2">찜한 항목이 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">찜 목록</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{items.length}개</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive gap-2"
            onClick={clearAll}
          >
            <Trash2 className="h-4 w-4" />
            전체 삭제
          </Button>
        </div>
      </div>

      <MediaGrid
        items={mediaItems}
        mediaType="movie"
      />
    </div>
  );
}
