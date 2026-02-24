import { NextRequest, NextResponse } from "next/server";
import { getTrending } from "@/lib/tmdb";

/** 트렌딩 미디어 조회 API (?mediaType=all|movie|tv&timeWindow=day|week) */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mediaType = (searchParams.get("mediaType") || "all") as "movie" | "tv" | "all";
  const timeWindow = (searchParams.get("timeWindow") || "week") as "day" | "week";
  const page = parseInt(searchParams.get("page") || "1");

  const data = await getTrending(mediaType, timeWindow, page);
  return NextResponse.json(data);
}
