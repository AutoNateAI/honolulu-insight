import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, MapPin, Briefcase, Calendar, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Member {
  id: string;
  name: string;
  email: string;
  job_title: string;
  island: string;
  skills: string[];
  linkedin_url: string;
  github_url: string;
  bio: string;
  events_attended: number;
  member_since: string;
  last_event_date: string;
  activity_level: string;
  companies: {
    name: string;
    island: string;
  } | null;
  industries: {
    name: string;
    icon: string;
  } | null;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIsland, setSelectedIsland] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<string>('all');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          companies:company_id (name, island),
          industries:industry_id (name, icon)
        `)
        .order('events_attended', { ascending: false })
        .limit(50);

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      member.companies?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIsland = selectedIsland === 'all' || member.island === selectedIsland;
    const matchesActivity = selectedActivity === 'all' || member.activity_level === selectedActivity;
    
    return matchesSearch && matchesIsland && matchesActivity;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getActivityColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Members</h1>
          <p className="text-muted-foreground">
            Browse HTW's network of {members.length} tech professionals
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members, skills, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedIsland} onValueChange={setSelectedIsland}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by island" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Islands</SelectItem>
                <SelectItem value="Oahu">Oahu</SelectItem>
                <SelectItem value="Maui">Maui</SelectItem>
                <SelectItem value="Big Island">Big Island</SelectItem>
                <SelectItem value="Kauai">Kauai</SelectItem>
                <SelectItem value="Molokai">Molokai</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activity Levels</SelectItem>
                <SelectItem value="High">High Activity</SelectItem>
                <SelectItem value="Medium">Medium Activity</SelectItem>
                <SelectItem value="Low">Low Activity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredMembers.length} of {members.length} members
        </p>
        <Button variant="outline" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Export List
        </Button>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 9 }).map((_, i) => (
            <Card key={i} className="glass-card border-white/20">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredMembers.map((member) => (
            <Card 
              key={member.id} 
              className="glass-card border-white/20 hover:scale-105 transition-all duration-200 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 border-2 border-white/20">
                    <AvatarFallback className="bg-gradient-to-br from-ocean-primary to-sunset-primary text-white font-semibold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate group-hover:text-ocean-primary transition-colors">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="text-sm truncate">
                      {member.job_title}
                    </CardDescription>
                    {member.companies && (
                      <p className="text-xs text-muted-foreground truncate">
                        {member.companies.name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {member.industries && (
                      <span className="text-lg">{member.industries.icon}</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{member.island}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{member.events_attended} events</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3 text-muted-foreground" />
                    <span>Since {new Date(member.member_since).getFullYear()}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getActivityColor(member.activity_level)}`}
                  >
                    {member.activity_level} Activity
                  </Badge>
                </div>

                {member.skills && member.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {member.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{member.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  {member.linkedin_url && (
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      LinkedIn
                    </Button>
                  )}
                  {member.github_url && (
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      GitHub
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredMembers.length === 0 && !loading && (
        <Card className="glass-card border-white/20">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No members found</p>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find members.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}