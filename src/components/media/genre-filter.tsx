"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Genre } from "@/types/tmdb";

interface GenreFilterProps {
  genres: Genre[];
  selectedGenreId: number | null;
  onGenreChange: (genreId: number | null) => void;
}

export function GenreFilter({ genres, selectedGenreId, onGenreChange }: GenreFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex items-center gap-2 pb-3">
        <Button
          variant={selectedGenreId === null ? "default" : "outline"}
          size="sm"
          className={cn(
            "rounded-full shrink-0 transition-all",
            selectedGenreId === null
              ? "bg-white text-black hover:bg-white/90"
              : "border-border/50 text-muted-foreground hover:text-white hover:border-white/30"
          )}
          onClick={() => onGenreChange(null)}
        >
          전체
        </Button>
        {genres.map((genre) => (
          <Button
            key={genre.id}
            variant={selectedGenreId === genre.id ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-full shrink-0 transition-all",
              selectedGenreId === genre.id
                ? "bg-white text-black hover:bg-white/90"
                : "border-border/50 text-muted-foreground hover:text-white hover:border-white/30"
            )}
            onClick={() => onGenreChange(genre.id)}
          >
            {genre.name}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
}
