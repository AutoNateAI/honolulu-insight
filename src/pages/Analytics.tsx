import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building, 
  Calendar,
  Download,
  Target,
  PieChart,
  LineChart,
  Activity,
  Briefcase
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

interface AnalyticsData {
  totalMembers: number;
  totalCompanies: number;
  totalIndustries: number;
  totalEvents: number;
  memberGrowth: number;
  companyGrowth: number;
  eventGrowth: number;
  avgEventsPerMember: number;
  topIndustries: Array<{
    name: string;
    member_count: number;
    company_count: number;
    growth_rate: number;
    color: string;
  }>;
  islandDistribution: Array<{
    name: string;
    member_count: number;
    company_count: number;
    percentage: number;
  }>;
  activityLevels: Array<{
    level: string;
    count: number;
    percentage: number;
  }>;
  eventTypes: Array<{
    type: string;
    count: number;
    avg_attendance: number;
  }>;
  membershipTrends: Array<{
    month: string;
    new_members: number;
    total_members: number;
  }>;
  topSkills: Array<{
    skill: string;
    count: number;
  }>;
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('quarterly');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedTimeframe]);

  const fetchAnalytics = async () => {
    try {
      // Calculate timeframe boundaries
      const now = new Date();
      const timeframes = {
        monthly: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
        quarterly: new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
        yearly: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      };
      
      const timeframeBoundary = timeframes[selectedTimeframe as keyof typeof timeframes];

      // Fetch all required data in parallel
      const [
        industriesRes,
        islandsRes,
        membersRes,
        companiesRes,
        eventsRes,
        eventAttendeesRes
      ] = await Promise.all([
        supabase.from('industries').select('name, member_count, company_count, growth_rate, color'),
        supabase.from('island_data').select('name, member_count, company_count'),
        supabase.from('members').select('activity_level, member_since, created_at, skills, events_attended'),
        supabase.from('companies').select('created_at, island'),
        supabase.from('events').select('id, event_type, event_date, attendee_count, created_at'),
        supabase.from('event_attendees').select('event_id, created_at')
      ]);

      if (industriesRes.error || islandsRes.error || membersRes.error || companiesRes.error || eventsRes.error) {
        throw industriesRes.error || islandsRes.error || membersRes.error || companiesRes.error || eventsRes.error;
      }

      const industries = industriesRes.data || [];
      const islands = islandsRes.data || [];
      const members = membersRes.data || [];
      const companies = companiesRes.data || [];
      const events = eventsRes.data || [];
      const eventAttendees = eventAttendeesRes.data || [];

      // Calculate growth metrics based on actual data
      const membersInTimeframe = members.filter(m => 
        new Date(m.member_since || m.created_at) >= timeframeBoundary
      ).length;
      const companiesInTimeframe = companies.filter(c => 
        new Date(c.created_at) >= timeframeBoundary
      ).length;
      const eventsInTimeframe = events.filter(e => 
        new Date(e.created_at) >= timeframeBoundary
      ).length;

      const memberGrowth = ((membersInTimeframe / Math.max(members.length - membersInTimeframe, 1)) * 100);
      const companyGrowth = ((companiesInTimeframe / Math.max(companies.length - companiesInTimeframe, 1)) * 100);
      const eventGrowth = ((eventsInTimeframe / Math.max(events.length - eventsInTimeframe, 1)) * 100);

      // Activity level distribution
      const activityCounts = members.reduce((acc, member) => {
        const level = member.activity_level || 'Medium';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const activityLevels = Object.entries(activityCounts).map(([level, count]) => ({
        level,
        count,
        percentage: (count / members.length) * 100
      }));

      // Event type analysis
      const eventTypeCounts = events.reduce((acc, event) => {
        const type = event.event_type || 'company';
        if (!acc[type]) {
          acc[type] = { count: 0, total_attendance: 0 };
        }
        acc[type].count += 1;
        acc[type].total_attendance += event.attendee_count || 0;
        return acc;
      }, {} as Record<string, { count: number; total_attendance: number }>);

      const eventTypes = Object.entries(eventTypeCounts).map(([type, data]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count: data.count,
        avg_attendance: Math.round(data.total_attendance / data.count) || 0
      }));

      // Membership trends (last 12 months)
      const membershipTrends = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        const newMembersInMonth = members.filter(m => {
          const memberDate = new Date(m.member_since || m.created_at);
          return memberDate.getFullYear() === date.getFullYear() && 
                 memberDate.getMonth() === date.getMonth();
        }).length;

        const totalMembersUpToMonth = members.filter(m => {
          const memberDate = new Date(m.member_since || m.created_at);
          return memberDate <= date;
        }).length;

        membershipTrends.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          new_members: newMembersInMonth,
          total_members: totalMembersUpToMonth
        });
      }

      // Top skills analysis
      const skillCounts = members.reduce((acc, member) => {
        if (member.skills && Array.isArray(member.skills)) {
          member.skills.forEach((skill: string) => {
            acc[skill] = (acc[skill] || 0) + 1;
          });
        }
        return acc;
      }, {} as Record<string, number>);

      const topSkills = Object.entries(skillCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count }));

      // Enhanced island distribution with company data
      const islandTotal = islands.reduce((sum, island) => sum + island.member_count, 0);
      const islandDistribution = islands.map(island => ({
        ...island,
        percentage: (island.member_count / islandTotal) * 100
      })).sort((a, b) => b.member_count - a.member_count);

      // Calculate average events per member
      const totalEventsAttended = members.reduce((sum, member) => sum + (member.events_attended || 0), 0);
      const avgEventsPerMember = totalEventsAttended / members.length || 0;

      setAnalytics({
        totalMembers: members.length,
        totalCompanies: companies.length,
        totalIndustries: industries.length,
        totalEvents: events.length,
        memberGrowth,
        companyGrowth,
        eventGrowth,
        avgEventsPerMember,
        topIndustries: industries
          .sort((a, b) => b.member_count - a.member_count)
          .slice(0, 6),
        islandDistribution,
        activityLevels,
        eventTypes,
        membershipTrends,
        topSkills
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 10) return 'text-green-500';
    if (growth > 5) return 'text-yellow-500';
    if (growth > 0) return 'text-orange-500';
    return 'text-red-500';
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? TrendingUp : TrendingDown;
  };

  const renderGrowthIcon = (growth: number, className: string) => {
    const IconComponent = getGrowthIcon(growth);
    return <IconComponent className={className} />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into HTW network performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <TabsList className="bg-white/10 backdrop-blur-sm border border-white/20">
              <TabsTrigger value="monthly" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">Quarterly</TabsTrigger>
              <TabsTrigger value="yearly" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {analytics && (
        <>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Total Members</p>
                <p className="text-2xl font-bold text-white">{analytics.totalMembers.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {renderGrowthIcon(analytics.memberGrowth, `h-3 w-3 ${getGrowthColor(analytics.memberGrowth)}`)}
                  <span className={`text-xs ${getGrowthColor(analytics.memberGrowth)}`}>
                    {analytics.memberGrowth > 0 ? '+' : ''}{analytics.memberGrowth.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-ocean-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Companies</p>
                <p className="text-2xl font-bold text-white">{analytics.totalCompanies.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {renderGrowthIcon(analytics.companyGrowth, `h-3 w-3 ${getGrowthColor(analytics.companyGrowth)}`)}
                  <span className={`text-xs ${getGrowthColor(analytics.companyGrowth)}`}>
                    {analytics.companyGrowth > 0 ? '+' : ''}{analytics.companyGrowth.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Building className="h-8 w-8 text-sunset-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Events</p>
                <p className="text-2xl font-bold text-white">{analytics.totalEvents}</p>
                <div className="flex items-center gap-1 mt-1">
                  {renderGrowthIcon(analytics.eventGrowth, `h-3 w-3 ${getGrowthColor(analytics.eventGrowth)}`)}
                  <span className={`text-xs ${getGrowthColor(analytics.eventGrowth)}`}>
                    {analytics.eventGrowth > 0 ? '+' : ''}{analytics.eventGrowth.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-tropical-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Industries</p>
                <p className="text-2xl font-bold text-white">{analytics.totalIndustries}</p>
                <p className="text-xs text-white/60 mt-1">Active sectors</p>
              </div>
              <Target className="h-8 w-8 text-plumeria-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Avg Events</p>
                <p className="text-2xl font-bold text-white">{analytics.avgEventsPerMember.toFixed(1)}</p>
                <p className="text-xs text-white/60 mt-1">Per member</p>
              </div>
              <Activity className="h-8 w-8 text-volcanic-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

          {/* Charts and Analytics */}
          <Tabs defaultValue="industries" className="space-y-6">
            <TabsList className="bg-white/10 backdrop-blur-sm border border-white/20">
              <TabsTrigger value="industries" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <PieChart className="h-4 w-4" />
                Industries
              </TabsTrigger>
              <TabsTrigger value="engagement" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Activity className="h-4 w-4" />
                Engagement
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <LineChart className="h-4 w-4" />
                Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="industries" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Industry Distribution */}
                <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Industry Distribution
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Member distribution across top industries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topIndustries.map((industry, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{industry.name}</span>
                            <div className="text-right">
                              <div className="text-sm text-white/70">
                                {industry.member_count.toLocaleString()} members
                              </div>
                              <div className="text-xs text-white/50">
                                {industry.company_count} companies
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-500"
                              style={{ 
                                backgroundColor: industry.color,
                                width: `${(industry.member_count / analytics.totalMembers) * 100}%` 
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/70">
                              {((industry.member_count / analytics.totalMembers) * 100).toFixed(1)}% of network
                            </span>
                            <Badge 
                              variant={industry.growth_rate > 10 ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {industry.growth_rate > 0 ? '+' : ''}{industry.growth_rate}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Growth Rates */}
                <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Growth Analysis
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Industry growth rates and trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topIndustries
                        .sort((a, b) => b.growth_rate - a.growth_rate)
                        .map((industry, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <div>
                            <p className="font-medium text-white">{industry.name}</p>
                            <p className="text-sm text-white/70">
                              {industry.member_count.toLocaleString()} members • {industry.company_count} companies
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {renderGrowthIcon(industry.growth_rate, `h-4 w-4 ${getGrowthColor(industry.growth_rate)}`)}
                            <span className={`font-semibold ${getGrowthColor(industry.growth_rate)}`}>
                              {industry.growth_rate > 0 ? '+' : ''}{industry.growth_rate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Level Distribution */}
                <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Activity Levels
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Member engagement distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.activityLevels
                        .sort((a, b) => b.count - a.count)
                        .map((level, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white capitalize">{level.level}</span>
                            <span className="text-sm text-white/70">{level.count} members</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                level.level === 'High' ? 'bg-green-500' :
                                level.level === 'Medium' ? 'bg-yellow-500' : 'bg-orange-500'
                              }`}
                              style={{ width: `${level.percentage}%` }}
                            />
                          </div>
                          <div className="text-xs text-white/70">
                            {level.percentage.toFixed(1)}% of members
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Skills */}
                <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Popular Skills
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Most common skills in the network
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.topSkills.slice(0, 8).map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded bg-white/5">
                          <span className="text-sm font-medium text-white">{skill.skill}</span>
                          <Badge variant="secondary" className="text-xs">
                            {skill.count} members
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>


            <TabsContent value="events" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Event Types Analysis */}
                <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Event Types
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Event distribution and average attendance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.eventTypes.map((eventType, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <div>
                            <p className="font-medium text-white">{eventType.type}</p>
                            <p className="text-sm text-white/70">
                              {eventType.count} events hosted
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-tropical-primary">
                              {eventType.avg_attendance}
                            </p>
                            <p className="text-xs text-white/70">avg attendance</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Event Performance Chart */}
                <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Event Performance
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Event types by total count and attendance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.eventTypes}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis 
                            dataKey="type" 
                            stroke="rgba(255,255,255,0.7)"
                            fontSize={12}
                          />
                          <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(0,0,0,0.8)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                          />
                          <Bar dataKey="count" fill="#10b981" name="Event Count" />
                          <Bar dataKey="avg_attendance" fill="#f59e0b" name="Avg Attendance" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <div className="space-y-6">
                {/* Membership Growth Chart */}
                <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5" />
                      Membership Growth Trends
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Member acquisition over the last 12 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.membershipTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis 
                            dataKey="month" 
                            stroke="rgba(255,255,255,0.7)"
                            fontSize={12}
                          />
                          <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(0,0,0,0.8)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                          />
                          <Bar dataKey="new_members" fill="#22d3ee" name="New Members" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Growth Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-2">👥</div>
                      <p className="text-2xl font-bold text-white">
                        {analytics.membershipTrends.slice(-3).reduce((sum, month) => sum + month.new_members, 0)}
                      </p>
                      <p className="text-sm text-white/70">New members (3 months)</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-2">📈</div>
                      <p className="text-2xl font-bold text-white">
                        {analytics.memberGrowth.toFixed(1)}%
                      </p>
                      <p className="text-sm text-white/70">Growth rate ({selectedTimeframe})</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-2">🎯</div>
                      <p className="text-2xl font-bold text-white">
                        {Math.round(analytics.membershipTrends.slice(-3).reduce((sum, month) => sum + month.new_members, 0) / 3)}
                      </p>
                      <p className="text-sm text-white/70">Avg monthly growth</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}