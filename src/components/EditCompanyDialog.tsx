import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Company {
  id: string;
  name: string;
  website?: string;
  island?: string;
  location?: string;
  industry_id?: string;
  member_count: number;
  engagement_level: string;
  company_size?: string;
  employee_count?: number;
}

interface EditCompanyDialogProps {
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  website: string;
  island: string;
  location: string;
  engagement_level: string;
  company_size: string;
  employee_count: number;
}

export function EditCompanyDialog({ company, open, onOpenChange, onSuccess }: EditCompanyDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      name: company?.name || '',
      website: company?.website || '',
      island: company?.island || '',
      location: company?.location || '',
      engagement_level: company?.engagement_level || 'Medium',
      company_size: company?.company_size || '',
      employee_count: company?.employee_count || 0,
    }
  });

  React.useEffect(() => {
    if (company) {
      reset({
        name: company.name,
        website: company.website || '',
        island: company.island || '',
        location: company.location || '',
        engagement_level: company.engagement_level,
        company_size: company.company_size || '',
        employee_count: company.employee_count || 0,
      });
    }
  }, [company, reset]);

  const onSubmit = async (data: FormData) => {
    if (!company) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: data.name,
          website: data.website || null,
          island: data.island || null,
          location: data.location || null,
          engagement_level: data.engagement_level,
          company_size: data.company_size || null,
          employee_count: data.employee_count,
        })
        .eq('id', company.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Company updated successfully',
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: 'Error',
        description: 'Failed to update company',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription className="text-slate-400">
            Update company information and details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              {...register('name', { required: true })}
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              {...register('website')}
              className="bg-slate-800 border-slate-600 text-white"
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="island">Island</Label>
              <Select
                value={watch('island')}
                onValueChange={(value) => setValue('island', value)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Select island" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="Oahu">Oahu</SelectItem>
                  <SelectItem value="Maui">Maui</SelectItem>
                  <SelectItem value="Big Island">Big Island</SelectItem>
                  <SelectItem value="Kauai">Kauai</SelectItem>
                  <SelectItem value="Molokai">Molokai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register('location')}
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="City/Area"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="engagement_level">Engagement Level</Label>
            <Select
              value={watch('engagement_level')}
              onValueChange={(value) => setValue('engagement_level', value)}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_size">Company Size</Label>
              <Select
                value={watch('company_size')}
                onValueChange={(value) => setValue('company_size', value)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="Startup">Startup (1-10)</SelectItem>
                  <SelectItem value="Small">Small (11-50)</SelectItem>
                  <SelectItem value="Medium">Medium (51-200)</SelectItem>
                  <SelectItem value="Large">Large (201-1000)</SelectItem>
                  <SelectItem value="Enterprise">Enterprise (1000+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee_count">Employee Count</Label>
              <Input
                id="employee_count"
                type="number"
                {...register('employee_count', { min: 0 })}
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}