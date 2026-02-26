"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/use-search";
import { useDebounce } from "@/hooks/use-debounce";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaGridSkeleton } from "@/components/skeletons/media-card-skeleton";
import { InfiniteScroll } from "@/components/media/infinite-scroll";
import type { Media } from "@/types/tmdb";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(query);
  const debouncedInput = useDebounce(inputValue, 400);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    if (debouncedInput.trim()) {
      router.replace(`/search?q=${encodeURIComponent(debouncedInput.trim())}`, {
        scroll: false,
      });
    } else {
      router.replace("/search", { scroll: false });
    }
  }, [debouncedInput, router]);

  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useSearch(query);

  const filtered =
    data?.pages
      .flatMap((page) => page.results)
      .filter((item) => {
        const m = item as Media;
        return (
          (m.media_type === "movie" || m.media_type === "tv") && m.poster_path
        );
      }) ?? [];
  const seen = new Set<string>();
  const results = filtered.filter((item) => {
    const m = item as Media;
    const key = `${m.media_type ?? "movie"}-${m.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
      <div className="relative w-full mb-6 md:hidden">
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

      {query.trim() && (
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          &ldquo;{query}&rdquo; 검색 결과
        </h1>
      )}

      {!query.trim() ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Search className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-lg">검색어를 입력하세요</p>
        </div>
      ) : isPending ? (
        <MediaGridSkeleton />
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="text-lg">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <>
          <MediaGrid items={results as Media[]} mediaType="movie" />
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
