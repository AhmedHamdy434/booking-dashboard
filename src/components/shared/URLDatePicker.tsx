import * as React from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface URLDatePickerProps {
  label: string;
  paramKey: string;
  placeholder?: string;
}

export function URLDatePicker({ label, paramKey, placeholder = "Pick a date" }: URLDatePickerProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const dateStr = searchParams.get(paramKey);
  
  const date = React.useMemo(() => {
    if (!dateStr) return undefined;
    try {
      return parseISO(dateStr);
    } catch {
      return undefined;
    }
  }, [dateStr]);

  const setDate = (newDate: Date | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (newDate) {
      newParams.set(paramKey, format(newDate, "yyyy-MM-dd"));
    } else {
      newParams.delete(paramKey);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium flex items-center gap-2">
        <CalendarIcon className="w-3.5 h-3.5" /> {label}
      </Label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-background/50",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
       
      </div>
    </div>
  );
}
