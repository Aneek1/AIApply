import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FunctionsHttpError } from '@supabase/supabase-js';

interface JobDescriptionInputProps {
  onGenerate: (applicationId: string, result: any) => void;
  resumeContent: string;
}

export function JobDescriptionInputWithAI({ onGenerate, resumeContent }: JobDescriptionInputProps) {
  const { user } = useAuth();
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to generate applications');
      return;
    }

    if (jobTitle && company && description) {
      setIsGenerating(true);
      console.log('Generating application with AI for:', jobTitle, company);

      try {
        const { data, error } = await supabase.functions.invoke('generate-application', {
          body: {
            jobTitle,
            company,
            jobDescription: description,
            resumeContent,
          },
        });

        if (error) {
          let errorMessage = error.message;
          if (error instanceof FunctionsHttpError) {
            try {
              const statusCode = error.context?.status ?? 500;
              const textContent = await error.context?.text();
              errorMessage = `[Code: ${statusCode}] ${textContent || error.message || 'Unknown error'}`;
            } catch {
              errorMessage = `${error.message || 'Failed to generate application'}`;
            }
          }
          throw new Error(errorMessage);
        }

        console.log('Application generated successfully:', data);
        toast.success('Application generated successfully!');
        onGenerate(data.application.id, data.result);
        
        // Reset form
        setJobTitle('');
        setCompany('');
        setDescription('');
        
      } catch (error: any) {
        console.error('Generation error:', error);
        toast.error(error.message || 'Failed to generate application');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Job Details</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Paste the job posting details to generate your AI-optimized application
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="job-title">Job Title *</Label>
            <Input
              id="job-title"
              placeholder="e.g., Senior Product Manager"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company Name *</Label>
            <Input
              id="company"
              placeholder="e.g., TechCorp"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-description">Job Description *</Label>
          <Textarea
            id="job-description"
            placeholder="Paste the complete job description here..."
            className="min-h-[200px] resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Include requirements, responsibilities, and qualifications for best AI-optimized results
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          disabled={isGenerating || !jobTitle || !company || !description}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              AI is generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate with AI
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
