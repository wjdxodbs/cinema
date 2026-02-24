import { NextRequest, NextResponse } from "next/server";
import { getPopularMovies, getMoviesByGenre } from "@/lib/tmdb";

/** 영화 목록 조회 API (장르 지정 시 해당 장르, 미지정 시 인기 영화) */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const genreId = searchParams.get("genre");

  const data = genreId
    ? await getMoviesByGenre(parseInt(genreId), page)
    : await getPopularMovies(page);

  return NextResponse.json(data);
}
