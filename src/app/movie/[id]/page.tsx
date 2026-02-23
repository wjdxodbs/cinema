import Image from "next/image";
import { Star, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getMovieDetail,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
} from "@/lib/tmdb";
import { getImageUrl } from "@/lib/utils";
import { WatchlistButton } from "@/components/media/watchlist-button";
import { MediaGrid } from "@/components/media/media-grid";
import type { Metadata } from "next";
import type { Movie } from "@/types/tmdb";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetail(parseInt(id));
  return {
    title: `${movie.title} - Cinema`,
    description: movie.overview || `${movie.title} 상세 정보`,
    openGraph: {
      title: movie.title,
      description: movie.overview || undefined,
      images: movie.backdrop_path
        ? [{ url: getImageUrl(movie.backdrop_path, "w1280") }]
        : undefined,
    },
  };
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  const movieId = parseInt(id);

  const [movie, credits, videos, similar] = await Promise.all([
    getMovieDetail(movieId),
    getMovieCredits(movieId),
    getMovieVideos(movieId),
    getSimilarMovies(movieId),
  ]);

  const trailer = videos?.results.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );
  const director = credits?.crew.find((c) => c.job === "Director");
  const cast = credits?.cast.slice(0, 10) ?? [];

  const watchlistItem = {
    id: movie.id,
    media_type: "movie" as const,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date || "",
    overview: movie.overview,
    backdrop_path: movie.backdrop_path,
    genre_ids: movie.genres?.map((g) => g.id) ?? movie.genre_ids,
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
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {movie.genres.map((g) => (
                  <Badge key={g.id} variant="secondary" className="bg-white/10 text-white border-0">
                    {g.name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{movie.title}</h1>
              <WatchlistButton item={watchlistItem} variant="icon" />
            </div>

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

            {director && (
              <p className="text-sm text-muted-foreground">
                <span className="text-white/80">감독:</span>{" "}
                <span className="text-white">{director.name}</span>
              </p>
            )}

          </div>
        </div>

        {trailer && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-white mb-4">예고편</h2>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
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
                      src={actor.profile_path ? getImageUrl(actor.profile_path, "w185") : "/people.svg"}
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
