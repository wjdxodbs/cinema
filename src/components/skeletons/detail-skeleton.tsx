import { Skeleton } from "@/components/ui/skeleton";

export function DetailSkeleton() {
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
