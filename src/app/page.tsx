import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTrending } from "@/lib/tmdb";
import { HomeContent } from "@/components/home-content";

export default async function Home() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["trending", "all", "week"],
      queryFn: () => getTrending("all", "week"),
    }),
    queryClient.prefetchQuery({
      queryKey: ["trending", "movie", "week"],
      queryFn: () => getTrending("movie", "week"),
    }),
    queryClient.prefetchQuery({
      queryKey: ["trending", "tv", "week"],
      queryFn: () => getTrending("tv", "week"),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeContent />
    </HydrationBoundary>
  );
}
