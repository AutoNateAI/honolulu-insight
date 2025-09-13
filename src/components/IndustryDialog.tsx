import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Loader2 } from 'lucide-react';

interface Industry {
  id?: string;
  name: string;
  description: string;
  member_count: number;
  company_count: number;
  growth_rate: number;
  color: string;
  icon: string;
}

interface IndustryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  industry?: Industry | null;
  onSuccess: () => void;
  mode: 'add' | 'edit';
}

const industryIcons = [
  { value: '🏨', label: '🏨 Hotel/Tourism' },
  { value: '🏥', label: '🏥 Healthcare' },
  { value: '💻', label: '💻 Technology' },
  { value: '💰', label: '💰 Finance' },
  { value: '🎓', label: '🎓 Education' },
  { value: '🏛️', label: '🏛️ Government' },
  { value: '🏠', label: '🏠 Real Estate' },
  { value: '🛍️', label: '🛍️ Retail' },
  { value: '🌾', label: '🌾 Agriculture' },
  { value: '🚛', label: '🚛 Transportation' },
  { value: '⚡', label: '⚡ Energy' },
  { value: '🏭', label: '🏭 Manufacturing' },
  { value: '🎬', label: '🎬 Media' },
  { value: '🔨', label: '🔨 Construction' },
  { value: '❤️', label: '❤️ Non-Profit' },
  { value: '🏢', label: '🏢 Other' },
];

const industryColors = [
  '#FF8A65', '#4CAF50', '#1E88E5', '#9C27B0', '#FF9800',
  '#795548', '#607D8B', '#E91E63', '#8BC34A', '#03A9F4',
  '#FFC107', '#673AB7', '#F44336', '#FF5722', '#2196F3'
];

export function IndustryDialog({ 
  open, 
  onOpenChange, 
  industry, 
  onSuccess, 
  mode 
}: IndustryDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Industry, 'id'>>({
    name: industry?.name || '',
    description: industry?.description || '',
    member_count: industry?.member_count || 0,
    company_count: industry?.company_count || 0,
    growth_rate: industry?.growth_rate || 0,
    color: industry?.color || industryColors[0],
    icon: industry?.icon || '🏢',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'add') {
        const { error } = await supabase
          .from('industries')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Industry added successfully.",
        });
      } else {
        const { error } = await supabase
          .from('industries')
          .update(formData)
          .eq('id', industry?.id);

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Industry updated successfully.",
        });
      }

      onOpenChange(false);
      onSuccess();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        member_count: 0,
        company_count: 0,
        growth_rate: 0,
        color: industryColors[0],
        icon: '🏢',
      });
    } catch (error) {
      console.error('Error saving industry:', error);
      toast({
        title: "Error",
        description: "Failed to save industry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-card border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">
            {mode === 'add' ? 'Add New Industry' : 'Edit Industry'}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {mode === 'add' 
              ? 'Create a new industry category for the HTW network.'
              : 'Update the industry information.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/90">Industry Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Technology"
                required
                className="glass-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon" className="text-white/90">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger className="glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {industryIcons.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white/90">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the industry"
              className="glass-input min-h-20"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="members" className="text-white/90">Members</Label>
              <Input
                id="members"
                type="number"
                value={formData.member_count}
                onChange={(e) => setFormData({ ...formData, member_count: parseInt(e.target.value) || 0 })}
                min="0"
                className="glass-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companies" className="text-white/90">Companies</Label>
              <Input
                id="companies"
                type="number"
                value={formData.company_count}
                onChange={(e) => setFormData({ ...formData, company_count: parseInt(e.target.value) || 0 })}
                min="0"
                className="glass-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="growth" className="text-white/90">Growth %</Label>
              <Input
                id="growth"
                type="number"
                step="0.1"
                value={formData.growth_rate}
                onChange={(e) => setFormData({ ...formData, growth_rate: parseFloat(e.target.value) || 0 })}
                className="glass-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/90">Color</Label>
            <div className="flex flex-wrap gap-2">
              {industryColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color 
                      ? 'border-white scale-110' 
                      : 'border-white/30 hover:border-white/60'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="bg-gradient-to-r from-ocean-primary to-sunset-primary text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                mode === 'add' ? 'Add Industry' : 'Update Industry'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}