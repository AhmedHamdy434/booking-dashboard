import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const AvailabilitySkeleton = () => {
  return (
    <div className="space-y-6">
      <Card className="border-border shadow-sm max-w-3xl">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full sm:w-[300px]" />
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm max-w-3xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2 sm:w-1/3">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-2 flex-1">
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="pt-4 text-muted-foreground">-</div>
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
