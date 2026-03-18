import { Skeleton } from "@/components/ui/skeleton";

export function PublicPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <div className="relative h-80 sm:h-96 bg-primary/10">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4">
          <Skeleton className="w-24 h-24 rounded-3xl" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 py-10">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div>
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
