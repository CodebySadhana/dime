-- Fix search_path for update_lesson_streak function
CREATE OR REPLACE FUNCTION public.update_lesson_streak(user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_streak integer;
  last_date date;
BEGIN
  SELECT streak_count, last_lesson_date INTO current_streak, last_date
  FROM public.profiles
  WHERE id = user_id;

  -- If first lesson ever or missed days, reset streak
  IF last_date IS NULL OR last_date < CURRENT_DATE - INTERVAL '1 day' THEN
    IF last_date = CURRENT_DATE - INTERVAL '1 day' THEN
      -- Consecutive day, increment streak
      UPDATE public.profiles
      SET streak_count = current_streak + 1,
          last_lesson_date = CURRENT_DATE
      WHERE id = user_id;
    ELSE
      -- Reset streak
      UPDATE public.profiles
      SET streak_count = 1,
          last_lesson_date = CURRENT_DATE
      WHERE id = user_id;
    END IF;
  END IF;
  -- If already completed today, don't update
END;
$function$;