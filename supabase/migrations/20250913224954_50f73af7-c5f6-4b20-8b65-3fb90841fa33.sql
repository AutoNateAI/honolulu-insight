-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'company', -- 'company' or 'htw'
  company_id UUID REFERENCES public.companies(id),
  organizer_name TEXT,
  organizer_email TEXT,
  event_date DATE NOT NULL,
  location TEXT,
  promotion_channels TEXT[] DEFAULT '{}', -- linkedin, website, etc
  attendee_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies for events
CREATE POLICY "Admin users can manage events" 
ON public.events 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_profiles.user_id = auth.uid() 
  AND user_profiles.role = 'admin'
));

CREATE POLICY "Authenticated users can view events" 
ON public.events 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create event attendees table
CREATE TABLE public.event_attendees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.members(id),
  attendee_name TEXT,
  attendee_email TEXT,
  attendee_company TEXT,
  attendee_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

-- Create policies for event attendees
CREATE POLICY "Admin users can manage event attendees" 
ON public.event_attendees 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_profiles.user_id = auth.uid() 
  AND user_profiles.role = 'admin'
));

CREATE POLICY "Authenticated users can view event attendees" 
ON public.event_attendees 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create linkedin posts table
CREATE TABLE public.linkedin_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id),
  member_id UUID REFERENCES public.members(id),
  post_url TEXT NOT NULL,
  post_content TEXT,
  post_date DATE NOT NULL,
  engagement_metrics JSONB, -- likes, comments, shares
  post_type TEXT, -- 'company_update', 'job_posting', 'event_promotion', etc
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.linkedin_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for linkedin posts
CREATE POLICY "Admin users can manage linkedin posts" 
ON public.linkedin_posts 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_profiles.user_id = auth.uid() 
  AND user_profiles.role = 'admin'
));

CREATE POLICY "Authenticated users can view linkedin posts" 
ON public.linkedin_posts 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create triggers for updated_at columns
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_linkedin_posts_updated_at
  BEFORE UPDATE ON public.linkedin_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();