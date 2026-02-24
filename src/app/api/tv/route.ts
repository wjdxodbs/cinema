import { NextRequest, NextResponse } from "next/server";
import { getPopularTv, getTvByGenre } from "@/lib/tmdb";

/** TV 프로그램 목록 조회 API (장르 지정 시 해당 장르, 미지정 시 인기 TV) */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const genreId = searchParams.get("genre");

  const data = genreId
    ? await getTvByGenre(parseInt(genreId), page)
    : await getPopularTv(page);

  return NextResponse.json(data);
}
