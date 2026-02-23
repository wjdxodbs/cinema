"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Genre } from "@/types/tmdb";

interface GenreFilterProps {
  genres: Genre[];
  selectedGenreId: number | null;
  onGenreChange: (genreId: number | null) => void;
}

function GenreButton({
  label,
  selected,
  onClick,
  className,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      role="option"
      className={cn(
        "rounded-md px-3 py-2 text-left text-sm transition-colors",
        selected ? "bg-primary text-primary-foreground" : "hover:bg-muted",
        className,
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function GenreFilter({ genres, selectedGenreId, onGenreChange }: GenreFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    selectedGenreId === null
      ? "전체"
      : genres.find((g) => g.id === selectedGenreId)?.name ?? "전체";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current && !ref.current.contains(target) && (!mobileRef.current || !mobileRef.current.contains(target))) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  const handleSelect = (genreId: number | null) => {
    onGenreChange(genreId);
    setOpen(false);
  };

  return (
    <>
      <div ref={ref} className="relative inline-block">
        <Button
          variant="outline"
          className="w-[180px] justify-between bg-muted/50 border-border/50 text-foreground hover:bg-muted"
          onClick={() => setOpen((o) => !o)}
        >
          <span>{selectedLabel}</span>
          <ChevronDown
            className={cn("h-4 w-4 opacity-50 transition-transform", open && "rotate-180")}
          />
        </Button>

        {open && (
          <div
            className="hidden md:block absolute left-0 top-full z-50 mt-1 w-[400px] rounded-md border border-border bg-popover p-2 shadow-md"
            role="listbox"
          >
            <div className="grid grid-cols-3 gap-1.5">
              <GenreButton label="전체" selected={selectedGenreId === null} onClick={() => handleSelect(null)} />
              {genres.map((genre) => (
                <GenreButton
                  key={genre.id}
                  label={genre.name}
                  selected={selectedGenreId === genre.id}
                  onClick={() => handleSelect(genre.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {open && (
        <div
          ref={mobileRef}
          className="md:hidden fixed inset-0 z-[60] flex flex-col items-center animate-in fade-in duration-200 overflow-y-auto overscroll-contain"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
        >
          <button
            onClick={() => setOpen(false)}
            className="fixed top-4 right-4 z-[61] text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="h-6 w-6" />
          </button>
          <nav className="flex flex-col items-center gap-4 py-16" role="listbox">
            <GenreButton
              label="전체"
              selected={selectedGenreId === null}
              onClick={() => handleSelect(null)}
              className="text-xl font-bold px-4 py-2"
            />
            {genres.map((genre) => (
              <GenreButton
                key={genre.id}
                label={genre.name}
                selected={selectedGenreId === genre.id}
                onClick={() => handleSelect(genre.id)}
                className="text-xl font-bold px-4 py-2"
              />
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
