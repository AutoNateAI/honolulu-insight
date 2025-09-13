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
  company_id: string;
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
    company_id: '',
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
      event_type: 'company',
      company_id: '',
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

  const updateEventData = (index: number, field: keyof Event, value: string | string[] | number) => {
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-ocean-primary/20 via-tropical-light/20 to-sunset-coral/20 backdrop-blur-md border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Upload Data
          </DialogTitle>
          <DialogDescription className="text-white/90">
            Upload companies, members, events, and LinkedIn posts to the HTW network database.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/20 border border-white/30">
            <TabsTrigger 
              value="companies" 
              className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              Companies
            </TabsTrigger>
            <TabsTrigger 
              value="members"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              Members
            </TabsTrigger>
            <TabsTrigger 
              value="events"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="posts"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </TabsTrigger>
          </TabsList>

          {/* Companies Tab */}
          <TabsContent value="companies" className="overflow-y-auto max-h-[50vh] space-y-4">
            {companyData.map((company, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 space-y-4 border border-white/20">
                <div className="flex justify-between items-center">
                  <Label className="text-white font-semibold">Company {index + 1}</Label>
                  {companyData.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCompanyRow(index)}
                      className="text-red-300 hover:text-red-100 hover:bg-red-500/20"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/90">Company Name *</Label>
                    <Input
                      value={company.name}
                      onChange={(e) => updateCompanyData(index, 'name', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Website</Label>
                    <Input
                      value={company.website}
                      onChange={(e) => updateCompanyData(index, 'website', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="https://company.com"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Industry *</Label>
                    <Select value={company.industry_id} onValueChange={(value) => updateCompanyData(index, 'industry_id', value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry.id} value={industry.id}>
                            {industry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/90">Island</Label>
                    <Select value={company.island} onValueChange={(value) => updateCompanyData(index, 'island', value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Select island" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oahu">Oahu</SelectItem>
                        <SelectItem value="Maui">Maui</SelectItem>
                        <SelectItem value="Big Island">Big Island</SelectItem>
                        <SelectItem value="Kauai">Kauai</SelectItem>
                        <SelectItem value="Molokai">Molokai</SelectItem>
                        <SelectItem value="Lanai">Lanai</SelectItem>
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
              className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Company
            </Button>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="overflow-y-auto max-h-[50vh] space-y-4">
            {memberData.map((member, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 space-y-4 border border-white/20">
                <div className="flex justify-between items-center">
                  <Label className="text-white font-semibold">Member {index + 1}</Label>
                  {memberData.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMemberRow(index)}
                      className="text-red-300 hover:text-red-100 hover:bg-red-500/20"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/90">Full Name *</Label>
                    <Input
                      value={member.name}
                      onChange={(e) => updateMemberData(index, 'name', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Email</Label>
                    <Input
                      value={member.email}
                      onChange={(e) => updateMemberData(index, 'email', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Job Title</Label>
                    <Input
                      value={member.job_title}
                      onChange={(e) => updateMemberData(index, 'job_title', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">LinkedIn URL</Label>
                    <Input
                      value={member.linkedin_url}
                      onChange={(e) => updateMemberData(index, 'linkedin_url', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
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
              className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Member
            </Button>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="overflow-y-auto max-h-[50vh] space-y-4">
            {eventData.map((event, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 space-y-4 border border-white/20">
                <div className="flex justify-between items-center">
                  <Label className="text-white font-semibold">Event {index + 1}</Label>
                  {eventData.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEventRow(index)}
                      className="text-red-300 hover:text-red-100 hover:bg-red-500/20"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/90">Event Name *</Label>
                    <Input
                      value={event.name}
                      onChange={(e) => updateEventData(index, 'name', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="Tech Innovation Summit"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Event Date *</Label>
                    <Input
                      type="date"
                      value={event.event_date}
                      onChange={(e) => updateEventData(index, 'event_date', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Event Type</Label>
                    <Select value={event.event_type} onValueChange={(value) => updateEventData(index, 'event_type', value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company">Company Event</SelectItem>
                        <SelectItem value="htw">HTW Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/90">Organizer Name</Label>
                    <Input
                      value={event.organizer_name}
                      onChange={(e) => updateEventData(index, 'organizer_name', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Location</Label>
                    <Input
                      value={event.location}
                      onChange={(e) => updateEventData(index, 'location', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="Honolulu Convention Center"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Attendee Count</Label>
                    <Input
                      type="number"
                      value={event.attendee_count}
                      onChange={(e) => updateEventData(index, 'attendee_count', parseInt(e.target.value) || 0)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-white/90">Description</Label>
                  <Textarea
                    value={event.description}
                    onChange={(e) => updateEventData(index, 'description', e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
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
              className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Event
            </Button>
          </TabsContent>

          {/* LinkedIn Posts Tab */}
          <TabsContent value="posts" className="overflow-y-auto max-h-[50vh] space-y-4">
            {linkedinData.map((post, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 space-y-4 border border-white/20">
                <div className="flex justify-between items-center">
                  <Label className="text-white font-semibold">LinkedIn Post {index + 1}</Label>
                  {linkedinData.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLinkedInRow(index)}
                      className="text-red-300 hover:text-red-100 hover:bg-red-500/20"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/90">Post URL *</Label>
                    <Input
                      value={post.post_url}
                      onChange={(e) => updateLinkedInData(index, 'post_url', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="https://linkedin.com/posts/..."
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Post Date *</Label>
                    <Input
                      type="date"
                      value={post.post_date}
                      onChange={(e) => updateLinkedInData(index, 'post_date', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Post Type</Label>
                    <Select value={post.post_type} onValueChange={(value) => updateLinkedInData(index, 'post_type', value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company_update">Company Update</SelectItem>
                        <SelectItem value="job_posting">Job Posting</SelectItem>
                        <SelectItem value="event_promotion">Event Promotion</SelectItem>
                        <SelectItem value="thought_leadership">Thought Leadership</SelectItem>
                        <SelectItem value="achievement">Achievement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/90">Company</Label>
                    <Select value={post.company_id} onValueChange={(value) => updateLinkedInData(index, 'company_id', value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-white/90">Post Content</Label>
                  <Textarea
                    value={post.post_content}
                    onChange={(e) => updateLinkedInData(index, 'post_content', e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
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
              className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
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
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-white text-black hover:bg-white/90"
          >
            {loading ? 'Uploading...' : `Upload ${activeTab === 'companies' ? 'Companies' : activeTab === 'members' ? 'Members' : activeTab === 'events' ? 'Events' : 'LinkedIn Posts'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}