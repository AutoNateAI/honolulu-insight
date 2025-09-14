import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  TrendingUp,
  Target,
  Award
} from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import { supabase } from '@/integrations/supabase/client';

interface DashboardData {
  totalMembers: number;
  totalCompanies: number;
  totalIndustries: number;
  averageGrowth: number;
  topIndustries: any[];
  islandData: any[];
  topGrowthIndustry: {
    name: string;
    growthRate: number;
  };
}

export function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalMembers: 0,
    totalCompanies: 0,
    totalIndustries: 0,
    averageGrowth: 0,
    topIndustries: [],
    islandData: [],
    topGrowthIndustry: { name: '', growthRate: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch industries with counts
      const { data: industries, error: industriesError } = await supabase
        .from('industries')
        .select('*')
        .order('member_count', { ascending: false });

      if (industriesError) throw industriesError;

      // Fetch island data
      const { data: islands, error: islandsError } = await supabase
        .from('island_data')
        .select('*')
        .order('member_count', { ascending: false });

      if (islandsError) throw islandsError;

      // Calculate totals
      const totalMembers = industries?.reduce((sum, ind) => sum + (ind.member_count || 0), 0) || 0;
      const totalCompanies = industries?.reduce((sum, ind) => sum + (ind.company_count || 0), 0) || 0;
      const averageGrowth = industries?.length > 0 
        ? industries.reduce((sum, ind) => sum + (ind.growth_rate || 0), 0) / industries.length
        : 0;

      // Find top growth industry
      const topGrowthIndustry = industries?.reduce((max, industry) => 
        (industry.growth_rate || 0) > (max.growth_rate || 0) ? industry : max
      , industries[0]) || { name: '', growth_rate: 0 };

      setDashboardData({
        totalMembers,
        totalCompanies,
        totalIndustries: industries?.length || 0,
        averageGrowth,
        topIndustries: industries?.slice(0, 5) || [],
        islandData: islands || [],
        topGrowthIndustry: {
          name: topGrowthIndustry.name,
          growthRate: topGrowthIndustry.growth_rate || 0
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-poppins font-bold text-white mb-4">
          Hawaii Tech Week Network
        </h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Connecting {dashboardData.totalMembers.toLocaleString()} tech professionals across {dashboardData.islandData.length} Hawaiian islands
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Members"
          value={dashboardData.totalMembers.toLocaleString()}
          icon={Users}
          variant="ocean"
          change={{
            value: 12.5,
            label: "Growth this quarter",
            positive: true
          }}
          description="Active tech professionals"
        />

        <StatsCard
          title="Companies"
          value={dashboardData.totalCompanies.toLocaleString()}
          icon={Building2}
          variant="sunset"
          change={{
            value: 8.3,
            label: "New companies joined",
            positive: true
          }}
          description="Across all industries"
        />

        <StatsCard
          title="Hawaiian Islands"
          value={dashboardData.islandData.length}
          icon={TrendingUp}
          variant="tropical"
          description="Complete coverage"
        />

        <StatsCard
          title="Average Growth"
          value={`${dashboardData.averageGrowth.toFixed(1)}%`}
          icon={TrendingUp}
          variant="plumeria"
          change={{
            value: 2.8,
            label: "Above industry average"
          }}
          description="Quarterly member growth"
        />
      </div>

      {/* Industry Overview */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-poppins font-bold text-foreground mb-2">
              Industry Distribution
            </h3>
            <p className="text-muted-foreground">
              Top performing sectors in Hawaii's tech ecosystem
            </p>
          </div>
          <button 
            onClick={() => navigate('/industries')}
            className="px-4 py-2 bg-ocean-primary text-white rounded-lg hover:bg-ocean-medium transition-colors"
          >
            View All Industries
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {dashboardData.topIndustries.map((industry) => (
            <div 
              key={industry.id}
              className="p-4 rounded-xl glass-card-elevated hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={() => navigate('/industries')}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{industry.icon}</div>
                <h4 className="font-medium text-white mb-1">{industry.name}</h4>
                <p className="text-2xl font-bold font-poppins text-ocean-primary mb-1">
                  {industry.member_count || 0}
                </p>
                <p className="text-sm text-white/70">
                  {industry.company_count || 0} companies
                </p>
                <div className="mt-2 flex items-center justify-center text-xs">
                  <span className="text-tropical-light">↗ {industry.growth_rate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Highlights */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-poppins font-bold text-foreground mb-4">
          Growth Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-tropical-light/10 border border-tropical-light/20">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-5 w-5 text-tropical-light" />
              <span className="font-medium text-white">Fastest Growing</span>
            </div>
            <p className="text-lg font-poppins font-bold text-tropical-light">
              {dashboardData.topGrowthIndustry.name || 'Technology'}
            </p>
            <p className="text-sm text-white/70">
              {dashboardData.topGrowthIndustry.growthRate.toFixed(1)}% quarterly growth
            </p>
          </div>

          <div className="p-4 rounded-xl bg-sunset-coral/10 border border-sunset-coral/20">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-sunset-coral" />
              <span className="font-medium text-white">Total Industries</span>
            </div>
            <p className="text-lg font-poppins font-bold text-sunset-coral">
              {dashboardData.totalIndustries}
            </p>
            <p className="text-sm text-white/70">
              Active sectors tracked
            </p>
          </div>

          <div className="p-4 rounded-xl bg-plumeria-light/10 border border-plumeria-light/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-plumeria-light" />
              <span className="font-medium text-white">Network Growth</span>
            </div>
            <p className="text-lg font-poppins font-bold text-plumeria-light">
              {((dashboardData.totalMembers / Math.max(dashboardData.totalCompanies, 1)) || 0).toFixed(1)}
            </p>
            <p className="text-sm text-white/70">
              Avg members per company
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}