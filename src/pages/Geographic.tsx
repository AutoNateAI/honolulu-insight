import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Building, TrendingUp, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface IslandData {
  id: string;
  name: string;
  member_count: number;
  company_count: number;
  population: number;
  tech_percentage: number;
  coordinates: any; // Use any for JSON data from Supabase
}

export default function Geographic() {
  const [islandData, setIslandData] = useState<IslandData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIslandData();
  }, []);

  const fetchIslandData = async () => {
    try {
      const { data, error } = await supabase
        .from('island_data')
        .select('*')
        .order('member_count', { ascending: false });

      if (error) throw error;
      setIslandData(data || []);
    } catch (error) {
      console.error('Error fetching island data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalMembers = islandData.reduce((sum, island) => sum + island.member_count, 0);
  const totalCompanies = islandData.reduce((sum, island) => sum + island.company_count, 0);

  const getIslandIcon = (name: string) => {
    switch (name) {
      case 'Oahu': return '🏙️';
      case 'Maui': return '🌋';
      case 'Big Island': return '🏞️';
      case 'Kauai': return '🌿';
      case 'Molokai': return '🏝️';
      default: return '🏝️';
    }
  };

  const getMarketShareColor = (percentage: number) => {
    if (percentage > 60) return 'text-green-500';
    if (percentage > 30) return 'text-yellow-500';
    if (percentage > 15) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Geographic Distribution</h1>
          <p className="text-muted-foreground">
            HTW network presence across Hawaiian Islands
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            View Map
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{totalMembers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Across 5 islands</p>
              </div>
              <Users className="h-8 w-8 text-ocean-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Companies</p>
                <p className="text-2xl font-bold">{totalCompanies.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Active businesses</p>
              </div>
              <Building className="h-8 w-8 text-sunset-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Market Penetration</p>
                <p className="text-2xl font-bold">18.5%</p>
                <p className="text-xs text-muted-foreground mt-1">Avg tech adoption</p>
              </div>
              <TrendingUp className="h-8 w-8 text-tropical-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Map Placeholder */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Hawaiian Islands Network Map
          </CardTitle>
          <CardDescription>
            Interactive map showing HTW member and company distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-96 bg-gradient-to-br from-ocean-primary/20 via-tropical-primary/20 to-sunset-primary/20 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl">🗺️</div>
              <div>
                <p className="text-lg font-semibold">Interactive Map Coming Soon</p>
                <p className="text-sm text-muted-foreground">
                  Mapbox integration with Hawaiian islands visualization
                </p>
              </div>
              <Button className="bg-gradient-to-r from-ocean-primary to-sunset-primary text-white">
                Enable Map Integration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Islands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="glass-card border-white/20">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          islandData.map((island, index) => (
            <Card 
              key={island.id} 
              className={`glass-card border-white/20 hover:scale-105 transition-all duration-200 cursor-pointer group ${
                index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{getIslandIcon(island.name)}</div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-ocean-primary transition-colors">
                        {island.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Population: {island.population?.toLocaleString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={getMarketShareColor(island.tech_percentage)}
                  >
                    {island.tech_percentage}% Tech
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-ocean-primary">
                      {island.member_count.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-sunset-primary">
                      {island.company_count.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Companies</p>
                  </div>
                </div>

                {/* Market Share Visualization */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Market Share</span>
                    <span className="font-semibold">
                      {((island.member_count / totalMembers) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-ocean-primary to-sunset-primary transition-all duration-500 group-hover:from-sunset-primary group-hover:to-tropical-primary"
                      style={{ 
                        width: `${Math.min((island.member_count / totalMembers) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span>{(island.member_count / island.company_count).toFixed(1)} avg/company</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span>{island.tech_percentage}% penetration</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Insights Card */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Geographic Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-white/5">
              <p className="text-sm text-muted-foreground">Dominant Island</p>
              <p className="text-xl font-bold text-ocean-primary">Oahu</p>
              <p className="text-xs text-muted-foreground">65% of all members</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <p className="text-sm text-muted-foreground">Fastest Growing</p>
              <p className="text-xl font-bold text-tropical-primary">Big Island</p>
              <p className="text-xs text-muted-foreground">15.3% growth rate</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <p className="text-sm text-muted-foreground">Untapped Market</p>
              <p className="text-xl font-bold text-sunset-primary">Neighbor Islands</p>
              <p className="text-xs text-muted-foreground">35% opportunity</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5">
              <p className="text-sm text-muted-foreground">Next Target</p>
              <p className="text-xl font-bold text-plumeria-primary">Maui</p>
              <p className="text-xs text-muted-foreground">High potential</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}