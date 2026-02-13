import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ResumeUploadProps {
  onUploadComplete: (resumeId: string, fileName: string, content: string) => void;
}

export function ResumeUploadWithBackend({ onUploadComplete }: ResumeUploadProps) {
  const { user } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!user) {
      toast.error('Please sign in to upload a resume');
      return;
    }

    setUploading(true);
    console.log('Uploading file:', file.name);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Read file content for text extraction (simple approach)
      let content = '';
      if (file.type === 'text/plain') {
        content = await file.text();
      } else {
        content = `Resume file: ${file.name}. Content extraction from PDF/DOCX requires additional processing.`;
      }

      // Save resume record to database
      const { data: resume, error: dbError } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          original_content: content,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      console.log('Resume uploaded successfully:', resume);
      setUploadedFile(file.name);
      toast.success('Resume uploaded successfully!');
      onUploadComplete(resume.id, file.name, content);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  if (uploadedFile) {
    return (
      <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Resume Uploaded!</h3>
            <p className="text-muted-foreground mb-1">{uploadedFile}</p>
            <Button
              variant="link"
              className="text-sm"
              onClick={() => setUploadedFile(null)}
            >
              Upload Different File
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`p-8 border-2 border-dashed transition-colors ${
        dragActive
          ? 'border-purple-600 bg-purple-50'
          : 'border-gray-300 bg-white'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
          {uploading ? (
            <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
          ) : (
            <Upload className="h-8 w-8 text-purple-600" />
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
          <p className="text-muted-foreground">
            Drag and drop your resume here, or click to browse
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Supports PDF, DOCX, TXT (Max 10MB)
          </p>
        </div>

        <input
          type="file"
          id="resume-upload"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileInput}
          disabled={uploading}
        />
        
        <Button
          onClick={() => document.getElementById('resume-upload')?.click()}
          className="bg-gradient-to-r from-purple-600 to-blue-600"
          disabled={uploading}
        >
          <FileText className="mr-2 h-4 w-4" />
          {uploading ? 'Uploading...' : 'Choose File'}
        </Button>
      </div>
    </Card>
  );
}
