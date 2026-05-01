import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import type { BarberAvailability } from "@/types/barber";
import { useTranslation } from "react-i18next";

interface AvailabilityFormProps {
  initialData: BarberAvailability[];
  onSave: (
    schedule: Record<
      number,
      { isWorking: boolean; start_time: string; end_time: string }
    >,
  ) => void;
  isSaving: boolean;
  daysOfWeek: { value: number; label: string }[];
}

export const AvailabilityForm = ({
  initialData,
  onSave,
  isSaving,
  daysOfWeek,
}: AvailabilityFormProps) => {
  const { t } = useTranslation();
  
  const [schedule, setSchedule] = useState<
    Record<number, { isWorking: boolean; start_time: string; end_time: string }>
  >(() => {
    const newSchedule: Record<
      number,
      { isWorking: boolean; start_time: string; end_time: string }
    > = {};

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
    <Card className="border-border shadow-sm max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle>{t("availability.weekly_schedule")}</CardTitle>
          <CardDescription>{t("availability.schedule_desc")}</CardDescription>
        </div>
        <Button onClick={() => onSave(schedule)} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="me-2 h-4 w-4 animate-spin ms-2" />
          ) : (
            <Save className="me-2 h-4 w-4 ms-2" />
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
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ms-2 me-2"
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
