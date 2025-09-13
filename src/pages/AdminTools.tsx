import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Upload, 
  Settings, 
  Users, 
  Building, 
  FileText, 
  Mail,
  Calendar,
  BarChart3,
  Shield,
  Database,
  RefreshCw
} from 'lucide-react';

export default function AdminTools() {
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: string) => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const stats = {
    totalMembers: 2847,
    totalCompanies: 324,
    totalIndustries: 15,
    lastUpdated: '2 hours ago'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Tools</h1>
          <p className="text-muted-foreground">
            Manage HTW network data and generate reports
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2 w-fit">
          <Shield className="h-3 w-3" />
          Admin Access
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-ocean-primary mx-auto mb-2" />
            <p className="text-xl font-bold">{stats.totalMembers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Members</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 text-center">
            <Building className="h-8 w-8 text-sunset-primary mx-auto mb-2" />
            <p className="text-xl font-bold">{stats.totalCompanies.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Companies</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-tropical-primary mx-auto mb-2" />
            <p className="text-xl font-bold">{stats.totalIndustries}</p>
            <p className="text-xs text-muted-foreground">Industries</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/20">
          <CardContent className="p-4 text-center">
            <RefreshCw className="h-8 w-8 text-plumeria-primary mx-auto mb-2" />
            <p className="text-sm font-bold">Updated</p>
            <p className="text-xs text-muted-foreground">{stats.lastUpdated}</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tools Tabs */}
      <Tabs defaultValue="export" className="space-y-6">
        <TabsList className="bg-white/10 w-full">
          <TabsTrigger value="export" className="flex items-center gap-2 flex-1">
            <Download className="h-4 w-4" />
            Export Data
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2 flex-1">
            <Upload className="h-4 w-4" />
            Import Data
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2 flex-1">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 flex-1">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Member Export */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Members Export
                </CardTitle>
                <CardDescription>
                  Download complete member directory
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Records:</span>
                    <span className="font-semibold">{stats.totalMembers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-semibold">Excel, CSV</span>
                  </div>
                </div>
                {isExporting ? (
                  <div className="space-y-2">
                    <Progress value={exportProgress} className="h-2" />
                    <p className="text-xs text-center text-muted-foreground">
                      Exporting... {exportProgress}%
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleExport('members')} 
                    className="w-full bg-gradient-to-r from-ocean-primary to-sunset-primary text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Members
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Company Export */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Companies Export
                </CardTitle>
                <CardDescription>
                  Download company database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Records:</span>
                    <span className="font-semibold">{stats.totalCompanies.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-semibold">Excel, CSV</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleExport('companies')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Companies
                </Button>
              </CardContent>
            </Card>

            {/* Analytics Export */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics Export
                </CardTitle>
                <CardDescription>
                  Download analytics and insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Includes:</span>
                    <span className="font-semibold">Charts, Trends</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-semibold">PDF, Excel</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleExport('analytics')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Data Import Tools
              </CardTitle>
              <CardDescription>
                Import new data into the HTW network database
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-16 space-y-4">
              <div className="text-6xl">📤</div>
              <div>
                <p className="text-lg font-semibold mb-2">Bulk Data Import</p>
                <p className="text-sm text-muted-foreground">
                  Upload CSV files to add members, companies, or update existing records
                </p>
              </div>
              <Button className="bg-gradient-to-r from-tropical-primary to-sunset-primary text-white">
                <Upload className="h-4 w-4 mr-2" />
                Select Files to Import
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scheduled Reports */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Scheduled Reports
                </CardTitle>
                <CardDescription>
                  Automated reports and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div>
                      <p className="font-medium">Weekly Growth Report</p>
                      <p className="text-sm text-muted-foreground">Every Monday 9 AM</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div>
                      <p className="font-medium">Monthly Analytics</p>
                      <p className="text-sm text-muted-foreground">First of month</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule New Report
                </Button>
              </CardContent>
            </Card>

            {/* Email Reports */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Reports
                </CardTitle>
                <CardDescription>
                  Send reports to stakeholders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Recipients:</span>
                    <span className="font-semibold">5 stakeholders</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Sent:</span>
                    <span className="font-semibold">Yesterday</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Configure Email List
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Database Management */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Management
                </CardTitle>
                <CardDescription>
                  System maintenance and optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data Cache
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Optimize Database
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Run Security Scan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Status
                </CardTitle>
                <CardDescription>
                  Current system health and performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Status</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Response Time</span>
                    <span className="text-sm font-semibold">&lt; 200ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Backup</span>
                    <span className="text-sm font-semibold">2 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}