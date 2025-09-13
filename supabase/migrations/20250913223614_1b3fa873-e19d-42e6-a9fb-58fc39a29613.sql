-- Insert sample companies with industry relationships
INSERT INTO public.companies (name, industry_id, website, location, island, member_count, company_size, engagement_level) VALUES
-- Technology companies
((SELECT name FROM public.industries WHERE name = 'Technology' LIMIT 1), (SELECT id FROM public.industries WHERE name = 'Technology'), 'https://example-tech.com', 'Honolulu', 'Oahu', 25, 'Medium', 'High'),
('Blue Startups', (SELECT id FROM public.industries WHERE name = 'Technology'), 'https://bluestartups.com', 'Honolulu', 'Oahu', 15, 'Small', 'High'),
('HTDC', (SELECT id FROM public.industries WHERE name = 'Technology'), 'https://htdc.org', 'Honolulu', 'Oahu', 45, 'Medium', 'High'),
('Paubox', (SELECT id FROM public.industries WHERE name = 'Technology'), 'https://paubox.com', 'San Francisco', 'Oahu', 35, 'Medium', 'Medium'),

-- Tourism & Hospitality companies  
('Hawaiian Airlines', (SELECT id FROM public.industries WHERE name = 'Tourism & Hospitality'), 'https://hawaiianair.com', 'Honolulu', 'Oahu', 89, 'Enterprise', 'High'),
('Hilton Hawaiian Village', (SELECT id FROM public.industries WHERE name = 'Tourism & Hospitality'), 'https://hilton.com', 'Waikiki', 'Oahu', 67, 'Large', 'Medium'),
('Outrigger Resorts', (SELECT id FROM public.industries WHERE name = 'Tourism & Hospitality'), 'https://outrigger.com', 'Honolulu', 'Oahu', 45, 'Large', 'Medium'),
('Maui Ocean Center', (SELECT id FROM public.industries WHERE name = 'Tourism & Hospitality'), 'https://mauioceancenter.com', 'Kihei', 'Maui', 23, 'Medium', 'Low'),

-- Healthcare companies
('Hawaii Pacific Health', (SELECT id FROM public.industries WHERE name = 'Healthcare'), 'https://hawaiipacifichealth.org', 'Honolulu', 'Oahu', 76, 'Large', 'Medium'),
('Kaiser Permanente Hawaii', (SELECT id FROM public.industries WHERE name = 'Healthcare'), 'https://kp.org', 'Honolulu', 'Oahu', 54, 'Large', 'Medium'),
('Queens Medical Center', (SELECT id FROM public.industries WHERE name = 'Healthcare'), 'https://queens.org', 'Honolulu', 'Oahu', 43, 'Large', 'High'),
('Maui Memorial Medical Center', (SELECT id FROM public.industries WHERE name = 'Healthcare'), 'https://mauihealth.org', 'Wailuku', 'Maui', 28, 'Medium', 'Low'),

-- Finance companies
('First Hawaiian Bank', (SELECT id FROM public.industries WHERE name = 'Finance'), 'https://fhb.com', 'Honolulu', 'Oahu', 45, 'Large', 'Medium'),
('Bank of Hawaii', (SELECT id FROM public.industries WHERE name = 'Finance'), 'https://boh.com', 'Honolulu', 'Oahu', 38, 'Large', 'Medium'),
('Central Pacific Bank', (SELECT id FROM public.industries WHERE name = 'Finance'), 'https://cpb.bank', 'Honolulu', 'Oahu', 32, 'Medium', 'Low');

-- Insert sample members with company and industry relationships
INSERT INTO public.members (name, email, job_title, company_id, industry_id, island, skills, linkedin_url, github_url, bio, events_attended, member_since, activity_level) VALUES
-- Technology members
('John Smith', 'john.smith@tech.com', 'Senior Software Engineer', (SELECT id FROM public.companies WHERE name = 'Blue Startups'), (SELECT id FROM public.industries WHERE name = 'Technology'), 'Oahu', ARRAY['React', 'Python', 'AWS', 'GraphQL'], 'https://linkedin.com/in/johnsmith', 'https://github.com/johnsmith', 'Full-stack developer passionate about Hawaiian tech scene', 15, '2023-01-15', 'High'),

('Lisa Chen', 'lisa.chen@htdc.org', 'Product Manager', (SELECT id FROM public.companies WHERE name = 'HTDC'), (SELECT id FROM public.industries WHERE name = 'Technology'), 'Oahu', ARRAY['Product Management', 'Analytics', 'UX Design'], 'https://linkedin.com/in/lisachen', NULL, 'Leading innovation in Hawaii tech ecosystem', 12, '2022-08-20', 'High'),

('Mike Johnson', 'mike@paubox.com', 'DevOps Engineer', (SELECT id FROM public.companies WHERE name = 'Paubox'), (SELECT id FROM public.industries WHERE name = 'Technology'), 'Oahu', ARRAY['Docker', 'Kubernetes', 'Terraform', 'Python'], 'https://linkedin.com/in/mikejohnson', 'https://github.com/mikej', 'Cloud infrastructure specialist', 8, '2023-03-10', 'Medium'),

-- Tourism members
('Sarah Williams', 'sarah.w@hawaiianair.com', 'Digital Marketing Manager', (SELECT id FROM public.companies WHERE name = 'Hawaiian Airlines'), (SELECT id FROM public.industries WHERE name = 'Tourism & Hospitality'), 'Oahu', ARRAY['Digital Marketing', 'Social Media', 'Analytics'], 'https://linkedin.com/in/sarahwilliams', NULL, 'Marketing Hawaiian culture worldwide', 20, '2022-05-12', 'High'),

('David Rodriguez', 'david.r@hilton.com', 'Hotel Operations Manager', (SELECT id FROM public.companies WHERE name = 'Hilton Hawaiian Village'), (SELECT id FROM public.industries WHERE name = 'Tourism & Hospitality'), 'Oahu', ARRAY['Operations', 'Customer Service', 'Team Leadership'], 'https://linkedin.com/in/davidrodriguez', NULL, 'Passionate about Hawaiian hospitality', 10, '2023-02-28', 'Medium'),

-- Healthcare members  
('Dr. Maria Lopez', 'maria.lopez@hph.org', 'Chief Technology Officer', (SELECT id FROM public.companies WHERE name = 'Hawaii Pacific Health'), (SELECT id FROM public.industries WHERE name = 'Healthcare'), 'Oahu', ARRAY['Healthcare IT', 'Electronic Health Records', 'Data Analytics'], 'https://linkedin.com/in/marialopez', NULL, 'Transforming healthcare through technology', 18, '2021-11-05', 'High'),

('James Kim', 'james.kim@kp.org', 'Software Developer', (SELECT id FROM public.companies WHERE name = 'Kaiser Permanente Hawaii'), (SELECT id FROM public.industries WHERE name = 'Healthcare'), 'Oahu', ARRAY['Java', 'Spring Boot', 'Healthcare APIs'], 'https://linkedin.com/in/jameskim', 'https://github.com/jamesk', 'Building better healthcare software', 14, '2022-09-18', 'High'),

-- Finance members
('Jennifer Chang', 'jen.chang@fhb.com', 'Fintech Innovation Lead', (SELECT id FROM public.companies WHERE name = 'First Hawaiian Bank'), (SELECT id FROM public.industries WHERE name = 'Finance'), 'Oahu', ARRAY['Fintech', 'Blockchain', 'Mobile Banking'], 'https://linkedin.com/in/jenniferchang', NULL, 'Innovating banking for Hawaii', 16, '2022-12-01', 'High'),

('Robert Tanaka', 'robert.t@boh.com', 'Data Scientist', (SELECT id FROM public.companies WHERE name = 'Bank of Hawaii'), (SELECT id FROM public.industries WHERE name = 'Finance'), 'Oahu', ARRAY['Python', 'Machine Learning', 'SQL', 'Tableau'], 'https://linkedin.com/in/roberttanaka', 'https://github.com/rtanaka', 'Using data to improve financial services', 11, '2023-04-22', 'Medium');