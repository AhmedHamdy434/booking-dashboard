-- Function to prevent overlapping bookings and enforce barber availability
CREATE OR REPLACE FUNCTION public.check_booking_overlap()
RETURNS trigger AS $$
DECLARE
    new_duration integer;
    new_start_time time;
    new_end_time time;
    existing_booking RECORD;
    availability_record RECORD;
    day_num integer;
BEGIN
    -- 1. Get duration of the service for the new booking
    SELECT duration INTO new_duration FROM public.services WHERE id = NEW.service_id;
    
    -- Explicitly cast to time to avoid "text + interval" errors
    new_start_time := NEW.time::time;
    new_end_time := (new_start_time + (new_duration || ' minutes')::interval)::time;
    
    -- 2. Check if barber is available on this day
    day_num := EXTRACT(DOW FROM NEW.date); -- 0 is Sunday, 6 is Saturday
    
    SELECT * INTO availability_record 
    FROM public.barber_availability 
    WHERE barber_id = NEW.barber_id AND day_of_week = day_num;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Barber does not work on this day of the week.';
    END IF;
    
    -- 3. Check if booking is within working hours
    IF new_start_time < availability_record.start_time THEN
        RAISE EXCEPTION 'Invalid time: The barber starts working at %. Your selected time (%) is too early.', 
            availability_record.start_time, new_start_time;
    END IF;

    IF new_end_time > availability_record.end_time THEN
        RAISE EXCEPTION 'Invalid duration: The selected service takes % minutes and would end at %, which is past the barber''s closing time (%).', 
            new_duration, new_end_time, availability_record.end_time;
    END IF;

    -- 4. Check for overlapping bookings for the same barber on the same date
    FOR existing_booking IN 
        SELECT 
            b.time::time as start_t, 
            (b.time::time + (s.duration || ' minutes')::interval)::time as end_t,
            s.name as service_name
        FROM public.bookings b
        JOIN public.services s ON b.service_id = s.id
        WHERE b.barber_id = NEW.barber_id 
          AND b.date = NEW.date
          AND b.id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    LOOP
        IF (new_start_time < existing_booking.end_t) AND (new_end_time > existing_booking.start_t) THEN
            RAISE EXCEPTION 'Time Conflict: This slot overlaps with an existing booking for "%" (from % to %). Please choose another time.', 
                existing_booking.service_name, existing_booking.start_t, existing_booking.end_t;
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS tr_check_booking_overlap ON public.bookings;
CREATE TRIGGER tr_check_booking_overlap
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.check_booking_overlap();

