import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Users, Building, MapPin, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Search Network</h1>
          <p className="text-muted-foreground">
            Find members, companies, and opportunities across HTW's network
          </p>
        </div>
      </div>

      {/* Search Header */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for members, companies, skills, industries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-lg h-12"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleSearch}
                disabled={!searchTerm || isSearching}
                className="bg-gradient-to-r from-ocean-primary to-sunset-primary text-white h-12 px-8"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
              <Button variant="outline" className="h-12 px-4">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchTerm && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/10 w-full">
            <TabsTrigger value="all" className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4" />
              All Results
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2 flex-1">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2 flex-1">
              <Building className="h-4 w-4" />
              Companies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Search Summary */}
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-ocean-primary">47</p>
                    <p className="text-sm text-muted-foreground">Total Results</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-sunset-primary">23</p>
                    <p className="text-sm text-muted-foreground">Members Found</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-tropical-primary">8</p>
                    <p className="text-sm text-muted-foreground">Companies Found</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Members Section */}
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Top Members
                  </CardTitle>
                  <CardDescription>
                    Most relevant member matches
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <Avatar className="h-10 w-10 border-2 border-white/20">
                        <AvatarFallback className="bg-gradient-to-br from-ocean-primary to-sunset-primary text-white font-semibold">
                          JS
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">John Smith</p>
                          <Badge variant="secondary" className="text-xs">High Match</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          Senior Software Engineer • Hawaiian Airlines
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Oahu</span>
                          <Badge variant="outline" className="text-xs">React</Badge>
                          <Badge variant="outline" className="text-xs">Python</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Member Results
                  </Button>
                </CardContent>
              </Card>

              {/* Companies Section */}
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Top Companies
                  </CardTitle>
                  <CardDescription>
                    Most relevant company matches
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-gradient-to-br from-sunset-primary to-tropical-primary flex items-center justify-center text-white font-semibold text-xs">
                            HA
                          </div>
                          <div>
                            <p className="font-medium">Hawaiian Airlines</p>
                            <p className="text-sm text-muted-foreground">Transportation</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">Perfect Match</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">89 members</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Oahu</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Company Results
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle>Member Search Results</CardTitle>
                <CardDescription>
                  Detailed member search coming soon with advanced filtering
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-16">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-lg font-semibold mb-2">Advanced Member Search</p>
                <p className="text-sm text-muted-foreground">
                  Filter by skills, experience, location, and activity level
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle>Company Search Results</CardTitle>
                <CardDescription>
                  Detailed company search coming soon with industry filtering
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-16">
                <div className="text-6xl mb-4">🏢</div>
                <p className="text-lg font-semibold mb-2">Advanced Company Search</p>
                <p className="text-sm text-muted-foreground">
                  Filter by industry, size, location, and engagement level
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* No Search Yet */}
      {!searchTerm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass-card border-white/20">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">🔍</div>
              <CardTitle>Quick Search</CardTitle>
              <CardDescription>
                Find specific members or companies quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Try searching for:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>"Machine Learning"</li>
                  <li>"Hawaiian Airlines"</li>
                  <li>"React developer"</li>
                  <li>"Healthcare Maui"</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <CardTitle>Advanced Filters</CardTitle>
              <CardDescription>
                Narrow down results with precise filtering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Filter by:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Industry & Skills</li>
                  <li>Island Location</li>
                  <li>Company Size</li>
                  <li>Activity Level</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">💾</div>
              <CardTitle>Save & Export</CardTitle>
              <CardDescription>
                Save searches and export results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Coming soon:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Saved search queries</li>
                  <li>Export to Excel/CSV</li>
                  <li>Email integration</li>
                  <li>Search alerts</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}