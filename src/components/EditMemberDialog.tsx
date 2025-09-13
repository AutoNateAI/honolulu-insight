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

interface Member {
  id: string;
  name: string;
  email?: string;
  job_title?: string;
  island?: string;
  skills?: string[];
  linkedin_url?: string;
  github_url?: string;
  bio?: string;
  activity_level: string;
  events_attended: number;
}

interface EditMemberDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  email: string;
  job_title: string;
  island: string;
  linkedin_url: string;
  github_url: string;
  bio: string;
  activity_level: string;
  skills: string;
}

export function EditMemberDialog({ member, open, onOpenChange, onSuccess }: EditMemberDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      name: member?.name || '',
      email: member?.email || '',
      job_title: member?.job_title || '',
      island: member?.island || '',
      linkedin_url: member?.linkedin_url || '',
      github_url: member?.github_url || '',
      bio: member?.bio || '',
      activity_level: member?.activity_level || 'Medium',
      skills: member?.skills?.join(', ') || '',
    }
  });

  React.useEffect(() => {
    if (member) {
      reset({
        name: member.name,
        email: member.email || '',
        job_title: member.job_title || '',
        island: member.island || '',
        linkedin_url: member.linkedin_url || '',
        github_url: member.github_url || '',
        bio: member.bio || '',
        activity_level: member.activity_level,
        skills: member.skills?.join(', ') || '',
      });
    }
  }, [member, reset]);

  const onSubmit = async (data: FormData) => {
    if (!member) return;
    
    setLoading(true);
    try {
      const skillsArray = data.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const { error } = await supabase
        .from('members')
        .update({
          name: data.name,
          email: data.email || null,
          job_title: data.job_title || null,
          island: data.island || null,
          linkedin_url: data.linkedin_url || null,
          github_url: data.github_url || null,
          bio: data.bio || null,
          activity_level: data.activity_level,
          skills: skillsArray,
        })
        .eq('id', member.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Member updated successfully',
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating member:', error);
      toast({
        title: 'Error',
        description: 'Failed to update member',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription className="text-slate-400">
            Update member information and details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register('name', { required: true })}
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_title">Job Title</Label>
            <Input
              id="job_title"
              {...register('job_title')}
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>

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
            <Label htmlFor="activity_level">Activity Level</Label>
            <Select
              value={watch('activity_level')}
              onValueChange={(value) => setValue('activity_level', value)}
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

          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              type="url"
              {...register('linkedin_url')}
              className="bg-slate-800 border-slate-600 text-white"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              type="url"
              {...register('github_url')}
              className="bg-slate-800 border-slate-600 text-white"
              placeholder="https://github.com/username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              {...register('skills')}
              className="bg-slate-800 border-slate-600 text-white"
              placeholder="React, TypeScript, Node.js"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...register('bio')}
              className="bg-slate-800 border-slate-600 text-white"
              placeholder="Tell us about yourself..."
              rows={3}
            />
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