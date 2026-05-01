import { useState, useMemo, useCallback } from "react";
import {
  useBarbers,
  useBarberAvailability,
  useUpsertAvailability,
  useDeleteAvailabilityDay,
} from "./hooks/useBarbers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { UpsertAvailabilityDTO } from "@/types/barber";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { AvailabilityForm } from "./components/AvailabilityForm";
import { AvailabilitySkeleton } from "./components/AvailabilitySkeleton";

export const AvailabilityPage = () => {
  const { t } = useTranslation();
  const { data: barbers, isLoading: isLoadingBarbers } = useBarbers();
  const [selectedBarberId, setSelectedBarberId] = useState<string>("");

  const DAYS_OF_WEEK = useMemo(
    () => [
      { value: 0, label: t("availability.days.0") },
      { value: 1, label: t("availability.days.1") },
      { value: 2, label: t("availability.days.2") },
      { value: 3, label: t("availability.days.3") },
      { value: 4, label: t("availability.days.4") },
      { value: 5, label: t("availability.days.5") },
      { value: 6, label: t("availability.days.6") },
    ],
    [t],
  );

  const { data: availabilityData, isLoading: isLoadingAvailability } =
    useBarberAvailability(selectedBarberId);
  const { mutate: upsertAvailability, isPending: isSaving } =
    useUpsertAvailability(selectedBarberId);
  const { mutate: deleteAvailabilityDay } =
    useDeleteAvailabilityDay(selectedBarberId);

  const handleSave = useCallback(
    (
      schedule: Record<
        number,
        { isWorking: boolean; start_time: string; end_time: string }
      >,
    ) => {
      if (!selectedBarberId) return;

      const toUpsert: UpsertAvailabilityDTO[] = [];

      Object.entries(schedule).forEach(([dayStr, data]) => {
        const day = parseInt(dayStr, 10);

        if (data.isWorking) {
          if (!data.start_time || !data.end_time) {
            toast.error(
              t("availability.toast.provide_times", {
                day: DAYS_OF_WEEK[day].label,
              }),
            );
            return;
          }
          if (data.start_time >= data.end_time) {
            toast.error(
              t("availability.toast.invalid_range", {
                day: DAYS_OF_WEEK[day].label,
              }),
            );
            return;
          }

          toUpsert.push({
            barber_id: selectedBarberId,
            day_of_week: day,
            start_time: data.start_time,
            end_time: data.end_time,
          });
        } else {
          const wasWorking = availabilityData?.some(
            (a) => a.day_of_week === day,
          );
          if (wasWorking) {
            deleteAvailabilityDay({
              barberId: selectedBarberId,
              dayOfWeek: day,
            });
          }
        }
      });

      if (toUpsert.length > 0) {
        upsertAvailability(toUpsert);
      } else {
        toast.success(t("availability.toast.success"));
      }
    },
    [
      selectedBarberId,
      availabilityData,
      deleteAvailabilityDay,
      upsertAvailability,
      t,
      DAYS_OF_WEEK,
    ],
  );

  if (isLoadingBarbers) {
    return <AvailabilitySkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("availability.title")}
        </h1>
        <p className="text-muted-foreground">{t("availability.subtitle")}</p>
      </div>

      <Card className="border-border shadow-sm max-w-3xl">
        <CardHeader>
          <CardTitle>{t("availability.select_barber_title")}</CardTitle>
          <CardDescription>
            {t("availability.select_barber_desc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedBarberId}
            onValueChange={setSelectedBarberId}
          >
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue
                placeholder={t("availability.select_placeholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {barbers?.map((barber) => (
                <SelectItem key={barber.id} value={barber.id}>
                  {barber.name}{" "}
                  {!barber.is_active && t("availability.inactive_suffix")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedBarberId && (
        <>
          {isLoadingAvailability ? (
            <div className="flex items-center justify-center py-12 max-w-3xl">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <AvailabilityForm
              key={selectedBarberId}
              initialData={availabilityData || []}
              onSave={handleSave}
              isSaving={isSaving}
              daysOfWeek={DAYS_OF_WEEK}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AvailabilityPage;
