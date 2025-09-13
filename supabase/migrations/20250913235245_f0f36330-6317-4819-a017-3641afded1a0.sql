-- Add coordinates column to companies table if it doesn't exist
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS coordinates JSONB;

-- Create a function to update company coordinates
CREATE OR REPLACE FUNCTION public.update_company_coordinates()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    company_record RECORD;
BEGIN
    -- Update companies that don't have coordinates
    FOR company_record IN 
        SELECT id, name, location, island 
        FROM public.companies 
        WHERE coordinates IS NULL AND location IS NOT NULL
    LOOP
        -- For now, we'll set approximate coordinates based on island
        -- These can be updated with real geocoding later
        CASE 
            WHEN company_record.island = 'Oahu' THEN
                UPDATE public.companies 
                SET coordinates = jsonb_build_object('lat', 21.4389, 'lng', -158.0001)
                WHERE id = company_record.id;
            WHEN company_record.island = 'Maui' THEN
                UPDATE public.companies 
                SET coordinates = jsonb_build_object('lat', 20.7984, 'lng', -156.3319)
                WHERE id = company_record.id;
            WHEN company_record.island = 'Big Island' THEN
                UPDATE public.companies 
                SET coordinates = jsonb_build_object('lat', 19.5429, 'lng', -155.6659)
                WHERE id = company_record.id;
            WHEN company_record.island = 'Kauai' THEN
                UPDATE public.companies 
                SET coordinates = jsonb_build_object('lat', 22.0964, 'lng', -159.5261)
                WHERE id = company_record.id;
            WHEN company_record.island = 'Molokai' THEN
                UPDATE public.companies 
                SET coordinates = jsonb_build_object('lat', 21.1444, 'lng', -157.0226)
                WHERE id = company_record.id;
            ELSE
                -- Default to Oahu coordinates
                UPDATE public.companies 
                SET coordinates = jsonb_build_object('lat', 21.4389, 'lng', -158.0001)
                WHERE id = company_record.id;
        END CASE;
    END LOOP;
END;
$$;

-- Execute the function to update existing companies
SELECT public.update_company_coordinates();

-- Create an index on coordinates for better performance
CREATE INDEX IF NOT EXISTS idx_companies_coordinates ON public.companies USING GIN(coordinates);