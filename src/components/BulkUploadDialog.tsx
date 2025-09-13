import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Plus, Minus, Calendar, Linkedin } from 'lucide-react';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface Company {
  name: string;
  website: string;
  island: string;
  location: string;
  industry_id: string;
  company_size: string;
  engagement_level: string;
}

interface Member {
  name: string;
  email: string;
  job_title: string;
  island: string;
  linkedin_url: string;
  github_url: string;
  skills: string[];
  activity_level: string;
  company_id: string;
  industry_id: string;
}

interface Event {
  name: string;
  description: string;
  event_type: string;
  company_id: string | null;
  organizer_name: string;
  organizer_email: string;
  event_date: string;
  location: string;
  promotion_channels: string[];
  attendee_count: number;
}

interface LinkedInPost {
  company_id: string;
  member_id: string;
  post_url: string;
  post_content: string;
  post_date: string;
  post_type: string;
  engagement_metrics: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
}

export function BulkUploadDialog({ open, onOpenChange, onSuccess }: BulkUploadDialogProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('companies');
  const [industries, setIndustries] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const { toast } = useToast();

  const [companyData, setCompanyData] = useState<Company[]>([{
    name: '',
    website: '',
    island: '',
    location: '',
    industry_id: '',
    company_size: 'Medium',
    engagement_level: 'Medium'
  }]);

  const [memberData, setMemberData] = useState<Member[]>([{
    name: '',
    email: '',
    job_title: '',
    island: '',
    linkedin_url: '',
    github_url: '',
    skills: [],
    activity_level: 'Medium',
    company_id: '',
    industry_id: ''
  }]);

  const [eventData, setEventData] = useState<Event[]>([{
    name: '',
    description: '',
    event_type: 'company',
    company_id: null,
    organizer_name: '',
    organizer_email: '',
    event_date: '',
    location: '',
    promotion_channels: [],
    attendee_count: 0
  }]);

  const [linkedinData, setLinkedinData] = useState<LinkedInPost[]>([{
    company_id: '',
    member_id: '',
    post_url: '',
    post_content: '',
    post_date: '',
    post_type: 'company_update',
    engagement_metrics: {}
  }]);

  useEffect(() => {
    if (open) {
      fetchIndustries();
      fetchCompanies();
      fetchMembers();
    }
  }, [open]);

  const fetchIndustries = async () => {
    const { data } = await supabase.from('industries').select('id, name').order('name');
    setIndustries(data || []);
  };

  const fetchCompanies = async () => {
    const { data } = await supabase.from('companies').select('id, name').order('name');
    setCompanies(data || []);
  };

  const fetchMembers = async () => {
    const { data } = await supabase.from('members').select('id, name').order('name');
    setMembers(data || []);
  };

  const addCompanyRow = () => {
    setCompanyData([...companyData, {
      name: '',
      website: '',
      island: '',
      location: '',
      industry_id: '',
      company_size: 'Medium',
      engagement_level: 'Medium'
    }]);
  };

  const removeCompanyRow = (index: number) => {
    if (companyData.length > 1) {
      setCompanyData(companyData.filter((_, i) => i !== index));
    }
  };

  const updateCompanyData = (index: number, field: keyof Company, value: string) => {
    const updated = [...companyData];
    updated[index] = { ...updated[index], [field]: value };
    setCompanyData(updated);
  };

  const addMemberRow = () => {
    setMemberData([...memberData, {
      name: '',
      email: '',
      job_title: '',
      island: '',
      linkedin_url: '',
      github_url: '',
      skills: [],
      activity_level: 'Medium',
      company_id: '',
      industry_id: ''
    }]);
  };

  const removeMemberRow = (index: number) => {
    if (memberData.length > 1) {
      setMemberData(memberData.filter((_, i) => i !== index));
    }
  };

  const updateMemberData = (index: number, field: keyof Member, value: string | string[]) => {
    const updated = [...memberData];
    updated[index] = { ...updated[index], [field]: value };
    setMemberData(updated);
  };

  const addEventRow = () => {
    setEventData([...eventData, {
      name: '',
      description: '',
      event_type: 'htw',
      company_id: null,
      organizer_name: '',
      organizer_email: '',
      event_date: '',
      location: '',
      promotion_channels: [],
      attendee_count: 0
    }]);
  };

  const removeEventRow = (index: number) => {
    if (eventData.length > 1) {
      setEventData(eventData.filter((_, i) => i !== index));
    }
  };

  const updateEventData = (index: number, field: keyof Event, value: string | string[] | number | null) => {
    const updated = [...eventData];
    updated[index] = { ...updated[index], [field]: value };
    setEventData(updated);
  };

  const addLinkedInRow = () => {
    setLinkedinData([...linkedinData, {
      company_id: '',
      member_id: '',
      post_url: '',
      post_content: '',
      post_date: '',
      post_type: 'company_update',
      engagement_metrics: {}
    }]);
  };

  const removeLinkedInRow = (index: number) => {
    if (linkedinData.length > 1) {
      setLinkedinData(linkedinData.filter((_, i) => i !== index));
    }
  };

  const updateLinkedInData = (index: number, field: keyof LinkedInPost, value: any) => {
    const updated = [...linkedinData];
    updated[index] = { ...updated[index], [field]: value };
    setLinkedinData(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (activeTab === 'companies') {
        const validCompanies = companyData.filter(company => 
          company.name.trim() && company.industry_id
        );
        
        if (validCompanies.length === 0) {
          throw new Error('Please fill in at least one company with name and industry');
        }

        const { error } = await supabase
          .from('companies')
          .insert(validCompanies);
        
        if (error) throw error;

        toast({
          title: "Success!",
          description: `${validCompanies.length} companies uploaded successfully.`,
        });
      } else if (activeTab === 'members') {
        const validMembers = memberData.filter(member => 
          member.name.trim() && member.industry_id
        );
        
        if (validMembers.length === 0) {
          throw new Error('Please fill in at least one member with name and industry');
        }

        const { error } = await supabase
          .from('members')
          .insert(validMembers);
        
        if (error) throw error;

        toast({
          title: "Success!",
          description: `${validMembers.length} members uploaded successfully.`,
        });
      } else if (activeTab === 'events') {
        const validEvents = eventData.filter(event => 
          event.name.trim() && event.event_date
        );
        
        if (validEvents.length === 0) {
          throw new Error('Please fill in at least one event with name and date');
        }

        const { error } = await supabase
          .from('events')
          .insert(validEvents);
        
        if (error) throw error;

        toast({
          title: "Success!",
          description: `${validEvents.length} events uploaded successfully.`,
        });
      } else if (activeTab === 'posts') {
        const validPosts = linkedinData.filter(post => 
          post.post_url.trim() && post.post_date
        );
        
        if (validPosts.length === 0) {
          throw new Error('Please fill in at least one LinkedIn post with URL and date');
        }

        const { error } = await supabase
          .from('linkedin_posts')
          .insert(validPosts);
        
        if (error) throw error;

        toast({
          title: "Success!",
          description: `${validPosts.length} LinkedIn posts uploaded successfully.`,
        });
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error uploading data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-md border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Upload Data
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Upload companies, members, events, and LinkedIn posts to the HTW network database.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border border-gray-600">
            <TabsTrigger 
              value="companies" 
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Companies
            </TabsTrigger>
            <TabsTrigger 
              value="members"
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Members
            </TabsTrigger>
            <TabsTrigger 
              value="events"
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="posts"
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </TabsTrigger>
          </TabsList>

          {/* Companies Tab */}
          <TabsContent value="companies" className="overflow-y-auto max-h-[50vh] space-y-4">
            {companyData.map((company, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 space-y-4 border border-gray-600">
                <div className="flex justify-between items-center">
                  <Label className="text-white font-semibold">Company {index + 1}</Label>
                  {companyData.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCompanyRow(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Company Name *</Label>
                    <Input
                      value={company.name}
                      onChange={(e) => updateCompanyData(index, 'name', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Website</Label>
                    <Input
                      value={company.website}
                      onChange={(e) => updateCompanyData(index, 'website', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="https://company.com"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Industry *</Label>
                    <Select value={company.industry_id} onValueChange={(value) => updateCompanyData(index, 'industry_id', value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {industries.map((industry) => (
                          <SelectItem key={industry.id} value={industry.id} className="text-white hover:bg-gray-700">
                            {industry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Island</Label>
                    <Select value={company.island} onValueChange={(value) => updateCompanyData(index, 'island', value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select island" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="Oahu" className="text-white hover:bg-gray-700">Oahu</SelectItem>
                        <SelectItem value="Maui" className="text-white hover:bg-gray-700">Maui</SelectItem>
                        <SelectItem value="Big Island" className="text-white hover:bg-gray-700">Big Island</SelectItem>
                        <SelectItem value="Kauai" className="text-white hover:bg-gray-700">Kauai</SelectItem>
                        <SelectItem value="Molokai" className="text-white hover:bg-gray-700">Molokai</SelectItem>
                        <SelectItem value="Lanai" className="text-white hover:bg-gray-700">Lanai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              onClick={addCompanyRow}
              variant="outline"
              className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Company
            </Button>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="overflow-y-auto max-h-[50vh] space-y-4">
            {memberData.map((member, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 space-y-4 border border-gray-600">
                <div className="flex justify-between items-center">
                  <Label className="text-white font-semibold">Member {index + 1}</Label>
                  {memberData.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMemberRow(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Full Name *</Label>
                    <Input
                      value={member.name}
                      onChange={(e) => updateMemberData(index, 'name', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Email</Label>
                    <Input
                      value={member.email}
                      onChange={(e) => updateMemberData(index, 'email', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Job Title</Label>
                    <Input
                      value={member.job_title}
                      onChange={(e) => updateMemberData(index, 'job_title', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">LinkedIn URL</Label>
                    <Input
                      value={member.linkedin_url}
                      onChange={(e) => updateMemberData(index, 'linkedin_url', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="https://linkedin.com/in/johndoe"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              onClick={addMemberRow}
              variant="outline"
              className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Member
            </Button>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="overflow-y-auto max-h-[50vh] space-y-4">
            {eventData.map((event, index) => (
              <div key={`event-${index}-${event.name}`} className="bg-gray-800 rounded-lg p-4 space-y-4 border border-gray-600">
                <div className="flex justify-between items-center">
                  <Label className="text-white font-semibold">Event {index + 1}</Label>
                  {eventData.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEventRow(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Event Name *</Label>
                    <Input
                      value={event.name}
                      onChange={(e) => updateEventData(index, 'name', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="Tech Innovation Summit"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Event Date *</Label>
                    <Input
                      type="date"
                      value={event.event_date}
                      onChange={(e) => updateEventData(index, 'event_date', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Event Type</Label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`eventType-${index}`}
                          value="company"
                          checked={event.event_type === 'company'}
                          onChange={(e) => {
                            updateEventData(index, 'event_type', e.target.value);
                          }}
                          className="text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-300">Company Event</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`eventType-${index}`}
                          value="htw"
                          checked={event.event_type === 'htw'}
                          onChange={(e) => {
                            updateEventData(index, 'event_type', e.target.value);
                            if (e.target.value === 'htw') {
                              updateEventData(index, 'company_id', null);
                            }
                          }}
                          className="text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-300">HTW Event</span>
                      </label>
                    </div>
                  </div>
                  {event.event_type === 'company' && (
                    <div>
                      <Label className="text-gray-300">Company</Label>
                      <Select value={event.company_id || ''} onValueChange={(value) => updateEventData(index, 'company_id', value || null)}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {companies.map(company => (
                            <SelectItem key={company.id} value={company.id} className="text-white hover:bg-gray-700">
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div>
                    <Label className="text-gray-300">Organizer Name</Label>
                    <Input
                      value={event.organizer_name}
                      onChange={(e) => updateEventData(index, 'organizer_name', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Location</Label>
                    <Input
                      value={event.location}
                      onChange={(e) => updateEventData(index, 'location', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="Honolulu Convention Center"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Attendee Count</Label>
                    <Input
                      type="number"
                      value={event.attendee_count}
                      onChange={(e) => updateEventData(index, 'attendee_count', parseInt(e.target.value) || 0)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-300">Description</Label>
                  <Textarea
                    value={event.description}
                    onChange={(e) => updateEventData(index, 'description', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="Event description..."
                    rows={2}
                  />
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              onClick={addEventRow}
              variant="outline"
              className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Event
            </Button>
          </TabsContent>

          {/* LinkedIn Posts Tab */}
          <TabsContent value="posts" className="overflow-y-auto max-h-[50vh] space-y-4">
            {linkedinData.map((post, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 space-y-4 border border-gray-600">
                <div className="flex justify-between items-center">
                  <Label className="text-white font-semibold">LinkedIn Post {index + 1}</Label>
                  {linkedinData.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLinkedInRow(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Post URL *</Label>
                    <Input
                      value={post.post_url}
                      onChange={(e) => updateLinkedInData(index, 'post_url', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="https://linkedin.com/posts/..."
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Post Date *</Label>
                    <Input
                      type="date"
                      value={post.post_date}
                      onChange={(e) => updateLinkedInData(index, 'post_date', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Post Type</Label>
                    <Select value={post.post_type} onValueChange={(value) => updateLinkedInData(index, 'post_type', value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="company_update" className="text-white hover:bg-gray-700">Company Update</SelectItem>
                        <SelectItem value="job_posting" className="text-white hover:bg-gray-700">Job Posting</SelectItem>
                        <SelectItem value="event_promotion" className="text-white hover:bg-gray-700">Event Promotion</SelectItem>
                        <SelectItem value="thought_leadership" className="text-white hover:bg-gray-700">Thought Leadership</SelectItem>
                        <SelectItem value="achievement" className="text-white hover:bg-gray-700">Achievement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Company</Label>
                    <Select value={post.company_id} onValueChange={(value) => updateLinkedInData(index, 'company_id', value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id} className="text-white hover:bg-gray-700">
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-300">Post Content</Label>
                  <Textarea
                    value={post.post_content}
                    onChange={(e) => updateLinkedInData(index, 'post_content', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="Post content..."
                    rows={3}
                  />
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              onClick={addLinkedInRow}
              variant="outline"
              className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another LinkedIn Post
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? 'Uploading...' : `Upload ${activeTab === 'companies' ? 'Companies' : activeTab === 'members' ? 'Members' : activeTab === 'events' ? 'Events' : 'LinkedIn Posts'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}