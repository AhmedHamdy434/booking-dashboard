/**
 * Converts a time string "HH:mm" or "HH:mm:ss" to total minutes from midnight.
 */
export const timeToMinutes = (time: string): number => {
  const [hh, mm] = time.split(':').map(Number);
  return hh * 60 + mm;
};

/**
 * Converts total minutes from midnight back to "HH:mm" string.
 */
export const minutesToTime = (mins: number): string => {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

/**
 * Checks whether a new booking [newStart, newStart+newDuration) overlaps
 * with an existing booking [existingStart, existingStart+existingDuration).
 * 
 * Overlap condition: newStart < existingEnd AND newEnd > existingStart
 */
export const hasOverlap = (
  newStartMins: number,
  newDurationMins: number,
  existingStartMins: number,
  existingDurationMins: number
): boolean => {
  const newEnd = newStartMins + newDurationMins;
  const existingEnd = existingStartMins + existingDurationMins;
  return newStartMins < existingEnd && newEnd > existingStartMins;
};

/**
 * Generates an array of time slots between a start and end time,
 * each slot is intervalMins apart. The last slot generated must leave
 * enough room for a full serviceDurationMins before end time.
 *
 * @param startTime Start time in "HH:mm:ss" or "HH:mm" format
 * @param endTime End time in "HH:mm:ss" or "HH:mm" format
 * @param serviceDurationMins Duration of the service being booked (in minutes)
 * @param intervalMins Interval between slots in minutes
 * @returns Array of time slots in "HH:mm" format
 */
export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  serviceDurationMins: number = 30,
  intervalMins: number = 30
): string[] => {
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);

  if (isNaN(startMins) || isNaN(endMins) || startMins >= endMins) return [];

  const slots: string[] = [];
  let current = startMins;

  // A slot is valid only if the full service duration fits before closing time
  while (current + serviceDurationMins <= endMins) {
    slots.push(minutesToTime(current));
    current += intervalMins;
  }

  return slots;
};

export interface ExistingBookingSlot {
  startTime: string; // "HH:mm" or "HH:mm:ss"
  durationMins: number;
}

/**
 * Given a list of candidate slots and existing bookings for the day,
 * returns each slot annotated with whether it conflicts.
 *
 * A slot conflicts if booking it for `newDurationMins` would overlap
 * with ANY existing booking (accounting for each existing booking's own duration).
 */
export const annotateSlots = (
  slots: string[],
  newDurationMins: number,
  existingBookings: ExistingBookingSlot[]
): { time: string; isBooked: boolean }[] => {
  return slots.map(slot => {
    const slotStartMins = timeToMinutes(slot);

    const conflicts = existingBookings.some(({ startTime, durationMins }) => {
      const existingStartMins = timeToMinutes(startTime);
      return hasOverlap(slotStartMins, newDurationMins, existingStartMins, durationMins);
    });

    return { time: slot, isBooked: conflicts };
  });
};

