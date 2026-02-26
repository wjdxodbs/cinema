"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useGenreMap } from "@/hooks/use-genre-map";
import { WatchlistButton } from "@/components/media/watchlist-button";
import type { Media, MediaType } from "@/types/tmdb";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  item: Media;
  mediaType: MediaType;
  className?: string;
  priority?: boolean;
}

export function MediaCard({ item, mediaType, className, priority }: MediaCardProps) {
  const genreMap = useGenreMap("all");
  const title = item.title || item.name || "Unknown";
  const releaseDate = item.release_date || item.first_air_date || "";

  const genreNames =
    (item.genres?.map((g) => g.name) ??
      item.genre_ids?.map((id) => genreMap[id]).filter(Boolean)) as string[] | undefined;
  const genreText = genreNames?.length ? genreNames.join(" • ") : null;

  return (
    <Link href={`/${mediaType}/${item.id}`} className="block">
      <div
        className={cn(
          "group relative overflow-hidden rounded-lg bg-card border border-border/50 transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-2xl hover:shadow-black/50",
          className
        )}
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={getImageUrl(item.poster_path, "w342")}
            alt={title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />

          <WatchlistButton
            item={{
              id: item.id,
              media_type: mediaType,
              title,
              poster_path: item.poster_path,
              vote_average: item.vote_average,
              release_date: releaseDate,
              overview: item.overview,
              backdrop_path: item.backdrop_path,
              genre_ids: item.genre_ids,
            }}
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#16213E]/85 via-[#16213E]/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="font-semibold text-white line-clamp-2 text-sm leading-snug mb-1">
              {title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-white/90 mb-1">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
              <span>{item.vote_average.toFixed(1)}</span>
            </div>
            {genreText && (
              <p className="text-xs text-white/80 line-clamp-2">{genreText}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
