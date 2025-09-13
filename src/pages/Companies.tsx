import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Building, 
  Users, 
  MapPin, 
  Globe, 
  Calendar,
  TrendingUp,
  Search,
  Download,
  Upload,
  Linkedin,
  ExternalLink
} from 'lucide-react';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';

interface Company {
  id: string;
  name: string;
  website?: string;
  island?: string;
  location?: string;
  industry_id?: string;
  member_count: number;
  engagement_level: string;
  company_size?: string;
  created_at: string;
  industries?: {
    name: string;
    color: string;
  };
}

interface Member {
  id: string;
  name: string;
  job_title?: string;
  email?: string;
  linkedin_url?: string;
  activity_level: string;
  events_attended: number;
}

interface LinkedInPost {
  id: string;
  post_url: string;
  post_content?: string;
  post_date: string;
  post_type?: string;
  engagement_metrics?: any;
}

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyMembers, setCompanyMembers] = useState<Member[]>([]);
  const [linkedinPosts, setLinkedinPosts] = useState<LinkedInPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          industries (
            name,
            color
          )
        `)
        .order('member_count', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch companies',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyMembers = async (companyId: string) => {
    setMembersLoading(true);
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('company_id', companyId)
        .order('events_attended', { ascending: false });

      if (error) throw error;
      setCompanyMembers(data || []);
    } catch (error) {
      console.error('Error fetching company members:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch company members',
        variant: 'destructive',
      });
    } finally {
      setMembersLoading(false);
    }
  };

  const fetchLinkedInPosts = async (companyId: string) => {
    setPostsLoading(true);
    try {
      const { data, error } = await supabase
        .from('linkedin_posts')
        .select('*')
        .eq('company_id', companyId)
        .order('post_date', { ascending: false });

      if (error) throw error;
      setLinkedinPosts(data || []);
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

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    fetchCompanyMembers(company.id);
    fetchLinkedInPosts(company.id);
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industries?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.island?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEngagementColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Companies</h1>
          <p className="text-white/70">
            Dive deep into company networks and engagement opportunities
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

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
        <Input
          placeholder="Search companies, industries, locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Companies List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Companies ({filteredCompanies.length})</h2>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredCompanies.map((company) => (
              <Card 
                key={company.id} 
                className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors cursor-pointer ${
                  selectedCompany?.id === company.id ? 'ring-2 ring-white/50' : ''
                }`}
                onClick={() => handleCompanySelect(company)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-white line-clamp-1">
                      {company.name}
                    </CardTitle>
                    {company.website && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-white/70 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(company.website, '_blank');
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {company.industries && (
                    <div className="flex items-center gap-2">
                      <Badge 
                        className="text-xs"
                        style={{ 
                          backgroundColor: `${company.industries.color}20`,
                          color: company.industries.color,
                          borderColor: `${company.industries.color}50`
                        }}
                      >
                        {company.industries.name}
                      </Badge>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {company.member_count} members
                    </div>
                    <Badge className={`text-xs ${getEngagementColor(company.engagement_level)}`}>
                      {company.engagement_level}
                    </Badge>
                  </div>
                  
                  {company.island && (
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <MapPin className="w-4 h-4" />
                      {company.island}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {filteredCompanies.length === 0 && (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No companies found</h3>
                <p className="text-white/70 text-sm">
                  {searchTerm ? 'Try adjusting your search term' : 'No companies available'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Company Details */}
        <div className="lg:col-span-2">
          {selectedCompany ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-white mb-2">
                      {selectedCompany.name}
                    </CardTitle>
                    {selectedCompany.industries && (
                      <Badge 
                        className="mb-4"
                        style={{ 
                          backgroundColor: `${selectedCompany.industries.color}20`,
                          color: selectedCompany.industries.color,
                          borderColor: `${selectedCompany.industries.color}50`
                        }}
                      >
                        {selectedCompany.industries.name}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {selectedCompany.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                        onClick={() => window.open(selectedCompany.website, '_blank')}
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                      </Button>
                    )}
                  </div>
                </div>

                {/* Company Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{selectedCompany.member_count}</div>
                    <div className="text-sm text-white/70">HTW Members</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-lg font-semibold text-white">{selectedCompany.engagement_level}</div>
                    <div className="text-sm text-white/70">Engagement</div>
                  </div>
                  {selectedCompany.company_size && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-lg font-semibold text-white">{selectedCompany.company_size}</div>
                      <div className="text-sm text-white/70">Company Size</div>
                    </div>
                  )}
                  {selectedCompany.island && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-lg font-semibold text-white">{selectedCompany.island}</div>
                      <div className="text-sm text-white/70">Location</div>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="members" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10">
                    <TabsTrigger value="members" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                      Members ({companyMembers.length})
                    </TabsTrigger>
                    <TabsTrigger value="linkedin" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                      LinkedIn Posts ({linkedinPosts.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="members" className="space-y-4 mt-4">
                    {membersLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : companyMembers.length > 0 ? (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {companyMembers.map((member) => (
                          <Card key={member.id} className="bg-white/5 border-white/10">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-white">{member.name}</h4>
                                  {member.job_title && (
                                    <p className="text-sm text-white/70">{member.job_title}</p>
                                  )}
                                  <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                                    <span className={`flex items-center gap-1 ${getActivityColor(member.activity_level)}`}>
                                      <TrendingUp className="w-3 h-3" />
                                      {member.activity_level} activity
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {member.events_attended} events
                                    </span>
                                  </div>
                                </div>
                                
                                {member.linkedin_url && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-2 text-white/70 hover:text-white"
                                    onClick={() => window.open(member.linkedin_url, '_blank')}
                                  >
                                    <Linkedin className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-white/30 mx-auto mb-4" />
                        <p className="text-white/70">No members found for this company</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="linkedin" className="space-y-4 mt-4">
                    {postsLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-24 w-full" />
                        ))}
                      </div>
                    ) : linkedinPosts.length > 0 ? (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {linkedinPosts.map((post) => (
                          <Card key={post.id} className="bg-white/5 border-white/10">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {post.post_type && (
                                    <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                                      {post.post_type}
                                    </Badge>
                                  )}
                                  <span className="text-sm text-white/70">
                                    {new Date(post.post_date).toLocaleDateString()}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-2 text-white/70 hover:text-white"
                                  onClick={() => window.open(post.post_url, '_blank')}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </div>
                              {post.post_content && (
                                <p className="text-white/80 text-sm line-clamp-2">{post.post_content}</p>
                              )}
                              {post.engagement_metrics && (
                                <div className="flex gap-4 mt-2 text-xs text-white/60">
                                  {post.engagement_metrics.likes && (
                                    <span>👍 {post.engagement_metrics.likes}</span>
                                  )}
                                  {post.engagement_metrics.comments && (
                                    <span>💬 {post.engagement_metrics.comments}</span>
                                  )}
                                  {post.engagement_metrics.shares && (
                                    <span>🔄 {post.engagement_metrics.shares}</span>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Linkedin className="w-12 h-12 text-white/30 mx-auto mb-4" />
                        <p className="text-white/70">No LinkedIn posts found for this company</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Building className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Select a Company</h3>
                  <p className="text-white/70">
                    Choose a company from the list to view detailed information, members, and LinkedIn activity
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <BulkUploadDialog 
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        onSuccess={fetchCompanies}
      />
    </div>
  );
};

export default Companies;