import { NextRequest, NextResponse } from "next/server";
import { getMovieGenres, getTvGenres } from "@/lib/tmdb";

/** 장르 목록 조회 API (?type=movie|tv) */
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") || "movie";

  const data = type === "tv" ? await getTvGenres() : await getMovieGenres();
  return NextResponse.json(data);
}
