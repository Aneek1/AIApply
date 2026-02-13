import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumeUploadWithBackend } from '@/components/features/ResumeUploadWithBackend';
import { JobDescriptionInputWithAI } from '@/components/features/JobDescriptionInputWithAI';
import { GenerationResults } from '@/components/features/GenerationResults';
import { ApplicationHistoryWithBackend } from '@/components/features/ApplicationHistoryWithBackend';
import { Sparkles, FileText, History, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { JobApplication, GenerationResult } from '@/types';
import { toast } from 'sonner';

export function DashboardPage() {
  const { user } = useAuth();
  const [resumeContent, setResumeContent] = useState('');
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [currentJobTitle, setCurrentJobTitle] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    setLoading(true);
    
    try {
      // Load resume
      const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (resumes && resumes.length > 0) {
        setResumeContent(resumes[0].original_content || '');
        setResumeUploaded(true);
      }

      // Load applications
      const { data: apps, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setApplications(apps || []);
      console.log('Loaded applications:', apps?.length);
      
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Failed to load your data');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = (resumeId: string, fileName: string, content: string) => {
    console.log('Resume uploaded:', fileName);
    setResumeContent(content);
    setResumeUploaded(true);
  };

  const handleGenerate = (applicationId: string, result: any) => {
    console.log('Application generated:', applicationId);
    setCurrentApplicationId(applicationId);
    setGenerationResult(result);
    
    // Reload applications to show the new one
    loadUserData();
  };

  const handleNewGeneration = () => {
    setGenerationResult(null);
    setCurrentJobTitle('');
    setCurrentCompany('');
    setCurrentApplicationId(null);
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const handleViewApplication = (app: JobApplication) => {
    setCurrentJobTitle(app.job_title);
    setCurrentCompany(app.company);
    setCurrentApplicationId(app.id);
    setGenerationResult({
      resume: app.generated_resume || '',
      coverLetter: app.generated_cover_letter || '',
      atsScore: app.ats_score || 0,
      matchedKeywords: app.matched_keywords || [],
      suggestions: app.suggestions || [],
    });
  };

  const handleUpdateApplicationStatus = async (status: 'pending' | 'generated' | 'applied') => {
    if (!currentApplicationId) return;

    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', currentApplicationId);

      if (error) throw error;

      toast.success(`Application marked as ${status}`);
      loadUserData();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          <p className="text-muted-foreground">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white">
      <div className="container py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.username}! 👋</h1>
          <p className="text-muted-foreground">
            Generate your next AI-optimized job application or review your application history
          </p>
        </div>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 gap-4">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-6">
            {!resumeUploaded ? (
              <div className="max-w-2xl mx-auto">
                <ResumeUploadWithBackend onUploadComplete={handleResumeUpload} />
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Your resume is securely stored and used only to generate optimized applications
                </p>
              </div>
            ) : generationResult ? (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Your AI-Generated Application</h2>
                  <Button onClick={handleNewGeneration} variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    New Application
                  </Button>
                </div>
                <GenerationResults
                  result={generationResult}
                  jobTitle={currentJobTitle}
                  company={currentCompany}
                />
                {currentApplicationId && (
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Application Status</h3>
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateApplicationStatus('pending')}
                      >
                        Mark as Pending
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateApplicationStatus('generated')}
                      >
                        Mark as Generated
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleUpdateApplicationStatus('applied')}
                      >
                        Mark as Applied
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6">
                <JobDescriptionInputWithAI
                  onGenerate={handleGenerate}
                  resumeContent={resumeContent}
                />
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Application History</h2>
              <p className="text-muted-foreground">
                Track all your AI-generated applications and their ATS scores
              </p>
            </div>
            <ApplicationHistoryWithBackend
              applications={applications}
              onDelete={handleDeleteApplication}
              onView={handleViewApplication}
            />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Username</label>
                    <div className="p-3 bg-muted rounded-lg">{user?.username}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <div className="p-3 bg-muted rounded-lg">{user?.email}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Resume Status</label>
                    <div className="p-3 bg-muted rounded-lg">
                      {resumeUploaded ? '✅ Resume Uploaded' : '❌ No Resume Uploaded'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Total Applications</label>
                    <div className="p-3 bg-muted rounded-lg">
                      {applications.length} application{applications.length !== 1 ? 's' : ''} generated
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
