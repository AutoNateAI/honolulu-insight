import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, Building, Users, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Industry {
  id: string;
  name: string;
  description: string;
  member_count: number;
  company_count: number;
  growth_rate: number;
  color: string;
  icon: string;
}

export default function Industries() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchIndustries();
  }, []);

  const fetchIndustries = async () => {
    try {
      const { data, error } = await supabase
        .from('industries')
        .select('*')
        .order('member_count', { ascending: false });

      if (error) throw error;
      setIndustries(data || []);
    } catch (error) {
      console.error('Error fetching industries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIndustries = industries.filter(industry =>
    industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    industry.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMembers = industries.reduce((sum, industry) => sum + industry.member_count, 0);
  const totalCompanies = industries.reduce((sum, industry) => sum + industry.company_count, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Industries</h1>
          <p className="text-muted-foreground">
            Explore HTW's network across {industries.length} industries
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
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
              </div>
              <Building className="h-8 w-8 text-sunset-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Industries</p>
                <p className="text-2xl font-bold">{industries.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-tropical-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Industries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="glass-card border-white/20">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredIndustries.map((industry) => (
            <Card 
              key={industry.id} 
              className="glass-card border-white/20 hover:scale-105 transition-all duration-200 cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{industry.icon}</div>
                  <Badge 
                    variant={industry.growth_rate > 10 ? "default" : industry.growth_rate > 5 ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {industry.growth_rate > 0 ? '+' : ''}{industry.growth_rate}%
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-ocean-primary transition-colors">
                  {industry.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {industry.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Members</span>
                    <span className="font-semibold">{industry.member_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Companies</span>
                    <span className="font-semibold">{industry.company_count.toLocaleString()}</span>
                  </div>
                  <div 
                    className="h-1 rounded-full"
                    style={{ 
                      backgroundColor: industry.color,
                      opacity: 0.3,
                    }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-300 group-hover:opacity-100"
                      style={{ 
                        backgroundColor: industry.color,
                        width: `${Math.min((industry.member_count / totalMembers) * 100 * 5, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredIndustries.length === 0 && !loading && (
        <Card className="glass-card border-white/20">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No industries found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}