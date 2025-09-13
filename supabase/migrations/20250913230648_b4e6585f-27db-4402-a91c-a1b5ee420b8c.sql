-- Add employee_count column to companies table to track actual company size
ALTER TABLE public.companies 
ADD COLUMN employee_count integer DEFAULT 0;