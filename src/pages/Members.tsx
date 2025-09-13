import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  MapPin, 
  Globe, 
  Calendar,
  TrendingUp,
  Search,
  Download,
  Upload,
  Linkedin,
  ExternalLink,
  Edit,
  Github,
  Briefcase,
  Building2
} from 'lucide-react';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { EditMemberDialog } from '@/components/EditMemberDialog';

interface Industry {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface Company {
  id: string;
  name: string;
  island?: string;
}

interface Member {
  id: string;
  name: string;
  email?: string;
  job_title?: string;
  island?: string;
  skills?: string[];
  linkedin_url?: string;
  github_url?: string;
  bio?: string;
  events_attended: number;
  member_since: string;
  last_event_date?: string;
  activity_level: string;
  company_id?: string;
  industry_id?: string;
  companies?: Company;
  industries?: Industry;
}

interface LinkedInPost {
  id: string;
  post_url: string;
  post_content?: string;
  post_date: string;
  post_type?: string;
  engagement_metrics?: any;
}

const Members = () => {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberLinkedinPosts, setMemberLinkedinPosts] = useState<LinkedInPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedIndustry !== 'all') {
      fetchCompaniesByIndustry(selectedIndustry);
    } else {
      setCompanies([]);
      setSelectedCompany('all');
    }
  }, [selectedIndustry]);

  const fetchData = async () => {
    try {
      // Fetch industries
      const { data: industriesData, error: industriesError } = await supabase
        .from('industries')
        .select('*')
        .order('name');

      if (industriesError) throw industriesError;
      setIndustries(industriesData || []);

      // Fetch members
      await fetchMembers();
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          companies:company_id (id, name, island),
          industries:industry_id (id, name, color, icon)
        `)
        .order('events_attended', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch members',
        variant: 'destructive',
      });
    }
  };

  const fetchCompaniesByIndustry = async (industryId: string) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('industry_id', industryId)
        .order('name');

      if (error) throw error;
      setCompanies(data || []);
      setSelectedCompany('all');
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchMemberLinkedInPosts = async (memberId: string) => {
    setPostsLoading(true);
    try {
      const { data, error } = await supabase
        .from('linkedin_posts')
        .select('*')
        .eq('member_id', memberId)
        .order('post_date', { ascending: false });

      if (error) throw error;
      setMemberLinkedinPosts(data || []);
    } catch (error) {
      console.error('Error fetching LinkedIn posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch LinkedIn posts',
        variant: 'destructive',
      });
    } finally {
      setPostsLoading(false);
    }
  };

  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
    fetchMemberLinkedInPosts(member.id);
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      member.companies?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = selectedIndustry === 'all' || member.industry_id === selectedIndustry;
    const matchesCompany = selectedCompany === 'all' || member.company_id === selectedCompany;
    
    return matchesSearch && matchesIndustry && matchesCompany;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getActivityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Members</h1>
          <p className="text-white/70">
            Browse HTW's network of {members.length} tech professionals
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            onClick={() => setBulkUploadOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            size="sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button 
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <Input
            placeholder="Search members, skills, companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        
        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map((industry) => (
              <SelectItem key={industry.id} value={industry.id}>
                {industry.icon} {industry.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCompany} onValueChange={setSelectedCompany} disabled={selectedIndustry === 'all'}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Filter by company" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-sm text-white/70 flex items-center">
          Showing {filteredMembers.length} of {members.length} members
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Members ({filteredMembers.length})</h2>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {filteredMembers.map((member) => (
              <Card 
                key={member.id} 
                className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors cursor-pointer ${
                  selectedMember?.id === member.id ? 'ring-2 ring-white/50' : ''
                }`}
                onClick={() => handleMemberSelect(member)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white/20">
                      <AvatarFallback className="bg-gradient-to-br from-ocean-primary to-sunset-primary text-white font-semibold text-sm">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold text-white line-clamp-1">
                        {member.name}
                      </CardTitle>
                      {member.job_title && (
                        <p className="text-sm text-white/70 line-clamp-1">{member.job_title}</p>
                      )}
                      {member.companies && (
                        <p className="text-xs text-white/60 line-clamp-1">{member.companies.name}</p>
                      )}
                    </div>
                    {member.industries && (
                      <span className="text-lg">{member.industries.icon}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {member.island || 'Unknown'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {member.events_attended} events
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={`flex items-center gap-1 ${getActivityColor(member.activity_level)}`}>
                      <TrendingUp className="w-3 h-3" />
                      {member.activity_level} activity
                    </span>
                    <span className="text-white/60 text-xs">
                      Since {new Date(member.member_since).getFullYear()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredMembers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No members found</h3>
                <p className="text-white/70 text-sm">
                  {searchTerm || selectedIndustry !== 'all' || selectedCompany !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'No members available'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Member Details */}
        <div className="lg:col-span-2">
          {selectedMember ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-white/20">
                      <AvatarFallback className="bg-gradient-to-br from-ocean-primary to-sunset-primary text-white font-semibold text-lg">
                        {getInitials(selectedMember.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white mb-2">
                        {selectedMember.name}
                      </CardTitle>
                      {selectedMember.job_title && (
                        <p className="text-lg text-white/80 mb-1">{selectedMember.job_title}</p>
                      )}
                      {selectedMember.companies && (
                        <p className="text-white/70">{selectedMember.companies.name}</p>
                      )}
                      {selectedMember.industries && (
                        <Badge 
                          className="mt-2"
                          style={{ 
                            backgroundColor: `${selectedMember.industries.color}20`,
                            color: selectedMember.industries.color,
                            borderColor: `${selectedMember.industries.color}50`
                          }}
                        >
                          {selectedMember.industries.icon} {selectedMember.industries.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                      onClick={() => setEditMemberOpen(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    {selectedMember.linkedin_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                        onClick={() => window.open(selectedMember.linkedin_url, '_blank')}
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </Button>
                    )}
                  </div>
                </div>

                {/* Member Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{selectedMember.events_attended}</div>
                    <div className="text-sm text-white/70">Events Attended</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-lg font-semibold text-white">{selectedMember.activity_level}</div>
                    <div className="text-sm text-white/70">Activity Level</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-lg font-semibold text-white">{new Date(selectedMember.member_since).getFullYear()}</div>
                    <div className="text-sm text-white/70">Member Since</div>
                  </div>
                  {selectedMember.island && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-lg font-semibold text-white">{selectedMember.island}</div>
                      <div className="text-sm text-white/70">Location</div>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10">
                    <TabsTrigger value="info" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                      Member Info
                    </TabsTrigger>
                    <TabsTrigger value="linkedin" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                      LinkedIn Posts ({memberLinkedinPosts.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-4 mt-4">
                    {selectedMember.bio && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Bio</h4>
                        <p className="text-white/80 text-sm">{selectedMember.bio}</p>
                      </div>
                    )}
                    
                    {selectedMember.skills && selectedMember.skills.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMember.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedMember.email && (
                        <div>
                          <h4 className="text-white font-semibold mb-1">Email</h4>
                          <p className="text-white/80 text-sm">{selectedMember.email}</p>
                        </div>
                      )}
                      
                      {selectedMember.last_event_date && (
                        <div>
                          <h4 className="text-white font-semibold mb-1">Last Event</h4>
                          <p className="text-white/80 text-sm">{new Date(selectedMember.last_event_date).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      {selectedMember.linkedin_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                          onClick={() => window.open(selectedMember.linkedin_url, '_blank')}
                        >
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn Profile
                        </Button>
                      )}
                      {selectedMember.github_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                          onClick={() => window.open(selectedMember.github_url, '_blank')}
                        >
                          <Github className="w-4 h-4 mr-2" />
                          GitHub Profile
                        </Button>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="linkedin" className="space-y-4 mt-4">
                    {postsLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-24 w-full" />
                        ))}
                      </div>
                    ) : memberLinkedinPosts.length > 0 ? (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {memberLinkedinPosts.map((post) => (
                          <Card key={post.id} className="bg-white/5 border-white/10">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-white/60" />
                                  <span className="text-sm text-white/70">
                                    {new Date(post.post_date).toLocaleDateString()}
                                  </span>
                                  {post.post_type && (
                                    <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                                      {post.post_type}
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 text-white/70 hover:text-white"
                                  onClick={() => window.open(post.post_url, '_blank')}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </div>
                              {post.post_content && (
                                <p className="text-white/80 text-sm mb-3 line-clamp-3">
                                  {post.post_content}
                                </p>
                              )}
                              {post.engagement_metrics && (
                                <div className="flex items-center gap-4 text-xs text-white/60">
                                  <span>👍 {post.engagement_metrics.likes || 0}</span>
                                  <span>💬 {post.engagement_metrics.comments || 0}</span>
                                  <span>🔄 {post.engagement_metrics.shares || 0}</span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Linkedin className="w-12 h-12 text-white/30 mx-auto mb-4" />
                        <p className="text-white/70">No LinkedIn posts found for this member</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Member</h3>
                <p className="text-white/70">
                  Choose a member from the list to view their detailed information and LinkedIn posts.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <BulkUploadDialog 
        open={bulkUploadOpen} 
        onOpenChange={setBulkUploadOpen}
        onSuccess={fetchMembers}
      />
      
      <EditMemberDialog
        member={selectedMember}
        open={editMemberOpen}
        onOpenChange={setEditMemberOpen}
        onSuccess={fetchMembers}
      />
    </div>
  );
};

export default Members;