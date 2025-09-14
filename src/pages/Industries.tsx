import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  TrendingUp, 
  Building, 
  Users, 
  Download, 
  Plus,
  Upload,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { IndustryDialog } from '@/components/IndustryDialog';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const { toast } = useToast();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [industryToDelete, setIndustryToDelete] = useState<Industry | null>(null);

  useEffect(() => {
    fetchIndustries();
  }, []);

  const fetchIndustries = async () => {
    try {
      // Fetch industries with updated counts from database
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

  const handleAddIndustry = () => {
    setSelectedIndustry(null);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEditIndustry = (industry: Industry) => {
    setSelectedIndustry(industry);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteIndustry = (industry: Industry) => {
    setIndustryToDelete(industry);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!industryToDelete) return;

    try {
      const { error } = await supabase
        .from('industries')
        .delete()
        .eq('id', industryToDelete.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Industry deleted successfully.",
      });

      fetchIndustries();
    } catch (error) {
      console.error('Error deleting industry:', error);
      toast({
        title: "Error",
        description: "Failed to delete industry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setIndustryToDelete(null);
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
          <Button 
            onClick={handleAddIndustry}
            className="bg-gradient-to-r from-ocean-primary to-sunset-primary text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Industry
          </Button>
          <Button 
            onClick={() => setBulkUploadOpen(true)}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Total Members</p>
                <p className="text-2xl font-bold text-white">{totalMembers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-ocean-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Total Companies</p>
                <p className="text-2xl font-bold text-white">{totalCompanies.toLocaleString()}</p>
              </div>
              <Building className="h-8 w-8 text-sunset-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Active Industries</p>
                <p className="text-2xl font-bold text-white">{industries.length}</p>
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
              className="glass-card border-white/20 backdrop-blur-xl bg-transparent hover:scale-105 transition-all duration-200 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{industry.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white group-hover:text-ocean-primary transition-colors">
                        {industry.name}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={industry.growth_rate > 10 ? "default" : industry.growth_rate > 5 ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {industry.growth_rate > 0 ? '+' : ''}{industry.growth_rate}%
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem onClick={() => handleEditIndustry(industry)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteIndustry(industry)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardDescription className="text-sm text-white/70">
                  {industry.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Members</span>
                    <span className="font-semibold text-white">{industry.member_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Companies</span>
                    <span className="font-semibold text-white">{industry.company_count.toLocaleString()}</span>
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
        <Card className="glass-card border-white/20 backdrop-blur-xl bg-transparent">
          <CardContent className="p-8 text-center">
            <p className="text-white/70">No industries found matching your search.</p>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <IndustryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        industry={selectedIndustry}
        onSuccess={fetchIndustries}
        mode={dialogMode}
      />

      <BulkUploadDialog
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        onSuccess={fetchIndustries}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="glass-card border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Industry</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete "{industryToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}