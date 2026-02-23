import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getPopularTv, getTvGenres } from "@/lib/tmdb";
import { TvContent } from "@/components/tv-content";

export default async function TvPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ["tv", "popular"],
      queryFn: () => getPopularTv(1),
      initialPageParam: 1,
    }),
    queryClient.prefetchQuery({
      queryKey: ["genres", "tv"],
      queryFn: getTvGenres,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TvContent />
    </HydrationBoundary>
  );
}
