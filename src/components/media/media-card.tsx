"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, BookmarkCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/tmdb";
import { useWatchlistStore } from "@/store/watchlist";
import type { Media, MediaType } from "@/types/tmdb";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  item: Media;
  mediaType: MediaType;
  className?: string;
}

export function MediaCard({ item, mediaType, className }: MediaCardProps) {
  const addItem = useWatchlistStore((s) => s.addItem);
  const removeItem = useWatchlistStore((s) => s.removeItem);
  const inWatchlist = useWatchlistStore((s) =>
    s.items.some((w) => w.id === item.id && w.media_type === mediaType)
  );
  const title = item.title || item.name || "Unknown";
  const releaseDate = item.release_date || item.first_air_date || "";
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeItem(item.id, mediaType);
    } else {
      addItem({
        id: item.id,
        media_type: mediaType,
        title,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        release_date: releaseDate,
        overview: item.overview,
        backdrop_path: item.backdrop_path,
      });
    }
  };

  return (
    <Link href={`/${mediaType}/${item.id}`}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-lg bg-card border border-border/50 transition-all duration-300 hover:scale-105 hover:border-white/20 hover:shadow-2xl hover:shadow-black/50",
          className
        )}
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={getImageUrl(item.poster_path, "w342")}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 backdrop-blur-sm transition-all",
              inWatchlist
                ? "text-yellow-400 hover:text-yellow-300"
                : "text-white/70 hover:text-white opacity-0 group-hover:opacity-100"
            )}
            onClick={handleWatchlistToggle}
          >
            {inWatchlist ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>

          <div className="absolute bottom-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="secondary" className="bg-black/70 text-white border-0 text-xs">
              {mediaType === "movie" ? "영화" : "TV"}
            </Badge>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-medium text-sm text-foreground line-clamp-2 leading-snug mb-1">
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{year || "미정"}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span>{item.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
