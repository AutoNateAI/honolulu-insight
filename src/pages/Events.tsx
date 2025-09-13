import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, Users, Building, Plus, Upload, Download, Search } from 'lucide-react';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';

interface Event {
  id: string;
  name: string;
  description: string;
  event_type: string;
  company_id: string;
  organizer_name: string;
  organizer_email: string;
  event_date: string;
  location: string;
  promotion_channels: string[];
  attendee_count: number;
  created_at: string;
  companies?: {
    name: string;
  };
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          companies (
            name
          )
        `)
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch events',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.companies?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedEventType === 'all' || event.event_type === selectedEventType;
    
    return matchesSearch && matchesType;
  });

  const getEventTypeColor = (type: string) => {
    return type === 'htw' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalEvents = events.length;
  const htwEvents = events.filter(e => e.event_type === 'htw').length;
  const companyEvents = events.filter(e => e.event_type === 'company').length;
  const totalAttendees = events.reduce((sum, event) => sum + (event.attendee_count || 0), 0);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        {/* Loading stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Events</h1>
          <p className="text-white/70">
            Track HTW and company events to identify engagement opportunities
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            onClick={() => setBulkUploadOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            size="sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button 
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <Input
            placeholder="Search events, organizers, companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={selectedEventType === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedEventType('all')}
            size="sm"
            className={selectedEventType === 'all' 
              ? 'bg-white text-black' 
              : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }
          >
            All Events
          </Button>
          <Button
            variant={selectedEventType === 'htw' ? 'default' : 'outline'}
            onClick={() => setSelectedEventType('htw')}
            size="sm"
            className={selectedEventType === 'htw' 
              ? 'bg-white text-black' 
              : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }
          >
            HTW Events
          </Button>
          <Button
            variant={selectedEventType === 'company' ? 'default' : 'outline'}
            onClick={() => setSelectedEventType('company')}
            size="sm"
            className={selectedEventType === 'company' 
              ? 'bg-white text-black' 
              : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }
          >
            Company Events
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalEvents}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Building className="w-4 h-4" />
              HTW Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{htwEvents}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Company Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{companyEvents}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Attendees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalAttendees}</div>
          </CardContent>
        </Card>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold text-white line-clamp-1">
                  {event.name}
                </CardTitle>
                <Badge className={`${getEventTypeColor(event.event_type)} text-xs`}>
                  {event.event_type.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Calendar className="w-4 h-4" />
                {formatDate(event.event_date)}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {event.description && (
                <p className="text-white/80 text-sm line-clamp-2">{event.description}</p>
              )}
              
              <div className="space-y-2">
                {event.location && (
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Building className="w-4 h-4" />
                  {event.event_type === 'htw' ? 'HTW Organized' : event.companies?.name || 'External Company'}
                </div>
                
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Users className="w-4 h-4" />
                  {event.attendee_count || 0} attendees
                </div>
              </div>

              {event.organizer_name && (
                <div className="text-white/70 text-sm">
                  <span className="font-medium">Organizer:</span> {event.organizer_name}
                </div>
              )}

              {event.promotion_channels && event.promotion_channels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {event.promotion_channels.map((channel, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs bg-white/5 border-white/20 text-white/70"
                    >
                      {channel}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredEvents.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Calendar className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No events found</h3>
            <p className="text-white/70">
              {searchTerm || selectedEventType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by uploading event data to track engagement opportunities'}
            </p>
          </div>
        )}
      </div>

      <BulkUploadDialog 
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        onSuccess={fetchEvents}
      />
    </div>
  );
};

export default Events;