import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  RefreshCw,
  Calendar,
  Clock,
  Scissors,
  User,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import { useBookings, useUpdateBookingStatus } from "../hooks/useBookings";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const BookingsList = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const filters = useMemo(
    () => ({
      status: searchParams.get("status") || "all",
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
      barberId: searchParams.get("barberId") || "all",
    }),
    [searchParams],
  );

  const { data: bookings, isLoading } = useBookings(filters);
  const { mutate: updateStatus, isPending } = useUpdateBookingStatus();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const dateLocale = i18n.language === "ar" ? arSA : undefined;

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="h-2 w-full rounded-none" />
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-border rounded-2xl bg-muted/50">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
          <ClipboardList className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground mb-1">
          {t("bookings.no_bookings")}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {t("bookings.empty_description")}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" /> {t("bookings.refresh")}
        </Button>
      </div>
    );
  }

  const isPast = (dateStr: string, timeStr: string) => {
    try {
      const bookingDate = parseISO(`${dateStr}T${timeStr}`);
      return bookingDate < new Date();
    } catch {
      return false;
    }
  };

  const getStatusLabel = (status: string, past: boolean) => {
    if (status === "confirmed") return t("bookings.status_confirmed");
    if (status === "pending") return t("bookings.status_pending");
    if (status === "cancelled") return t("bookings.status_cancelled");
    if (status === "completed") return t("bookings.status_completed");
    return past ? t("bookings.past") : t("bookings.upcoming");
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking) => {
        const past = isPast(booking.date, booking.time);
        const isUpdating = isPending && updatingId === booking.id;

        return (
          <Card
            key={booking.id}
            className={cn(
              "overflow-hidden transition-all hover:shadow-md border-border",
              past ? "opacity-70 bg-muted/30" : "bg-card",
              booking.status === "pending" &&
                !past &&
                "ring-1 ring-amber-500/30",
            )}
          >
            <div
              className={cn(
                "h-1.5 w-full",
                booking.status === "confirmed"
                  ? "bg-emerald-500"
                  : booking.status === "pending"
                    ? "bg-amber-500"
                    : booking.status === "cancelled"
                      ? "bg-red-500"
                      : booking.status === "completed"
                        ? "bg-blue-500"
                        : past
                          ? "bg-slate-300 dark:bg-slate-700"
                          : "bg-primary",
              )}
            />
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1 text-foreground">
                    {booking.services?.name || t("bookings.unknown_service")}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <Scissors className="w-3.5 h-3.5 mr-1.5 ml-1.5" />
                    {booking.barbers?.name || t("bookings.unknown_barber")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset",
                      booking.status === "confirmed"
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:ring-emerald-400/20"
                        : booking.status === "pending"
                          ? "bg-amber-50 text-amber-700 ring-amber-600/20 animate-pulse dark:bg-amber-500/20 dark:text-amber-400 dark:ring-amber-400/20"
                          : booking.status === "cancelled"
                            ? "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/20 dark:text-red-400 dark:ring-red-400/20"
                            : booking.status === "completed"
                              ? "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/20 dark:text-blue-400 dark:ring-blue-400/20"
                              : past
                                ? "bg-muted text-muted-foreground ring-border"
                                : "bg-primary/10 text-primary ring-primary/20",
                    )}
                  >
                    {getStatusLabel(booking.status, past)}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 mt-5 pt-4 border-t border-border">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-3 ml-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {format(parseISO(booking.date), "EEEE, MMM do, yyyy", {
                      locale: dateLocale,
                    })}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-3 ml-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {booking.time}
                  </span>
                </div>

                <div className="flex items-center text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                  <User className="w-3.5 h-3.5 mr-2 ml-2" />
                  <span className="font-mono truncate" title={booking.user_id}>
                    {t("bookings.user_id_label")}:{" "}
                    {booking.user_id.substring(0, 8)}...
                  </span>
                </div>
              </div>

              {booking.status === "pending" && !past && (
                <div className="flex gap-2 mt-5">
                  <Button
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => {
                      setUpdatingId(booking.id);
                      updateStatus({ id: booking.id, status: "confirmed" });
                    }}
                    disabled={isUpdating}
                  >
                    {isUpdating && updatingId === booking.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-1.5 ml-1.5" />{" "}
                        {t("bookings.accept")}
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      setUpdatingId(booking.id);
                      updateStatus({ id: booking.id, status: "cancelled" });
                    }}
                    disabled={isUpdating}
                  >
                    {isUpdating && updatingId === booking.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <X className="w-4 h-4 mr-1.5 ml-1.5" />{" "}
                        {t("bookings.reject")}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
