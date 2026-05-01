import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, X, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useBookings, useUpdateBookingStatus } from "@/features/bookings/hooks/useBookings";
import { PendingBookingsSkeleton } from "./PendingBookingsSkeleton";

export const PendingBookings = () => {
  const { t } = useTranslation();
  const { data: bookings, isLoading } = useBookings();
  const { mutate: updateStatus, isPending } = useUpdateBookingStatus();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const pendingBookings =useMemo(()=>(bookings || [])
    .filter((b) => b.status === "pending")
    .filter((b) => {
      try {
        const bookingDate = new Date(`${b.date}T${b.time}`);
        return bookingDate > new Date();
      } catch {
        return true; // If parsing fails, keep it just in case
      }
    }),[bookings]);

  return (
    <Card className="col-span-4 border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("dashboard.needs_approval")}</CardTitle>
        <Link
          to="/bookings"
          className="text-xs text-primary hover:underline font-medium"
        >
          {t("common.view_all")}
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <PendingBookingsSkeleton />
        ) : pendingBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border border-dashed rounded-xl bg-muted/50">
            <Check className="mb-4 h-8 w-8 text-emerald-500/50" />
            <p className="text-sm font-medium text-foreground">
              {t("dashboard.all_caught_up")}
            </p>
            <p className="text-xs">{t("dashboard.no_pending_bookings")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingBookings.slice(0, 4).map((booking) => {
              const isUpdating = isPending && updatingId === booking.id;
              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <AlertCircle size={18} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-foreground">
                        {booking.services?.name || t("bookings.unknown_service")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.date} {t("common.at")} {booking.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                      onClick={() => {
                        setUpdatingId(booking.id);
                        updateStatus({
                          id: booking.id,
                          status: "confirmed",
                        });
                      }}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => {
                        setUpdatingId(booking.id);
                        updateStatus({
                          id: booking.id,
                          status: "cancelled",
                        });
                      }}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <X size={16} />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
