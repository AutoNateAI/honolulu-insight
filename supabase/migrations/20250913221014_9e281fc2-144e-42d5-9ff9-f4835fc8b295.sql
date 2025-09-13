-- Create industries table
CREATE TABLE public.industries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  company_count INTEGER DEFAULT 0,
  growth_rate DECIMAL(5,2) DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#1E88E5',
  icon TEXT DEFAULT '🏢',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry_id UUID REFERENCES public.industries(id) ON DELETE SET NULL,
  website TEXT,
  location TEXT,
  island TEXT CHECK (island IN ('Oahu', 'Maui', 'Big Island', 'Kauai', 'Molokai')),
  member_count INTEGER DEFAULT 0,
  company_size TEXT CHECK (company_size IN ('Startup', 'Small', 'Medium', 'Large', 'Enterprise')),
  engagement_level TEXT CHECK (engagement_level IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create members table
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  job_title TEXT,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  industry_id UUID REFERENCES public.industries(id) ON DELETE SET NULL,
  island TEXT CHECK (island IN ('Oahu', 'Maui', 'Big Island', 'Kauai', 'Molokai')),
  skills TEXT[],
  linkedin_url TEXT,
  github_url TEXT,
  bio TEXT,
  events_attended INTEGER DEFAULT 0,
  member_since DATE DEFAULT CURRENT_DATE,
  last_event_date DATE,
  activity_level TEXT CHECK (activity_level IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create island_data table
CREATE TABLE public.island_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  member_count INTEGER DEFAULT 0,
  company_count INTEGER DEFAULT 0,
  population INTEGER,
  tech_percentage DECIMAL(5,2) DEFAULT 0,
  coordinates JSONB, -- {lat: number, lng: number}
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_profiles table for admin users
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT CHECK (role IN ('admin', 'moderator', 'viewer')) DEFAULT 'viewer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.island_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated users (dashboard is internal)
CREATE POLICY "Authenticated users can view industries" ON public.industries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view companies" ON public.companies FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view members" ON public.members FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view island data" ON public.island_data FOR SELECT USING (auth.role() = 'authenticated');

-- Admin policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Admin users can manage all data
CREATE POLICY "Admin users can manage industries" ON public.industries FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin users can manage companies" ON public.companies FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin users can manage members" ON public.members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin users can manage island data" ON public.island_data FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_industries_updated_at BEFORE UPDATE ON public.industries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_island_data_updated_at BEFORE UPDATE ON public.island_data FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email,
    'admin' -- Default to admin for HTW internal dashboard
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for automatic user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO public.industries (name, description, member_count, company_count, growth_rate, color, icon) VALUES
('Tourism & Hospitality', 'Hotels, restaurants, travel services', 612, 89, 8.2, '#FF8A65', '🏨'),
('Healthcare', 'Medical services, biotechnology, health tech', 445, 67, 12.1, '#4CAF50', '🏥'),
('Technology', 'Software, hardware, digital services', 398, 52, 15.8, '#1E88E5', '💻'),
('Finance', 'Banking, insurance, fintech', 289, 34, 6.7, '#9C27B0', '💰'),
('Education', 'Schools, universities, edtech', 234, 28, 4.3, '#FF9800', '🎓'),
('Government', 'State, county, federal agencies', 187, 15, 2.1, '#795548', '🏛️'),
('Real Estate', 'Property development, management', 156, 23, 9.4, '#607D8B', '🏠'),
('Retail', 'Stores, e-commerce, consumer goods', 134, 45, 3.8, '#E91E63', '🛍️'),
('Agriculture', 'Farming, sustainability, food tech', 98, 19, 7.2, '#8BC34A', '🌾'),
('Transportation', 'Logistics, shipping, mobility', 87, 16, 5.5, '#03A9F4', '🚛'),
('Energy', 'Renewable energy, utilities', 76, 12, 11.3, '#FFC107', '⚡'),
('Manufacturing', 'Production, industrial services', 65, 14, 4.9, '#673AB7', '🏭'),
('Media & Entertainment', 'Content creation, broadcasting', 54, 18, 6.8, '#F44336', '🎬'),
('Construction', 'Building, infrastructure', 43, 11, 8.1, '#FF5722', '🔨'),
('Non-Profit', 'Charitable organizations, foundations', 32, 9, 3.2, '#2196F3', '❤️');

INSERT INTO public.island_data (name, member_count, company_count, population, tech_percentage, coordinates) VALUES
('Oahu', 1847, 234, 1000000, 18.5, '{"lat": 21.4389, "lng": -158.0001}'),
('Maui', 456, 67, 165000, 12.3, '{"lat": 20.7984, "lng": -156.3319}'),
('Big Island', 398, 45, 200000, 8.7, '{"lat": 19.5429, "lng": -155.6659}'),
('Kauai', 123, 18, 73000, 6.2, '{"lat": 22.0964, "lng": -159.5261}'),
('Molokai', 23, 4, 7500, 4.1, '{"lat": 21.1444, "lng": -157.0226}');