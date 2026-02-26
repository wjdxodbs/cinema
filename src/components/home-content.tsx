"use client";

import { useTrending } from "@/hooks/use-trending";
import { HeroBanner } from "@/components/media/hero-banner";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaGridSkeleton } from "@/components/skeletons/media-card-skeleton";
import { HeroBannerSkeleton } from "@/components/skeletons/hero-banner-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Movie, TvShow } from "@/types/tmdb";

export function HomeContent() {
  const trendingAll = useTrending("all", "week");
  const trendingMovies = useTrending("movie", "week");
  const trendingTv = useTrending("tv", "week");

  return (
    <div className="pb-16">
      {trendingAll.isPending ? (
        <HeroBannerSkeleton />
      ) : trendingAll.data?.results && trendingAll.data.results.length > 0 ? (
        <HeroBanner items={trendingAll.data.results} />
      ) : null}

      <div className="container mx-auto max-w-7xl px-4 md:px-6 mt-10">
        <Tabs defaultValue="movies">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              이번 주 트렌딩
            </h2>
            <TabsList className="group-data-[orientation=horizontal]/tabs:h-10 md:group-data-[orientation=horizontal]/tabs:h-12 bg-muted/50 p-1">
              <TabsTrigger
                value="movies"
                className="cursor-pointer w-13 md:w-17 text-sm md:text-base font-semibold data-[state=active]:text-foreground"
              >
                영화
              </TabsTrigger>
              <TabsTrigger
                value="tv"
                className="cursor-pointer w-13 md:w-17 text-sm md:text-base font-semibold data-[state=active]:text-foreground"
              >
                TV
              </TabsTrigger>
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
