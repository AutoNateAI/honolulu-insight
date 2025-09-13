// HTW Dashboard Mock Data

export interface Industry {
  id: string;
  name: string;
  memberCount: number;
  companyCount: number;
  growthRate: number;
  color: string;
  icon: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  memberCount: number;
  size: 'Small' | 'Mid-size' | 'Large' | 'Enterprise';
  location: string;
  website?: string;
  description?: string;
  engagementLevel: 'Low' | 'Medium' | 'High';
  eventsAttended: number;
}

export interface Member {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  location: string;
  skills: string[];
  eventsAttended: number;
  memberSince: string;
  connections: number;
  interests: string[];
  linkedin?: string;
  github?: string;
}

export interface IslandData {
  name: string;
  memberCount: number;
  companyCount: number;
  topIndustries: { name: string; count: number }[];
  coordinates: [number, number];
}

// Industries Data
export const industries: Industry[] = [
  {
    id: 'tourism',
    name: 'Tourism & Hospitality',
    memberCount: 612,
    companyCount: 89,
    growthRate: 8.2,
    color: '#FF8A65',
    icon: '🏨'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    memberCount: 445,
    companyCount: 67,
    growthRate: 12.5,
    color: '#4CAF50',
    icon: '🏥'
  },
  {
    id: 'technology',
    name: 'Technology',
    memberCount: 398,
    companyCount: 52,
    growthRate: 15.8,
    color: '#1E88E5',
    icon: '💻'
  },
  {
    id: 'finance',
    name: 'Finance & Banking',
    memberCount: 289,
    companyCount: 34,
    growthRate: 6.7,
    color: '#E91E63',
    icon: '🏦'
  },
  {
    id: 'government',
    name: 'Government',
    memberCount: 245,
    companyCount: 28,
    growthRate: 3.2,
    color: '#37474F',
    icon: '🏛️'
  },
  {
    id: 'education',
    name: 'Education',
    memberCount: 198,
    companyCount: 23,
    growthRate: 9.1,
    color: '#FF7043',
    icon: '🎓'
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    memberCount: 156,
    companyCount: 45,
    growthRate: 11.3,
    color: '#2E7D32',
    icon: '🛍️'
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    memberCount: 134,
    companyCount: 67,
    growthRate: 4.8,
    color: '#C2185B',
    icon: '🏠'
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    memberCount: 98,
    companyCount: 34,
    growthRate: 7.2,
    color: '#4CAF50',
    icon: '🌱'
  },
  {
    id: 'transportation',
    name: 'Transportation',
    memberCount: 87,
    companyCount: 19,
    growthRate: 5.6,
    color: '#0277BD',
    icon: '✈️'
  }
];

// Companies Data
export const companies: Company[] = [
  {
    id: 'hawaiian-airlines',
    name: 'Hawaiian Airlines',
    industry: 'transportation',
    memberCount: 89,
    size: 'Enterprise',
    location: 'Honolulu, Oahu',
    website: 'hawaiianair.com',
    description: 'Hawaii\'s largest airline connecting the islands and the world',
    engagementLevel: 'High',
    eventsAttended: 23
  },
  {
    id: 'hilton-hawaiian-village',
    name: 'Hilton Hawaiian Village',
    industry: 'tourism',
    memberCount: 67,
    size: 'Enterprise',
    location: 'Honolulu, Oahu',
    website: 'hiltonhawaiianvillage.com',
    description: 'Premier beachfront resort and conference center',
    engagementLevel: 'High',
    eventsAttended: 18
  },
  {
    id: 'hawaii-pacific-health',
    name: 'Hawaii Pacific Health',
    industry: 'healthcare',
    memberCount: 76,
    size: 'Enterprise',
    location: 'Honolulu, Oahu',
    website: 'hawaiipacifichealth.org',
    description: 'Hawaii\'s largest healthcare provider',
    engagementLevel: 'Medium',
    eventsAttended: 15
  },
  {
    id: 'htdc',
    name: 'Hawaii Technology Development Corporation',
    industry: 'technology',
    memberCount: 45,
    size: 'Mid-size',
    location: 'Honolulu, Oahu',
    website: 'htdc.org',
    description: 'Supporting Hawaii\'s innovation ecosystem',
    engagementLevel: 'High',
    eventsAttended: 32
  },
  {
    id: 'paubox',
    name: 'Paubox',
    industry: 'technology',
    memberCount: 28,
    size: 'Mid-size',
    location: 'San Francisco / Honolulu',
    website: 'paubox.com',
    description: 'HIPAA compliant email and forms platform',
    engagementLevel: 'High',
    eventsAttended: 19
  }
];

// Sample Members Data
export const members: Member[] = [
  {
    id: 'john-smith',
    name: 'John Smith',
    title: 'Senior Software Engineer',
    company: 'Hawaiian Airlines',
    industry: 'transportation',
    location: 'Honolulu, Oahu',
    skills: ['React', 'Python', 'AWS', 'GraphQL', 'TypeScript'],
    eventsAttended: 15,
    memberSince: 'January 2023',
    connections: 34,
    interests: ['Aviation Tech', 'Machine Learning', 'Cloud Architecture'],
    linkedin: 'linkedin.com/in/johnsmith',
    github: 'github.com/johnsmith'
  },
  {
    id: 'maria-lopez',
    name: 'Maria Lopez',
    title: 'Product Manager',
    company: 'Hilton Hawaiian Village',
    industry: 'tourism',
    location: 'Honolulu, Oahu',
    skills: ['Product Strategy', 'Data Analysis', 'UX Design', 'Agile'],
    eventsAttended: 8,
    memberSince: 'March 2023',
    connections: 28,
    interests: ['Hospitality Tech', 'Customer Experience', 'AI in Tourism']
  },
  {
    id: 'lisa-chen',
    name: 'Lisa Chen',
    title: 'Data Scientist',
    company: 'Paubox',
    industry: 'technology',
    location: 'San Francisco',
    skills: ['Machine Learning', 'Python', 'TensorFlow', 'SQL', 'Statistics'],
    eventsAttended: 12,
    memberSince: 'June 2022',
    connections: 42,
    interests: ['Healthcare AI', 'Privacy Tech', 'Predictive Analytics']
  }
];

// Island Data
export const islandData: IslandData[] = [
  {
    name: 'Oahu',
    memberCount: 1847,
    companyCount: 234,
    topIndustries: [
      { name: 'Tourism', count: 487 },
      { name: 'Technology', count: 398 },
      { name: 'Healthcare', count: 345 },
      { name: 'Government', count: 289 }
    ],
    coordinates: [-157.8583, 21.4389]
  },
  {
    name: 'Maui',
    memberCount: 456,
    companyCount: 67,
    topIndustries: [
      { name: 'Tourism', count: 198 },
      { name: 'Agriculture', count: 89 },
      { name: 'Healthcare', count: 67 },
      { name: 'Real Estate', count: 45 }
    ],
    coordinates: [-156.3319, 20.7984]
  },
  {
    name: 'Big Island',
    memberCount: 398,
    companyCount: 45,
    topIndustries: [
      { name: 'Tourism', count: 134 },
      { name: 'Agriculture', count: 98 },
      { name: 'Technology', count: 76 },
      { name: 'Healthcare', count: 54 }
    ],
    coordinates: [-155.5828, 19.8968]
  },
  {
    name: 'Kauai',
    memberCount: 123,
    companyCount: 18,
    topIndustries: [
      { name: 'Tourism', count: 67 },
      { name: 'Agriculture', count: 34 },
      { name: 'Real Estate', count: 12 },
      { name: 'Healthcare', count: 10 }
    ],
    coordinates: [-159.5261, 22.0964]
  },
  {
    name: 'Molokai',
    memberCount: 23,
    companyCount: 4,
    topIndustries: [
      { name: 'Agriculture', count: 12 },
      { name: 'Tourism', count: 8 },
      { name: 'Healthcare', count: 3 }
    ],
    coordinates: [-157.0248, 21.1444]
  }
];

// Dashboard Stats
export const dashboardStats = {
  totalMembers: industries.reduce((sum, industry) => sum + industry.memberCount, 0),
  totalCompanies: industries.reduce((sum, industry) => sum + industry.companyCount, 0),
  totalIslands: islandData.length,
  averageGrowthRate: industries.reduce((sum, industry) => sum + industry.growthRate, 0) / industries.length,
  topGrowthIndustry: industries.reduce((prev, current) => 
    prev.growthRate > current.growthRate ? prev : current
  ),
  monthlyGrowth: [
    { month: 'Jan', members: 2245 },
    { month: 'Feb', members: 2398 },
    { month: 'Mar', members: 2567 },
    { month: 'Apr', members: 2634 },
    { month: 'May', members: 2723 },
    { month: 'Jun', members: 2847 }
  ]
};