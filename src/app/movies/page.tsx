import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getPopularMovies, getMovieGenres } from "@/lib/tmdb";
import { MoviesContent } from "@/components/movies-content";

export default async function MoviesPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ["movies", "popular"],
      queryFn: () => getPopularMovies(1),
      initialPageParam: 1,
    }),
    queryClient.prefetchQuery({
      queryKey: ["genres", "movie"],
      queryFn: getMovieGenres,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MoviesContent />
    </HydrationBoundary>
  );
}
