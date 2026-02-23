"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";
import { useGenreMap } from "@/hooks/use-genre-map";
import type { Media, MediaType } from "@/types/tmdb";

const TRANSITION_MS = 600;
const MAIN_LEFT = 8;
const MAIN_WIDTH = 84;
const SIDE_GAP = 1.5;
const SIDE_SCALE_Y = 0.92;
const CONTENT_PAD = 6;
const NAV_LEFT = MAIN_LEFT + (CONTENT_PAD / 100) * MAIN_WIDTH;
const SWIPE_THRESHOLD = 50;

function getSlideStyle(distance: number): React.CSSProperties {
  if (distance === 0) {
    return {
      left: `${MAIN_LEFT}%`,
      width: `${MAIN_WIDTH}%`,
      transform: "scaleY(1)",
      opacity: 1,
      zIndex: 2,
    };
  }
  if (distance === -1) {
    const leftPos = -(MAIN_WIDTH - MAIN_LEFT + SIDE_GAP);
    return {
      left: `${leftPos}%`,
      width: `${MAIN_WIDTH}%`,
      transform: `scaleY(${SIDE_SCALE_Y})`,
      opacity: 1,
      zIndex: 1,
    };
  }
  if (distance === 1) {
    return {
      left: `${MAIN_LEFT + MAIN_WIDTH + SIDE_GAP}%`,
      width: `${MAIN_WIDTH}%`,
      transform: `scaleY(${SIDE_SCALE_Y})`,
      opacity: 1,
      zIndex: 1,
    };
  }
  if (distance < -1) {
    return {
      left: `${-MAIN_WIDTH - 2}%`,
      width: `${MAIN_WIDTH}%`,
      transform: `scaleY(${SIDE_SCALE_Y})`,
      opacity: 0,
      zIndex: 0,
    };
  }
  return {
    left: `${100 + 2}%`,
    width: `${MAIN_WIDTH}%`,
    transform: `scaleY(${SIDE_SCALE_Y})`,
    opacity: 0,
    zIndex: 0,
  };
}

interface HeroBannerProps {
  items: Media[];
}

export function HeroBanner({ items }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const genreMap = useGenreMap("all");
  const maxItems = Math.min(items.length, 8);
  const visibleItems = items.slice(0, maxItems);

  const handleNavigate = (direction: "prev" | "next") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((i) =>
      direction === "prev"
        ? i === 0
          ? maxItems - 1
          : i - 1
        : i === maxItems - 1
          ? 0
          : i + 1,
    );
    setTimeout(() => setIsAnimating(false), TRANSITION_MS);
  };

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) >= SWIPE_THRESHOLD) {
      handleNavigate(diff > 0 ? "next" : "prev");
    }
  };

  if (!visibleItems.length) return null;

  const getDistance = (idx: number) => {
    let d = idx - currentIndex;
    if (d > maxItems / 2) d -= maxItems;
    if (d < -maxItems / 2) d += maxItems;
    return d;
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-black touch-pan-y"
      style={{ height: "70vh", minHeight: "500px" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {visibleItems.map((item, idx) => {
        const distance = getDistance(idx);
        if (Math.abs(distance) > 2) return null;

        const isCurrent = distance === 0;
        const style = getSlideStyle(distance);

        const mediaType: MediaType = item.media_type === "tv" ? "tv" : "movie";
        const title = item.title || item.name || "";
        const genreNames = item.genre_ids
          ?.map((id) => genreMap[id])
          .filter(Boolean) as string[] | undefined;
        const genreText = genreNames?.length ? genreNames.join(" • ") : null;

        return (
          <div
            key={item.id}
            className="absolute top-0 bottom-0 overflow-hidden rounded-xl"
            style={{
              ...style,
              transition: `all ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          >
            <Image
              src={getImageUrl(item.backdrop_path || item.poster_path, "w1280")}
              alt={title}
              fill
              className="object-cover object-center"
              priority={idx === 0}
              sizes="91vw"
            />

            {/* 그라데이션 - 모든 슬라이드에 동일 적용 */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none" />

            {/* 콘텐츠 */}
            <div
              className="absolute inset-0 flex items-end md:items-center pointer-events-none"
              style={{
                opacity: isCurrent ? 1 : 0,
                transition: `opacity ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
            >
              <div
                className="w-full pb-8 md:pb-0"
                style={{ paddingLeft: `${CONTENT_PAD}%` }}
              >
                <div className="max-w-xl space-y-2 md:space-y-3 pointer-events-auto">
                  <Badge className="bg-red-700 text-white border-0 text-xs font-bold">
                    {mediaType === "movie" ? "영화" : "TV"}
                  </Badge>

                  <h1 className="text-xl sm:text-2xl md:text-5xl font-bold text-white leading-tight">
                    {title}
                  </h1>

                  <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm md:text-lg">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white/80 font-medium">
                        {item.vote_average.toFixed(1)}
                      </span>
                    </div>
                    {genreText && (
                      <>
                        <span className="text-white/40">|</span>
                        <span className="text-white/80 line-clamp-1">
                          {genreText}
                        </span>
                      </>
                    )}
                  </div>

                  <Link
                    href={`/${mediaType}/${item.id}`}
                    className="pt-2 md:pt-4 inline-block"
                  >
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-white/90 font-bold cursor-pointer text-sm sm:text-base md:text-xl px-6 sm:px-10 md:px-16 py-3 sm:py-5 md:py-7 rounded-lg md:rounded-xl"
                    >
                      자세히 보기
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* 사이드 슬라이드 클릭 영역 */}
            {!isCurrent && Math.abs(distance) === 1 && (
              <button
                onClick={() =>
                  handleNavigate(distance === -1 ? "prev" : "next")
                }
                className="absolute inset-0 cursor-pointer z-10"
                aria-label={distance === -1 ? "이전" : "다음"}
              />
            )}
          </div>
        );
      })}

      {/* 하단 네비게이터 (고정, 데스크톱만) */}
      <div className="hidden md:block absolute bottom-12 left-0 right-0 z-[5]">
        <div
          className="inline-flex items-center gap-6 rounded-full bg-white/5 backdrop-blur-sm border border-white/5 px-5 py-3.5"
          style={{ marginLeft: `${NAV_LEFT}%` }}
        >
          <button
            onClick={() => handleNavigate("prev")}
            disabled={isAnimating}
            className="text-white/70 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            aria-label="이전"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <span className="text-white/80 text-xl font-medium tabular-nums">
            {currentIndex + 1} / {maxItems}
          </span>
          <button
            onClick={() => handleNavigate("next")}
            disabled={isAnimating}
            className="text-white/70 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            aria-label="다음"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
