import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const BookingWizardSkeleton = () => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Step Indicator Skeleton */}
      <div className="flex items-center justify-between mb-8 max-w-md mx-auto relative">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center z-10">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-3 w-16 mt-2" />
          </div>
        ))}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 w-64 h-0.5 bg-muted -z-0" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-64 mx-auto mb-6" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="pt-4 border-t border-border/50 flex justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
