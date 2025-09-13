import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Plus, Minus } from 'lucide-react';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface Company {
  name: string;
  website: string;
  location: string;
  island: string;
  company_size: string;
  engagement_level: string;
  industry_id: string;
}

interface Member {
  name: string;
  email: string;
  job_title: string;
  island: string;
  bio: string;
  linkedin_url: string;
  github_url: string;
  skills: string[];
  activity_level: string;
  company_id: string;
  industry_id: string;
}

export function BulkUploadDialog({ open, onOpenChange, onSuccess }: BulkUploadDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('companies');
  const [industries, setIndustries] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);

  // Company form data
  const [companyData, setCompanyData] = useState<Company[]>([{
    name: '',
    website: '',
    location: '',
    island: '',
    company_size: 'Small (1-50)',
    engagement_level: 'Medium',
    industry_id: ''
  }]);

  // Member form data
  const [memberData, setMemberData] = useState<Member[]>([{
    name: '',
    email: '',
    job_title: '',
    island: '',
    bio: '',
    linkedin_url: '',
    github_url: '',
    skills: [],
    activity_level: 'Medium',
    company_id: '',
    industry_id: ''
  }]);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchIndustries();
      fetchCompanies();
    }
  }, [open]);

  const fetchIndustries = async () => {
    const { data } = await supabase.from('industries').select('*');
    setIndustries(data || []);
  };

  const fetchCompanies = async () => {
    const { data } = await supabase.from('companies').select('*');
    setCompanies(data || []);
  };

  const addCompanyRow = () => {
    setCompanyData([...companyData, {
      name: '',
      website: '',
      location: '',
      island: '',
      company_size: 'Small (1-50)',
      engagement_level: 'Medium',
      industry_id: ''
    }]);
  };

  const removeCompanyRow = (index: number) => {
    if (companyData.length > 1) {
      setCompanyData(companyData.filter((_, i) => i !== index));
    }
  };

  const updateCompanyData = (index: number, field: keyof Company, value: string) => {
    const updated = [...companyData];
    updated[index] = { ...updated[index], [field]: value };
    setCompanyData(updated);
  };

  const addMemberRow = () => {
    setMemberData([...memberData, {
      name: '',
      email: '',
      job_title: '',
      island: '',
      bio: '',
      linkedin_url: '',
      github_url: '',
      skills: [],
      activity_level: 'Medium',
      company_id: '',
      industry_id: ''
    }]);
  };

  const removeMemberRow = (index: number) => {
    if (memberData.length > 1) {
      setMemberData(memberData.filter((_, i) => i !== index));
    }
  };

  const updateMemberData = (index: number, field: keyof Member, value: string | string[]) => {
    const updated = [...memberData];
    updated[index] = { ...updated[index], [field]: value };
    setMemberData(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (activeTab === 'companies') {
        const validCompanies = companyData.filter(company => 
          company.name.trim() && company.industry_id
        );
        
        if (validCompanies.length === 0) {
          throw new Error('Please fill in at least one company with name and industry');
        }

        const { error } = await supabase
          .from('companies')
          .insert(validCompanies);
        
        if (error) throw error;

        toast({
          title: "Success!",
          description: `${validCompanies.length} companies uploaded successfully.`,
        });
      } else {
        const validMembers = memberData.filter(member => 
          member.name.trim() && member.industry_id
        );
        
        if (validMembers.length === 0) {
          throw new Error('Please fill in at least one member with name and industry');
        }

        const { error } = await supabase
          .from('members')
          .insert(validMembers);
        
        if (error) throw error;

        toast({
          title: "Success!",
          description: `${validMembers.length} members uploaded successfully.`,
        });
      }

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error uploading data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] glass-card border-white/20 bg-gradient-to-br from-ocean-primary/80 via-sunset-primary/70 to-tropical-primary/80 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Upload Data
          </DialogTitle>
          <DialogDescription className="text-white/90">
            Upload companies and members data to the HTW network database.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/20 border border-white/30">
            <TabsTrigger 
              value="companies" 
              className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              Companies
            </TabsTrigger>
            <TabsTrigger 
              value="members"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="overflow-y-auto max-h-[50vh] space-y-4">
            {companyData.map((company, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 space-y-4 border border-white/20">
                <div className="flex justify-between items-center">
                  <Label className="text-white font-semibold">Company {index + 1}</Label>
                  {companyData.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCompanyRow(index)}
                      className="text-red-300 hover:text-red-100 hover:bg-red-500/20"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/90">Company Name *</Label>
                    <Input
                      value={company.name}
                      onChange={(e) => updateCompanyData(index, 'name', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Website</Label>
                    <Input
                      value={company.website}
                      onChange={(e) => updateCompanyData(index, 'website', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="https://company.com"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Location</Label>
                    <Input
                      value={company.location}
                      onChange={(e) => updateCompanyData(index, 'location', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="City, State"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Island</Label>
                    <Select value={company.island} onValueChange={(value) => updateCompanyData(index, 'island', value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Select island" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Oahu">Oahu</SelectItem>
                        <SelectItem value="Maui">Maui</SelectItem>
                        <SelectItem value="Big Island">Big Island</SelectItem>
                        <SelectItem value="Kauai">Kauai</SelectItem>
                        <SelectItem value="Molokai">Molokai</SelectItem>
                        <SelectItem value="Lanai">Lanai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/90">Company Size</Label>
                    <Select value={company.company_size} onValueChange={(value) => updateCompanyData(index, 'company_size', value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Small (1-50)">Small (1-50)</SelectItem>
                        <SelectItem value="Medium (51-200)">Medium (51-200)</SelectItem>
                        <SelectItem value="Large (201+)">Large (201+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/90">Industry *</Label>
                    <Select value={company.industry_id} onValueChange={(value) => updateCompanyData(index, 'industry_id', value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {industries.map((industry) => (
                          <SelectItem key={industry.id} value={industry.id}>
                            {industry.icon} {industry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addCompanyRow}
              className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Company
            </Button>
          </TabsContent>

          <TabsContent value="members" className="overflow-y-auto max-h-[50vh] space-y-4">
            {memberData.map((member, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 space-y-4 border border-white/20">
                <div className="flex justify-between items-center">
                  <Label className="text-white font-semibold">Member {index + 1}</Label>
                  {memberData.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMemberRow(index)}
                      className="text-red-300 hover:text-red-100 hover:bg-red-500/20"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/90">Name *</Label>
                    <Input
                      value={member.name}
                      onChange={(e) => updateMemberData(index, 'name', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Email</Label>
                    <Input
                      value={member.email}
                      onChange={(e) => updateMemberData(index, 'email', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Job Title</Label>
                    <Input
                      value={member.job_title}
                      onChange={(e) => updateMemberData(index, 'job_title', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      placeholder="Position title"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Island</Label>
                    <Select value={member.island} onValueChange={(value) => updateMemberData(index, 'island', value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Select island" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Oahu">Oahu</SelectItem>
                        <SelectItem value="Maui">Maui</SelectItem>
                        <SelectItem value="Big Island">Big Island</SelectItem>
                        <SelectItem value="Kauai">Kauai</SelectItem>
                        <SelectItem value="Molokai">Molokai</SelectItem>
                        <SelectItem value="Lanai">Lanai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/90">Company</Label>
                    <Select value={member.company_id} onValueChange={(value) => updateMemberData(index, 'company_id', value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/90">Industry *</Label>
                    <Select value={member.industry_id} onValueChange={(value) => updateMemberData(index, 'industry_id', value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {industries.map((industry) => (
                          <SelectItem key={industry.id} value={industry.id}>
                            {industry.icon} {industry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-white/90">Skills (comma-separated)</Label>
                  <Input
                    value={member.skills.join(', ')}
                    onChange={(e) => updateMemberData(index, 'skills', e.target.value.split(',').map(s => s.trim()))}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    placeholder="JavaScript, React, Node.js"
                  />
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addMemberRow}
              className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Member
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-white text-gray-900 hover:bg-white/90 font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {activeTab === 'companies' ? 'Companies' : 'Members'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}