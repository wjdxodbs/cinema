"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlistStore } from "@/store/watchlist";
import { cn } from "@/lib/utils";
import type { WatchlistItem } from "@/types/tmdb";

interface WatchlistButtonProps {
  item: Omit<WatchlistItem, "added_at">;
  variant?: "icon" | "label";
  className?: string;
}

export function WatchlistButton({ item, variant = "label", className }: WatchlistButtonProps) {
  const addItem = useWatchlistStore((s) => s.addItem);
  const removeItem = useWatchlistStore((s) => s.removeItem);
  const inWatchlist = useWatchlistStore((s) =>
    s.items.some((w) => w.id === item.id && w.media_type === item.media_type)
  );

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeItem(item.id, item.media_type);
    } else {
      addItem(item);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 rounded-full bg-black/60 backdrop-blur-sm transition-all cursor-pointer",
          inWatchlist
            ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/50 hover:text-yellow-300 hover:bg-yellow-400/30"
            : "text-white/70 border border-white/30 hover:text-white",
          className
        )}
        onClick={handleToggle}
      >
        {inWatchlist ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      </Button>
    );
  }

  return (
    <Button
      className={cn(
        "cursor-pointer",
        inWatchlist
          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 hover:bg-yellow-500/30"
          : "bg-white/10 text-white border border-white/20 hover:bg-white/20",
        className
      )}
      onClick={handleToggle}
    >
      {inWatchlist ? (
        <>
          <BookmarkCheck className="h-4 w-4 mr-2" /> 찜 해제
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4 mr-2" /> 찜하기
        </>
      )}
    </Button>
  );
}
