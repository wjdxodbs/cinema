"use client";

import { useTrending } from "@/hooks/use-trending";
import { HeroBanner } from "@/components/media/hero-banner";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaGridSkeleton } from "@/components/media/media-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Movie, TvShow } from "@/types/tmdb";

function HeroSkeleton() {
  return <Skeleton className="w-full" style={{ height: "70vh", minHeight: "500px" }} />;
}

export default function Home() {
  const trendingAll = useTrending("all", "week");
  const trendingMovies = useTrending("movie", "week");
  const trendingTv = useTrending("tv", "week");

  return (
    <div className="pb-16">
      {trendingAll.isPending ? (
        <HeroSkeleton />
      ) : trendingAll.data?.results && trendingAll.data.results.length > 0 ? (
        <HeroBanner items={trendingAll.data.results.slice(0, 8)} />
      ) : null}

      <div className="container mx-auto max-w-7xl px-4 md:px-6 mt-10">
        <Tabs defaultValue="movies">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">이번 주 트렌딩</h2>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="movies" className="text-sm">영화</TabsTrigger>
              <TabsTrigger value="tv" className="text-sm">TV</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="movies">
            {trendingMovies.isPending ? (
              <MediaGridSkeleton count={10} />
            ) : (
              <MediaGrid
                items={(trendingMovies.data?.results as Movie[]) || []}
                mediaType="movie"
              />
            )}
          </TabsContent>

          <TabsContent value="tv">
            {trendingTv.isPending ? (
              <MediaGridSkeleton count={10} />
            ) : (
              <MediaGrid
                items={(trendingTv.data?.results as TvShow[]) || []}
                mediaType="tv"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
