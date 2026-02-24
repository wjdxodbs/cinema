import { NextRequest, NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

/** 영화+TV 통합 검색 API (?q=검색어&page=1) */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");

  if (!query.trim()) {
    return NextResponse.json({ results: [], page: 1, total_pages: 0, total_results: 0 });
  }

  const data = await searchMulti(query, page);
  return NextResponse.json(data);
}
