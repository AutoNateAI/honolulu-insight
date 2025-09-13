import { 
  Users, 
  Building2, 
  MapPin, 
  TrendingUp,
  Zap,
  Calendar,
  Target,
  Award
} from 'lucide-react';
import { StatsCard, MetricCard } from '@/components/StatsCard';
import { dashboardStats, industries, islandData } from '@/data/mockData';

export function Dashboard() {
  const totalMembers = dashboardStats.totalMembers;
  const totalCompanies = dashboardStats.totalCompanies;
  const topGrowthIndustry = dashboardStats.topGrowthIndustry;
  const averageGrowth = dashboardStats.averageGrowthRate;

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-poppins font-bold text-white mb-4">
          Hawaii Tech Week Network
        </h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Connecting {totalMembers.toLocaleString()} tech professionals across {islandData.length} Hawaiian islands
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Members"
          value={totalMembers.toLocaleString()}
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
          value={totalCompanies.toLocaleString()}
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
          value={islandData.length}
          icon={MapPin}
          variant="tropical"
          description="Complete coverage"
        />

        <StatsCard
          title="Average Growth"
          value={`${averageGrowth.toFixed(1)}%`}
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
          <button className="px-4 py-2 bg-ocean-primary text-white rounded-lg hover:bg-ocean-medium transition-colors">
            View All Industries
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {industries.slice(0, 5).map((industry) => (
            <div 
              key={industry.id}
              className="p-4 rounded-xl glass-card-elevated hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{industry.icon}</div>
                <h4 className="font-medium text-foreground mb-1">{industry.name}</h4>
                <p className="text-2xl font-bold font-poppins text-ocean-primary mb-1">
                  {industry.memberCount}
                </p>
                <p className="text-sm text-muted-foreground">
                  {industry.companyCount} companies
                </p>
                <div className="mt-2 flex items-center justify-center text-xs">
                  <span className="text-tropical-light">↗ {industry.growthRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Island Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-poppins font-bold text-foreground mb-4">
            Geographic Distribution
          </h3>
          <div className="space-y-4">
            {islandData.map((island) => (
              <div key={island.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ocean-primary/20 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-ocean-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{island.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {island.companyCount} companies
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold font-poppins text-ocean-primary">
                    {island.memberCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">members</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-poppins font-bold text-foreground mb-4">
            Growth Highlights
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-tropical-light/10 border border-tropical-light/20">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-5 w-5 text-tropical-light" />
                <span className="font-medium text-foreground">Fastest Growing</span>
              </div>
              <p className="text-lg font-poppins font-bold text-tropical-light">
                {topGrowthIndustry.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {topGrowthIndustry.growthRate}% quarterly growth
              </p>
            </div>

            <div className="p-4 rounded-xl bg-sunset-coral/10 border border-sunset-coral/20">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-sunset-coral" />
                <span className="font-medium text-foreground">Expansion Target</span>
              </div>
              <p className="text-lg font-poppins font-bold text-sunset-coral">
                Tourism & Healthcare
              </p>
              <p className="text-sm text-muted-foreground">
                High potential, underrepresented
              </p>
            </div>

            <div className="p-4 rounded-xl bg-plumeria-light/10 border border-plumeria-light/20">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-5 w-5 text-plumeria-light" />
                <span className="font-medium text-foreground">Next Event</span>
              </div>
              <p className="text-lg font-poppins font-bold text-plumeria-light">
                Healthcare Tech Summit
              </p>
              <p className="text-sm text-muted-foreground">
                Target: 200+ attendees
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-poppins font-bold text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 rounded-xl glass-card-elevated hover:scale-105 transition-all duration-200 text-left">
            <Zap className="h-8 w-8 text-ocean-primary mb-2" />
            <h4 className="font-medium text-foreground mb-1">Export Member List</h4>
            <p className="text-sm text-muted-foreground">Download contacts for outreach</p>
          </button>

          <button className="p-4 rounded-xl glass-card-elevated hover:scale-105 transition-all duration-200 text-left">
            <Calendar className="h-8 w-8 text-sunset-coral mb-2" />
            <h4 className="font-medium text-foreground mb-1">Plan Industry Event</h4>
            <p className="text-sm text-muted-foreground">Create targeted networking events</p>
          </button>

          <button className="p-4 rounded-xl glass-card-elevated hover:scale-105 transition-all duration-200 text-left">
            <TrendingUp className="h-8 w-8 text-tropical-light mb-2" />
            <h4 className="font-medium text-foreground mb-1">Growth Analytics</h4>
            <p className="text-sm text-muted-foreground">Deep dive into expansion data</p>
          </button>
        </div>
      </div>
    </div>
  );
}