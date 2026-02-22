"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, BookmarkX, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/lib/tmdb";
import { useWatchlistStore } from "@/store/watchlist";

export default function WatchlistPage() {
  const { items, removeItem, clearAll } = useWatchlistStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">찜 목록</h1>
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <BookmarkX className="h-20 w-20 mb-4 opacity-20" />
          <p className="text-xl mb-2">찜한 항목이 없습니다</p>
          <p className="text-sm mb-6">영화나 TV 프로그램에서 북마크 아이콘을 눌러 찜해보세요.</p>
          <div className="flex gap-3">
            <Link href="/movies">
              <Button variant="outline" className="border-border/50 hover:border-white/30">
                영화 탐색
              </Button>
            </Link>
            <Link href="/tv">
              <Button variant="outline" className="border-border/50 hover:border-white/30">
                TV 탐색
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">찜 목록</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{items.length}개</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive gap-2"
            onClick={clearAll}
          >
            <Trash2 className="h-4 w-4" />
            전체 삭제
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${item.media_type}-${item.id}`}>
            <div className="flex gap-4 p-4 rounded-lg bg-card border border-border/50 hover:border-white/20 transition-colors group">
              <Link href={`/${item.media_type}/${item.id}`} className="shrink-0">
                <div className="relative w-16 aspect-[2/3] rounded overflow-hidden">
                  <Image
                    src={getImageUrl(item.poster_path, "w185")}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/${item.media_type}/${item.id}`}>
                      <h3 className="font-semibold text-white hover:text-white/80 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-muted/70 border-0"
                      >
                        {item.media_type === "movie" ? "영화" : "TV"}
                      </Badge>
                      {item.release_date && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.release_date).getFullYear()}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-muted-foreground">
                          {item.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => removeItem(item.id, item.media_type)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {item.overview || "줄거리 정보가 없습니다."}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  찜한 날: {new Date(item.added_at).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>
            {index < items.length - 1 && <Separator className="bg-border/30 my-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}
