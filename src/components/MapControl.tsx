import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, X, Building, MapPin, Layers } from 'lucide-react';

interface Industry {
  id: string;
  name: string;
  color: string;
  icon: string;
  member_count: number;
  company_count: number;
}

interface Company {
  id: string;
  name: string;
  location: string;
  island: string;
  member_count: number;
  industry_id?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  industries?: {
    name: string;
    color: string;
    icon: string;
  };
}

interface MapControlProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanySelect: (company: Company) => void;
  onIndustryFilter: (industryId: string | null) => void;
}

const MapControl: React.FC<MapControlProps> = ({
  isOpen,
  onClose,
  onCompanySelect,
  onIndustryFilter
}) => {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'industries' | 'companies'>('industries');

  useEffect(() => {
    if (isOpen) {
      fetchIndustries();
      fetchCompanies();
    }
  }, [isOpen]);

  useEffect(() => {
    filterCompanies();
  }, [companies, selectedIndustry, searchTerm]);

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
    }
  };

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          industries(name, color, icon)
        `)
        .order('member_count', { ascending: false });

      if (error) throw error;

      const companiesWithCoords = (data || []).map(company => ({
        ...company,
        coordinates: company.coordinates && typeof company.coordinates === 'object' && 
                    'lat' in company.coordinates && 'lng' in company.coordinates ? {
          lat: Number((company.coordinates as any).lat),
          lng: Number((company.coordinates as any).lng)
        } : null
      }));

      setCompanies(companiesWithCoords);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const filterCompanies = () => {
    let filtered = companies;

    if (selectedIndustry) {
      filtered = filtered.filter(company => company.industry_id === selectedIndustry);
    }

    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.island.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCompanies(filtered);
  };

  const handleIndustryClick = (industry: Industry) => {
    const newSelectedIndustry = selectedIndustry === industry.id ? null : industry.id;
    setSelectedIndustry(newSelectedIndustry);
    onIndustryFilter(newSelectedIndustry);
  };

  const handleCompanyClick = (company: Company) => {
    onCompanySelect(company);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-4 left-4 w-80 max-h-[calc(100vh-2rem)] z-50 pointer-events-auto">
      <Card className="glass-card border-white/20 backdrop-blur-xl shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Map Navigation
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tab Buttons */}
          <div className="flex space-x-1 bg-white/5 border border-white/10 p-1 rounded-lg backdrop-blur-sm">
            <Button
              variant={activeTab === 'industries' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('industries')}
              className={`flex-1 text-xs transition-all duration-200 ${
                activeTab === 'industries' 
                  ? 'bg-white/30 text-white shadow-lg backdrop-blur-sm border border-white/20' 
                  : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
            >
              Industries
            </Button>
            <Button
              variant={activeTab === 'companies' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('companies')}
              className={`flex-1 text-xs transition-all duration-200 ${
                activeTab === 'companies' 
                  ? 'bg-white/30 text-white shadow-lg backdrop-blur-sm border border-white/20' 
                  : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
            >
              Companies
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white/10 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/15 focus:border-white/40 transition-all duration-200"
            />
          </div>

          {/* Industries Tab */}
          {activeTab === 'industries' && (
            <ScrollArea className="h-64">
              <div className="space-y-2 pr-4">
                {industries
                  .filter(industry => 
                    industry.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((industry) => (
                    <Button
                      key={industry.id}
                      variant="ghost"
                      onClick={() => handleIndustryClick(industry)}
                      className={`w-full justify-start p-3 h-auto transition-all duration-200 backdrop-blur-sm ${
                        selectedIndustry === industry.id
                          ? 'bg-white/25 border border-white/40 shadow-lg text-white'
                          : 'hover:bg-white/15 text-white/90 hover:text-white border border-transparent hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="text-lg">{industry.icon}</div>
                          <div className="text-left">
                            <p className="text-white font-medium text-sm">{industry.name}</p>
                            <p className="text-white/60 text-xs">
                              {industry.company_count} companies
                            </p>
                          </div>
                        </div>
                        <Badge
                          style={{ backgroundColor: `${industry.color}40` }}
                          className="text-white border-none text-xs"
                        >
                          {industry.member_count}
                        </Badge>
                      </div>
                    </Button>
                  ))}
              </div>
            </ScrollArea>
          )}

          {/* Companies Tab */}
          {activeTab === 'companies' && (
            <ScrollArea className="h-64">
              <div className="space-y-2 pr-4">
                {filteredCompanies.map((company) => (
                  <Button
                    key={company.id}
                    variant="ghost"
                    onClick={() => handleCompanyClick(company)}
                    className={`w-full justify-start p-3 h-auto transition-all duration-200 backdrop-blur-sm border border-transparent hover:border-white/20 ${
                      company.coordinates 
                        ? 'hover:bg-white/15 text-white/90 hover:text-white' 
                        : 'opacity-60 cursor-not-allowed bg-white/5'
                    }`}
                    disabled={!company.coordinates}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="text-lg">
                          {company.industries?.icon || '🏢'}
                        </div>
                        <div className="text-left">
                          <p className="text-white font-medium text-sm">{company.name}</p>
                          <p className="text-white/60 text-xs flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {company.location}, {company.island}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className="bg-white/30 text-white border-none text-xs mb-1 backdrop-blur-sm">
                          {company.member_count}
                        </Badge>
                        {!company.coordinates && (
                          <span className="text-amber-300 text-xs font-medium bg-amber-500/20 px-2 py-1 rounded">
                            No location
                          </span>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Clear Filter */}
          {selectedIndustry && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedIndustry(null);
                onIndustryFilter(null);
              }}
              className="w-full bg-white/15 border-white/30 text-white hover:bg-white/25 transition-all duration-200 backdrop-blur-sm"
            >
              Clear Industry Filter
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MapControl;