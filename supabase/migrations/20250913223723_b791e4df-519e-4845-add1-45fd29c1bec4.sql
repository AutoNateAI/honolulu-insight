-- Create function to update industry member and company counts
CREATE OR REPLACE FUNCTION public.update_industry_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update member count for the affected industry
  UPDATE public.industries 
  SET member_count = (
    SELECT COUNT(*) 
    FROM public.members 
    WHERE industry_id = COALESCE(NEW.industry_id, OLD.industry_id)
  )
  WHERE id = COALESCE(NEW.industry_id, OLD.industry_id);

  -- Update company count for the affected industry  
  UPDATE public.industries
  SET company_count = (
    SELECT COUNT(*)
    FROM public.companies
    WHERE industry_id = COALESCE(NEW.industry_id, OLD.industry_id)
  )
  WHERE id = COALESCE(NEW.industry_id, OLD.industry_id);

  -- If industry_id changed, also update the old industry
  IF TG_OP = 'UPDATE' AND OLD.industry_id IS DISTINCT FROM NEW.industry_id THEN
    UPDATE public.industries 
    SET member_count = (
      SELECT COUNT(*) 
      FROM public.members 
      WHERE industry_id = OLD.industry_id
    )
    WHERE id = OLD.industry_id;

    UPDATE public.industries
    SET company_count = (
      SELECT COUNT(*)
      FROM public.companies
      WHERE industry_id = OLD.industry_id
    )
    WHERE id = OLD.industry_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for members table
CREATE TRIGGER update_industry_counts_on_member_change
  AFTER INSERT OR UPDATE OR DELETE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.update_industry_counts();

-- Create triggers for companies table
CREATE TRIGGER update_industry_counts_on_company_change
  AFTER INSERT OR UPDATE OR DELETE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_industry_counts();

-- Update all industry counts with current data
UPDATE public.industries SET 
  member_count = (
    SELECT COUNT(*) 
    FROM public.members 
    WHERE members.industry_id = industries.id
  ),
  company_count = (
    SELECT COUNT(*) 
    FROM public.companies 
    WHERE companies.industry_id = industries.id
  );