"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlistStore } from "@/store/watchlist";
import { cn } from "@/lib/utils";
import type { WatchlistItem } from "@/types/tmdb";

interface WatchlistButtonProps {
  item: Omit<WatchlistItem, "added_at">;
  className?: string;
}

export function WatchlistButton({ item, className }: WatchlistButtonProps) {
  const addItem = useWatchlistStore((s) => s.addItem);
  const removeItem = useWatchlistStore((s) => s.removeItem);
  const inWatchlist = useWatchlistStore((s) =>
    s.items.some((w) => w.id === item.id && w.media_type === item.media_type),
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

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 rounded-full bg-black/60 backdrop-blur-sm transition-all cursor-pointer",
        inWatchlist
          ? "bg-primary text-primary-foreground border border-primary/80 shadow-md shadow-black/40 hover:bg-primary/20 hover:border-primary/70 hover:text-primary"
          : "bg-black/65 text-white/80 border border-white/40 hover:bg-black/45 hover:text-white/60",
        className,
      )}
      onClick={handleToggle}
    >
      {inWatchlist ? (
        <BookmarkCheck className="size-4 md:size-5" />
      ) : (
        <Bookmark className="size-4 md:size-5" />
      )}
    </Button>
  );
}
