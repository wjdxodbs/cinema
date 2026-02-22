"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Play, Bookmark, BookmarkCheck, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/tmdb";
import { useWatchlistStore } from "@/store/watchlist";
import type { Media, MediaType } from "@/types/tmdb";

interface HeroBannerProps {
  items: Media[];
}

export function HeroBanner({ items }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const addItem = useWatchlistStore((s) => s.addItem);
  const removeItem = useWatchlistStore((s) => s.removeItem);
  const watchlistItems = useWatchlistStore((s) => s.items);

  const featured = items[currentIndex];
  if (!featured) return null;

  const mediaType: MediaType = featured.media_type === "tv" ? "tv" : "movie";
  const title = featured.title || featured.name || "";
  const releaseDate = featured.release_date || featured.first_air_date || "";
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const inWatchlist = watchlistItems.some(
    (w) => w.id === featured.id && w.media_type === mediaType
  );

  const handlePrev = () => setCurrentIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  const handleNext = () => setCurrentIndex((i) => (i === items.length - 1 ? 0 : i + 1));

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeItem(featured.id, mediaType);
    } else {
      addItem({
        id: featured.id,
        media_type: mediaType,
        title,
        poster_path: featured.poster_path,
        vote_average: featured.vote_average,
        release_date: releaseDate,
        overview: featured.overview,
        backdrop_path: featured.backdrop_path,
      });
    }
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "70vh", minHeight: "500px" }}>
      <Image
        src={getImageUrl(featured.backdrop_path || featured.poster_path, "original")}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-600 text-white border-0 text-xs font-bold">
                {mediaType === "movie" ? "영화" : "TV"}
              </Badge>
              {year && (
                <span className="text-sm text-white/70">{year}</span>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-white/80 font-medium">
                  {featured.vote_average.toFixed(1)}
                </span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{title}</h1>

            <p className="text-white/70 text-sm md:text-base leading-relaxed line-clamp-3">
              {featured.overview || "줄거리 정보가 없습니다."}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link href={`/${mediaType}/${featured.id}`}>
                <Button className="bg-white text-black hover:bg-white/90 gap-2 font-semibold">
                  <Play className="h-4 w-4 fill-black" />
                  자세히 보기
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 gap-2 backdrop-blur-sm"
                onClick={handleWatchlistToggle}
              >
                {inWatchlist ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 text-yellow-400" />
                    찜 해제
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    찜하기
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
        aria-label="이전"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
        aria-label="다음"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {items.slice(0, 8).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
