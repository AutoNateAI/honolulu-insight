import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BulkUploadDialog({ 
  open, 
  onOpenChange, 
  onSuccess 
}: BulkUploadDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV must have at least a header row and one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const expectedHeaders = ['name', 'description', 'member_count', 'company_count', 'growth_rate', 'color', 'icon'];
      
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      const industries = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < headers.length) continue;
        
        const industry = {
          name: values[headers.indexOf('name')],
          description: values[headers.indexOf('description')],
          member_count: parseInt(values[headers.indexOf('member_count')]) || 0,
          company_count: parseInt(values[headers.indexOf('company_count')]) || 0,
          growth_rate: parseFloat(values[headers.indexOf('growth_rate')]) || 0,
          color: values[headers.indexOf('color')] || '#1E88E5',
          icon: values[headers.indexOf('icon')] || '🏢',
        };

        industries.push(industry);
      }

      const { error } = await supabase
        .from('industries')
        .insert(industries);

      if (error) throw error;

      toast({
        title: "Success!",
        description: `${industries.length} industries uploaded successfully.`,
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error uploading CSV:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload CSV file.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = [
      'name,description,member_count,company_count,growth_rate,color,icon',
      'Technology,Software and hardware development,398,52,15.8,#1E88E5,💻',
      'Healthcare,Medical services and biotechnology,445,67,12.1,#4CAF50,🏥'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'industries_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-card border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Bulk Upload Industries</DialogTitle>
          <DialogDescription className="text-white/70">
            Upload multiple industries at once using a CSV file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="bg-blue-500/20 border-blue-500/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-white">
              <strong>Required CSV columns:</strong> name, description, member_count, company_count, growth_rate, color, icon
            </AlertDescription>
          </Alert>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-ocean-primary bg-ocean-primary/10' 
                : 'border-white/30 hover:border-white/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-white/60 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Drop your CSV file here
            </h3>
            <p className="text-white/70 mb-4">
              or click to browse your files
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <FileText className="mr-2 h-4 w-4" />
              Select CSV File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={downloadTemplate}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV Template
            </Button>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}