import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const ScheduleSkeleton = () => {
  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border">
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-1">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
          <Skeleton className="h-8 w-40" />
          <div className="flex gap-1">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border border-border">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="bg-card h-24 p-2">
              <Skeleton className="h-4 w-6 mb-2" />
              {i % 7 === 2 && <Skeleton className="h-4 w-full rounded-sm" />}
              {i % 7 === 5 && <Skeleton className="h-4 w-full rounded-sm" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
