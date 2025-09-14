import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Users, Building, MapPin, ExternalLink, Layers } from 'lucide-react';
import MapControl from './MapControl';

interface Company {
  id: string;
  name: string;
  website?: string;
  location: string;
  island: string;
  member_count: number;
  industry_id?: string;
  industries?: {
    name: string;
    color: string;
    icon: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface Member {
  id: string;
  name: string;
  job_title?: string;
  email?: string;
  linkedin_url?: string;
}

interface LinkedInPost {
  id: string;
  post_url: string;
  post_content?: string;
  post_date: string;
  post_type?: string;
}

interface MapProps {
  className?: string;
}

const Map: React.FC<MapProps> = ({ className = "" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyMembers, setCompanyMembers] = useState<Member[]>([]);
  const [linkedinPosts, setLinkedinPosts] = useState<LinkedInPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [controlOpen, setControlOpen] = useState(false);
  const [filteredIndustry, setFilteredIndustry] = useState<string | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Hawaiian Islands coordinates
  const hawaiiCenter: [number, number] = [-157.8583, 21.3099];

  useEffect(() => {
    fetchMapboxToken();
  }, []);

  useEffect(() => {
    if (mapboxToken) {
      initializeMap();
      fetchCompanies();
    }
  }, [mapboxToken]);

  const fetchMapboxToken = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-mapbox-token');
      if (error) throw error;
      setMapboxToken(data?.token);
    } catch (error) {
      console.error('Error fetching Mapbox token:', error);
      // For development - you'll need to add your Mapbox token to Supabase secrets
      console.log('Please add your Mapbox public token to Supabase Edge Function secrets as MAPBOX_PUBLIC_TOKEN');
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: hawaiiCenter,
      zoom: 7,
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });
    });

    setLoading(false);
  };

  const fetchCompanies = async () => {
    try {
      const { data: companiesData, error } = await supabase
        .from('companies')
        .select(`
          *,
          industries(name, color, icon)
        `)
        .order('member_count', { ascending: false });

      if (error) throw error;

      const companiesWithCoords = (companiesData || []).map(company => ({
        ...company,
        coordinates: company.coordinates && typeof company.coordinates === 'object' && 
                    'lat' in company.coordinates && 'lng' in company.coordinates ? {
          lat: Number((company.coordinates as any).lat),
          lng: Number((company.coordinates as any).lng)
        } : null
      }));

      setCompanies(companiesWithCoords);
      addCompanyMarkers(companiesWithCoords);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const geocodeLocation = async (location: string, island: string): Promise<{lat: number, lng: number} | null> => {
    try {
      const query = `${location}, ${island}, Hawaii`;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&proximity=${hawaiiCenter[0]},${hawaiiCenter[1]}&country=us`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lat, lng };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  const addCompanyMarkers = (companies: Company[]) => {
    if (!map.current) return;

    // Clear existing markers
    clearMarkers();

    // Filter companies by industry if selected
    const filteredCompanies = filteredIndustry 
      ? companies.filter(company => company.industry_id === filteredIndustry)
      : companies;

    filteredCompanies.forEach(async (company) => {
      // If company doesn't have coordinates, try to geocode and save them
      if (!company.coordinates && company.location && company.island) {
        const coords = await geocodeAndSaveLocation(company);
        if (coords) {
          company.coordinates = coords;
        } else {
          return; // Skip this company if we can't get coordinates
        }
      }
      
      if (!company.coordinates) return;

      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'company-marker';
      markerEl.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${company.industries?.color || '#1E88E5'}, rgba(255, 255, 255, 0.2));
        border: 3px solid rgba(255, 255, 255, 0.8);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
      `;
      
      markerEl.innerHTML = company.industries?.icon || '🏢';
      
      // Add hover effects
      markerEl.addEventListener('mouseenter', () => {
        markerEl.style.transform = 'scale(1.2)';
        markerEl.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
      });
      
      markerEl.addEventListener('mouseleave', () => {
        markerEl.style.transform = 'scale(1)';
        markerEl.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
      });

      // Create marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([company.coordinates.lng, company.coordinates.lat])
        .addTo(map.current!);

      // Add click handler
      markerEl.addEventListener('click', () => {
        handleCompanyClick(company);
      });

      // Store marker reference
      markersRef.current.push(marker);
    });
  };

  const geocodeAndSaveLocation = async (company: Company): Promise<{lat: number, lng: number} | null> => {
    if (!mapboxToken) return null;
    
    try {
      const coords = await geocodeLocation(company.location, company.island);
      if (coords) {
        // Save coordinates to database
        const { error } = await supabase
          .from('companies')
          .update({ 
            coordinates: { lat: coords.lat, lng: coords.lng }
          })
          .eq('id', company.id);

        if (error) {
          console.error('Error saving coordinates:', error);
          return null;
        }

        return coords;
      }
      return null;
    } catch (error) {
      console.error('Error geocoding location:', error);
      return null;
    }
  };

  const handleCompanyClick = async (company: Company) => {
    setSelectedCompany(company);
    
    // Fetch company members
    try {
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id, name, job_title, email, linkedin_url')
        .eq('company_id', company.id);

      if (membersError) throw membersError;
      setCompanyMembers(members || []);

      // Fetch LinkedIn posts for this company
      const { data: posts, error: postsError } = await supabase
        .from('linkedin_posts')
        .select('*')
        .eq('company_id', company.id)
        .order('post_date', { ascending: false })
        .limit(5);

      if (postsError) throw postsError;
      setLinkedinPosts(posts || []);

    } catch (error) {
      console.error('Error fetching company data:', error);
    }

    // Fly to the company location
    if (map.current && company.coordinates) {
      map.current.flyTo({
        center: [company.coordinates.lng, company.coordinates.lat],
        zoom: 12,
        essential: true
      });
    }
  };

  const closeCompanyDetails = () => {
    setSelectedCompany(null);
    setCompanyMembers([]);
    setLinkedinPosts([]);
    
    // Fly back to Hawaii overview
    if (map.current) {
      map.current.flyTo({
        center: hawaiiCenter,
        zoom: 7,
        essential: true
      });
    }
  };

  const handleCompanySelect = (company: Company) => {
    handleCompanyClick(company);
  };

  const handleIndustryFilter = (industryId: string | null) => {
    setFilteredIndustry(industryId);
    // Re-add markers with the new filter
    addCompanyMarkers(companies);
  };

  // Re-add markers when filter changes
  useEffect(() => {
    if (companies.length > 0) {
      addCompanyMarkers(companies);
    }
  }, [filteredIndustry]);

  if (!mapboxToken) {
    return (
      <div className={`relative bg-gradient-to-br from-ocean-primary/20 via-tropical-primary/20 to-sunset-primary/20 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center space-y-4 p-8">
          <div className="text-6xl">🗺️</div>
          <div>
            <p className="text-lg font-semibold text-white">Loading Map...</p>
            <p className="text-sm text-white/70">
              Setting up Mapbox integration
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
      
      {/* Map Controls Button */}
      <div className="absolute top-4 left-4 z-40 pointer-events-auto">
        <Button
          onClick={() => setControlOpen(!controlOpen)}
          className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20"
        >
          <Layers className="h-4 w-4 mr-2" />
          {controlOpen ? 'Hide' : 'Show'} Controls
        </Button>
      </div>

      {/* Map Control Panel */}
      <MapControl
        isOpen={controlOpen}
        onClose={() => setControlOpen(false)}
        onCompanySelect={handleCompanySelect}
        onIndustryFilter={handleIndustryFilter}
      />
      
      {/* Company Details Panel */}
      {selectedCompany && (
        <div className="absolute top-4 right-4 w-96 max-h-[calc(100%-2rem)] overflow-y-auto pointer-events-auto z-50">
          <Card className="glass-card border-white/20 shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{selectedCompany.industries?.icon || '🏢'}</div>
                  <div>
                    <CardTitle className="text-xl text-white">
                      {selectedCompany.name}
                    </CardTitle>
                    <p className="text-sm text-white/70">{selectedCompany.location}, {selectedCompany.island}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeCompanyDetails}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {selectedCompany.industries && (
                <Badge 
                  style={{ backgroundColor: selectedCompany.industries.color }}
                  className="text-white w-fit"
                >
                  {selectedCompany.industries.name}
                </Badge>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Company Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-white/10">
                  <Users className="h-5 w-5 text-ocean-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{selectedCompany.member_count}</p>
                  <p className="text-xs text-white/70">Members</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/10">
                  <Building className="h-5 w-5 text-sunset-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{linkedinPosts.length}</p>
                  <p className="text-xs text-white/70">Posts</p>
                </div>
              </div>

              {/* Website Link */}
              {selectedCompany.website && (
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => window.open(selectedCompany.website, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
              )}

              {/* Members List */}
              {companyMembers.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Team Members ({companyMembers.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {companyMembers.map((member) => (
                      <div key={member.id} className="p-2 rounded-lg bg-white/10">
                        <p className="font-medium text-white text-sm">{member.name}</p>
                        {member.job_title && (
                          <p className="text-xs text-white/70">{member.job_title}</p>
                        )}
                        {member.linkedin_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 p-1 text-xs text-blue-300 hover:text-blue-200"
                            onClick={() => window.open(member.linkedin_url, '_blank')}
                          >
                            LinkedIn
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LinkedIn Posts */}
              {linkedinPosts.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Recent Posts ({linkedinPosts.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {linkedinPosts.map((post) => (
                      <div key={post.id} className="p-2 rounded-lg bg-white/10">
                        <p className="text-xs text-white/70 mb-1">
                          {new Date(post.post_date).toLocaleDateString()}
                        </p>
                        {post.post_content && (
                          <p className="text-sm text-white line-clamp-2 mb-2">
                            {post.post_content.slice(0, 100)}...
                          </p>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 p-1 text-xs text-blue-300 hover:text-blue-200"
                          onClick={() => window.open(post.post_url, '_blank')}
                        >
                          View Post
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <Card className="glass-card border-white/20">
          <CardContent className="p-3">
            <p className="text-xs text-white/70 mb-2">Company Markers</p>
            <div className="flex items-center gap-2 text-xs text-white">
              <MapPin className="h-3 w-3" />
              Click pins to view details
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Map;