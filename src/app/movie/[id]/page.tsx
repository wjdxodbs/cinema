"use client";

import { use } from "react";
import Image from "next/image";
import { Bookmark, BookmarkCheck, Star, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl } from "@/lib/tmdb";
import { useWatchlistStore } from "@/store/watchlist";
import {
  useMovieDetail,
  useMovieCredits,
  useMovieVideos,
  useSimilarMovies,
} from "@/hooks/use-media-detail";
import { MediaGrid } from "@/components/media/media-grid";
import type { Movie } from "@/types/tmdb";

export default function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const movieId = parseInt(id);

  const { data: movie, isPending } = useMovieDetail(movieId);
  const { data: credits } = useMovieCredits(movieId);
  const { data: videos } = useMovieVideos(movieId);
  const { data: similar } = useSimilarMovies(movieId);

  const addItem = useWatchlistStore((s) => s.addItem);
  const removeItem = useWatchlistStore((s) => s.removeItem);
  const inWatchlist = useWatchlistStore((s) =>
    movie ? s.items.some((w) => w.id === movie.id && w.media_type === "movie") : false
  );

  if (isPending) return <DetailSkeleton />;
  if (!movie) return null;
  const trailer = videos?.results.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );
  const director = credits?.crew.find((c) => c.job === "Director");
  const cast = credits?.cast.slice(0, 10) ?? [];

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeItem(movie.id, "movie");
    } else {
      addItem({
        id: movie.id,
        media_type: "movie",
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        overview: movie.overview,
        backdrop_path: movie.backdrop_path,
      });
    }
  };

  return (
    <div className="pb-16">
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "55vh", minHeight: "400px" }}
      >
        <Image
          src={getImageUrl(movie.backdrop_path || movie.poster_path, "original")}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0">
            <div className="relative w-44 md:w-56 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src={getImageUrl(movie.poster_path, "w342")}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 176px, 224px"
              />
            </div>
          </div>

          <div className="flex-1 pt-2">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {movie.genres?.map((g) => (
                <Badge key={g.id} variant="secondary" className="bg-white/10 text-white border-0">
                  {g.name}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{movie.title}</h1>

            {movie.tagline && (
              <p className="text-muted-foreground italic mb-4">&ldquo;{movie.tagline}&rdquo;</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-5">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-semibold">{movie.vote_average.toFixed(1)}</span>
                <span>({movie.vote_count.toLocaleString()}명)</span>
              </div>
              {movie.release_date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(movie.release_date).getFullYear()}년</span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>
                    {Math.floor(movie.runtime / 60)}시간 {movie.runtime % 60}분
                  </span>
                </div>
              )}
            </div>

            <p className="text-white/80 leading-relaxed mb-6 max-w-2xl">
              {movie.overview || "줄거리 정보가 없습니다."}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                className={
                  inWatchlist
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 hover:bg-yellow-500/30"
                    : "bg-white text-black hover:bg-white/90"
                }
                onClick={handleWatchlistToggle}
              >
                {inWatchlist ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 mr-2" /> 찜 해제
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 mr-2" /> 찜하기
                  </>
                )}
              </Button>
            </div>

            {director && (
              <p className="text-sm text-muted-foreground mt-4">
                <span className="text-white/60">감독:</span>{" "}
                <span className="text-white">{director.name}</span>
              </p>
            )}
          </div>
        </div>

        {trailer && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-white mb-4">예고편</h2>
            <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}

        {cast.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-white mb-4">출연진</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {cast.map((actor) => (
                <div key={actor.id} className="flex flex-col items-center text-center gap-2">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted border border-border/50">
                    <Image
                      src={getImageUrl(actor.profile_path, "w185")}
                      alt={actor.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white line-clamp-1">{actor.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {similar?.results && similar.results.length > 0 && (
          <div className="mt-10">
            <Separator className="bg-border/30 mb-8" />
            <h2 className="text-xl font-bold text-white mb-4">비슷한 영화</h2>
            <MediaGrid
              items={similar.results.slice(0, 10) as Movie[]}
              mediaType="movie"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="pb-16">
      <Skeleton className="w-full" style={{ height: "55vh", minHeight: "400px" }} />
      <div className="container mx-auto max-w-7xl px-4 md:px-6 -mt-32 relative z-10">
        <div className="flex gap-8">
          <Skeleton className="w-44 md:w-56 aspect-[2/3] rounded-xl shrink-0" />
          <div className="flex-1 pt-2 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full max-w-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
