"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/use-search";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaGridSkeleton } from "@/components/media/media-card-skeleton";
import { InfiniteScroll } from "@/components/media/infinite-scroll";
import type { Media } from "@/types/tmdb";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(initialQuery);
  const debouncedQuery = useDebounce(inputValue, 400);

  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useSearch(debouncedQuery);

  const results = useMemo(() => {
    return (
      data?.pages
        .flatMap((page) => page.results)
        .filter((item) => {
          const m = item as Media;
          return (
            (m.media_type === "movie" || m.media_type === "tv") &&
            m.poster_path
          );
        }) ?? []
    );
  }, [data]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`, { scroll: false });
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">검색</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="영화, TV 프로그램을 검색하세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-10 h-12 text-base bg-muted/50 border-border/50 focus:border-white/30"
            autoFocus
          />
        </div>
      </form>

      {!debouncedQuery.trim() ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Search className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-lg">검색어를 입력하세요</p>
        </div>
      ) : isPending ? (
        <MediaGridSkeleton />
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="text-lg">
            &ldquo;{debouncedQuery}&rdquo;에 대한 결과가 없습니다.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            &ldquo;{debouncedQuery}&rdquo; 검색 결과 {data?.pages[0]?.total_results?.toLocaleString()}건
          </p>
          <MediaGrid
            items={results as Media[]}
            mediaType="movie"
          />
          <InfiniteScroll
            onLoadMore={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
