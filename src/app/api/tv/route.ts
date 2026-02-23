import { NextRequest, NextResponse } from "next/server";
import { getPopularTv, getTvByGenre } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const genreId = searchParams.get("genre");

  const data = genreId
    ? await getTvByGenre(parseInt(genreId), page)
    : await getPopularTv(page);

  return NextResponse.json(data);
}
