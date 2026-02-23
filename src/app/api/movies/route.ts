import { NextRequest, NextResponse } from "next/server";
import { getPopularMovies, getMoviesByGenre } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const genreId = searchParams.get("genre");

  const data = genreId
    ? await getMoviesByGenre(parseInt(genreId), page)
    : await getPopularMovies(page);

  return NextResponse.json(data);
}
