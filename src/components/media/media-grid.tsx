import { MediaCard } from "./media-card";
import type { Media, MediaType } from "@/types/tmdb";
import { cn } from "@/lib/utils";

interface MediaGridProps {
  items: Media[];
  mediaType: MediaType;
  className?: string;
  priorityCount?: number;
}

export function MediaGrid({ items, mediaType, className, priorityCount = 5 }: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg">결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
        className
      )}
    >
      {items.map((item, index) => (
        <MediaCard
          key={`${item.media_type ?? mediaType}-${item.id}`}
          item={item}
          mediaType={
            (item.media_type as MediaType) ||
            mediaType
          }
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
