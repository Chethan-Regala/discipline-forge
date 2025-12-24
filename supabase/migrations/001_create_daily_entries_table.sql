-- Create daily_entries table for Discipline OS
CREATE TABLE IF NOT EXISTS public.daily_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL UNIQUE,
  sleep_hours NUMERIC(4, 1) DEFAULT 0 NOT NULL,
  exercised BOOLEAN DEFAULT false NOT NULL,
  meditated BOOLEAN DEFAULT false NOT NULL,
  breakfast BOOLEAN DEFAULT false NOT NULL,
  lunch BOOLEAN DEFAULT false NOT NULL,
  dinner BOOLEAN DEFAULT false NOT NULL,
  problems_solved INTEGER DEFAULT 0 NOT NULL,
  study_hours NUMERIC(4, 1) DEFAULT 0 NOT NULL,
  university_attended BOOLEAN DEFAULT false NOT NULL,
  university_revised BOOLEAN DEFAULT false NOT NULL,
  morning_fresh_up BOOLEAN DEFAULT false NOT NULL,
  spiritual_practice BOOLEAN DEFAULT false NOT NULL,
  discipline_check BOOLEAN DEFAULT false NOT NULL,
  discipline_score INTEGER DEFAULT 0 NOT NULL,
  reflection_text TEXT DEFAULT '' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_entries_date ON public.daily_entries(date);

-- Create index on user_id if you plan to support multiple users
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_id ON public.daily_entries(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
-- For single-user app, allow all operations
CREATE POLICY "Allow all operations for daily_entries" ON public.daily_entries
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_daily_entries_updated_at
  BEFORE UPDATE ON public.daily_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

