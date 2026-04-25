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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import type { BarberAvailability, UpsertAvailabilityDTO } from "@/types/barber";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// Sub-component to manage the local form state
// This avoids the "cascading renders" error by initializing state during construction
const AvailabilityForm = ({
  initialData,
  onSave,
  isSaving,
  daysOfWeek,
  t,
}: {
  initialData: BarberAvailability[];
  onSave: (
    schedule: Record<
      number,
      { isWorking: boolean; start_time: string; end_time: string }
    >,
  ) => void;
  isSaving: boolean;
  daysOfWeek: { value: number; label: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  barberName: string;
}) => {
  // Initialize schedule form with data directly in state
  const [schedule, setSchedule] = useState<
    Record<number, { isWorking: boolean; start_time: string; end_time: string }>
  >(() => {
    const newSchedule: Record<
      number,
      { isWorking: boolean; start_time: string; end_time: string }
    > = {};

    // Set default values for all days
    [0, 1, 2, 3, 4, 5, 6].forEach((day) => {
      const avail = initialData.find((a) => a.day_of_week === day);
      newSchedule[day] = {
        isWorking: !!avail,
        start_time: avail ? avail.start_time.substring(0, 5) : "09:00",
        end_time: avail ? avail.end_time.substring(0, 5) : "17:00",
      };
    });
    return newSchedule;
  });

  const toggleDay = (day: number, checked: boolean) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], isWorking: checked },
    }));
  };

  const updateTime = (
    day: number,
    field: "start_time" | "end_time",
    value: string,
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  return (
    <Card className="border-slate-200/60 dark:border-slate-800 shadow-sm max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle>{t("availability.weekly_schedule")}</CardTitle>
          <CardDescription>{t("availability.schedule_desc")}</CardDescription>
        </div>
        <Button onClick={() => onSave(schedule)} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin ml-2" />
          ) : (
            <Save className="mr-2 h-4 w-4 ml-2" />
          )}
          {t("availability.save_schedule")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {daysOfWeek.map((day) => (
            <div
              key={day.value}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-card"
            >
              <div className="flex items-center space-x-2 sm:w-1/3">
                <Checkbox
                  id={`day-${day.value}`}
                  checked={schedule[day.value]?.isWorking || false}
                  onCheckedChange={(checked) =>
                    toggleDay(day.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={`day-${day.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ml-2 mr-2"
                >
                  {day.label}
                </label>
              </div>

              <div
                className={`flex items-center gap-2 flex-1 transition-opacity ${schedule[day.value]?.isWorking ? "opacity-100" : "opacity-40 pointer-events-none"}`}
              >
                <div className="grid gap-1.5 flex-1">
                  <Label className="text-xs text-muted-foreground">
                    {t("availability.start_time")}
                  </Label>
                  <Input
                    type="time"
                    value={schedule[day.value]?.start_time || ""}
                    onChange={(e) =>
                      updateTime(day.value, "start_time", e.target.value)
                    }
                  />
                </div>
                <span className="text-muted-foreground mt-5">-</span>
                <div className="grid gap-1.5 flex-1">
                  <Label className="text-xs text-muted-foreground">
                    {t("availability.end_time")}
                  </Label>
                  <Input
                    type="time"
                    value={schedule[day.value]?.end_time || ""}
                    onChange={(e) =>
                      updateTime(day.value, "end_time", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

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

  const selectedBarber = useMemo(
    () => barbers?.find((b) => b.id === selectedBarberId),
    [barbers, selectedBarberId],
  );

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("availability.title")}
        </h1>
        <p className="text-muted-foreground">{t("availability.subtitle")}</p>
      </div>

      <Card className="border-slate-200/60 dark:border-slate-800 shadow-sm max-w-3xl">
        <CardHeader>
          <CardTitle>{t("availability.select_barber_title")}</CardTitle>
          <CardDescription>
            {t("availability.select_barber_desc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingBarbers ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />
              <span className="text-sm text-muted-foreground">
                {t("availability.loading_barbers")}
              </span>
            </div>
          ) : (
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
          )}
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
              key={selectedBarberId} // This resets the form state completely when barber changes
              initialData={availabilityData || []}
              onSave={handleSave}
              isSaving={isSaving}
              daysOfWeek={DAYS_OF_WEEK}
              t={t}
              barberName={selectedBarber?.name || ""}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AvailabilityPage;
