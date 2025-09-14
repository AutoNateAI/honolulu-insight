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
  LineChart
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AnalyticsData {
  totalMembers: number;
  totalCompanies: number;
  totalIndustries: number;
  memberGrowth: number;
  companyGrowth: number;
  topIndustries: Array<{
    name: string;
    member_count: number;
    growth_rate: number;
    color: string;
  }>;
  islandDistribution: Array<{
    name: string;
    member_count: number;
    percentage: number;
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
      // Fetch all required data
      const [industriesRes, islandsRes] = await Promise.all([
        supabase.from('industries').select('name, member_count, company_count, growth_rate, color'),
        supabase.from('island_data').select('name, member_count')
      ]);

      if (industriesRes.error || islandsRes.error) {
        throw industriesRes.error || islandsRes.error;
      }

      const industries = industriesRes.data || [];
      const islands = islandsRes.data || [];

      const totalMembers = industries.reduce((sum, ind) => sum + ind.member_count, 0);
      const totalCompanies = industries.reduce((sum, ind) => sum + ind.company_count, 0);
      const avgGrowth = industries.reduce((sum, ind) => sum + ind.growth_rate, 0) / industries.length;

      const islandTotal = islands.reduce((sum, island) => sum + island.member_count, 0);
      const islandDistribution = islands.map(island => ({
        ...island,
        percentage: (island.member_count / islandTotal) * 100
      }));

      setAnalytics({
        totalMembers,
        totalCompanies,
        totalIndustries: industries.length,
        memberGrowth: avgGrowth,
        companyGrowth: avgGrowth * 0.8, // Estimated company growth
        topIndustries: industries
          .sort((a, b) => b.member_count - a.member_count)
          .slice(0, 5),
        islandDistribution: islandDistribution.sort((a, b) => b.member_count - a.member_count)
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-white/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{analytics.totalMembers.toLocaleString()}</p>
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

        <Card className="glass-card border-white/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Companies</p>
                <p className="text-2xl font-bold">{analytics.totalCompanies.toLocaleString()}</p>
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

        <Card className="glass-card border-white/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Industries</p>
                <p className="text-2xl font-bold">{analytics.totalIndustries}</p>
                <p className="text-xs text-muted-foreground mt-1">Active sectors</p>
              </div>
              <Target className="h-8 w-8 text-tropical-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Growth</p>
                <p className="text-2xl font-bold">{analytics.memberGrowth.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">This quarter</p>
              </div>
              <TrendingUp className="h-8 w-8 text-plumeria-primary" />
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
              <TabsTrigger value="geography" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4" />
                Geography
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <LineChart className="h-4 w-4" />
                Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="industries" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Industry Distribution */}
                <Card className="glass-card border-white/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Industry Distribution
                    </CardTitle>
                    <CardDescription>
                      Member distribution across top industries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topIndustries.map((industry, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{industry.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {industry.member_count.toLocaleString()}
                            </span>
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
                            <span className="text-muted-foreground">
                              {((industry.member_count / analytics.totalMembers) * 100).toFixed(1)}%
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
                <Card className="glass-card border-white/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Growth Analysis
                    </CardTitle>
                    <CardDescription>
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
                            <p className="font-medium">{industry.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {industry.member_count.toLocaleString()} members
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

            <TabsContent value="geography" className="space-y-6">
              <Card className="glass-card border-white/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Geographic Distribution
                  </CardTitle>
                  <CardDescription>
                    Member distribution across Hawaiian Islands
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analytics.islandDistribution.map((island, index) => (
                      <div key={index} className="text-center p-4 rounded-lg bg-white/5">
                        <div className="text-2xl mb-2">
                          {index === 0 ? '🏙️' : index === 1 ? '🌋' : index === 2 ? '🏞️' : index === 3 ? '🌿' : '🏝️'}
                        </div>
                        <p className="font-semibold">{island.name}</p>
                        <p className="text-xl font-bold text-ocean-primary">
                          {island.member_count.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {island.percentage.toFixed(1)}% of network
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card className="glass-card border-white/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Growth Trends
                  </CardTitle>
                  <CardDescription>
                    Network growth and expansion opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16 space-y-4">
                    <div className="text-6xl">📈</div>
                    <div>
                      <p className="text-lg font-semibold">Advanced Charts Coming Soon</p>
                      <p className="text-sm text-muted-foreground">
                        Interactive time-series charts and trend analysis
                      </p>
                    </div>
                    <Button className="bg-gradient-to-r from-ocean-primary to-sunset-primary text-white">
                      Enable Advanced Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}