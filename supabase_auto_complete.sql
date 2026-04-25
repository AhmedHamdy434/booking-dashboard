-- ==========================================
-- 1. Function to Auto-Complete Expired Bookings
-- ==========================================
-- This function finds all 'confirmed' bookings where the current time 
-- is past their scheduled date + time + service duration.
CREATE OR REPLACE FUNCTION public.auto_update_completed_bookings()
RETURNS void AS $$
BEGIN
  UPDATE public.bookings
  SET status = 'completed'
  WHERE status = 'confirmed'
    -- Calculate end time: date + time + duration in minutes
    AND (date + time::time + (
      SELECT duration FROM public.services WHERE services.id = bookings.service_id
    ) * interval '1 minute') < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==========================================
-- OPTION A: Using pg_cron (Recommended if available)
-- ==========================================
-- This will run the function automatically every 5 minutes in the background.

-- Enable pg_cron extension (Run this as a superuser/postgres role)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the job
SELECT cron.schedule(
  'auto-complete-bookings', -- Job name
  '*/5 * * * *',            -- Schedule (every 5 minutes)
  'SELECT public.auto_update_completed_bookings();'
);

-- Note: To unschedule later if needed:
-- SELECT cron.unschedule('auto-complete-bookings');


-- ==========================================
-- OPTION B: Calling via RPC from Frontend
-- ==========================================
-- If you don't want to use pg_cron, you can call the function manually 
-- from your React code whenever the Dashboard loads:
-- 
-- await supabase.rpc('auto_update_completed_bookings');
