import { Skeleton } from "@/components/ui/skeleton";

export function HeroBannerSkeleton() {
  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "70vh", minHeight: "500px" }}
    >
      {/* 이전 슬라이드 */}
      <Skeleton className="absolute top-0 bottom-0 left-0 rounded-xl" style={{ width: "4%", transform: "scaleY(0.92)" }} />
      {/* 메인 슬라이드 */}
      <Skeleton className="absolute top-0 bottom-0 rounded-xl" style={{ left: "4.5%", width: "91%" }} />
      {/* 다음 슬라이드 */}
      <Skeleton className="absolute top-0 bottom-0 right-0 rounded-xl" style={{ width: "4%", transform: "scaleY(0.92)" }} />

      {/* 콘텐츠 스켈레톤 */}
      <div className="absolute inset-0 flex items-center z-[3]" style={{ left: "4.5%" }}>
        <div style={{ paddingLeft: "6%" }}>
          <div className="space-y-4">
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-14 w-44 rounded-xl mt-4" />
          </div>
        </div>
      </div>

      {/* 네비게이터 스켈레톤 */}
      <div className="absolute bottom-12 z-[5]" style={{ left: "9.96%" }}>
        <Skeleton className="h-14 w-48 rounded-full" />
      </div>
    </div>
  );
}
