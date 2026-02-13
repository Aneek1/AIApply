import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Wand2, Loader2, Sparkles, Building2 } from 'lucide-react';
import { useCoverLetterAI } from '@/hooks/useCoverLetterAI';
import { CoverLetterPreview } from './CoverLetterPreview';
import { CoverLetterExport } from './CoverLetterExport';

export const CoverLetterBuilder = ({ resumeData }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [tone, setTone] = useState('professional');
  const [coverLetter, setCoverLetter] = useState(null);
  
  const { generateCoverLetter, isGenerating } = useCoverLetterAI();

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;
    
    const generated = await generateCoverLetter(resumeData, jobDescription, {
      tone,
      highlightRelevantExperience: true,
      includeSpecificAchievements: true,
      maxLength: 'medium',
    });
    
    if (generated) {
      if (companyName) generated.recipient.company = companyName;
      if (jobTitle) generated.jobDetails.title = jobTitle;
      setCoverLetter(generated);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input 
                  placeholder="e.g., Google"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input 
                  placeholder="e.g., Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Job Description</Label>
              <Textarea 
                placeholder="Paste the full job description here for AI tailoring..."
                className="h-48"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !jobDescription.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  AI is writing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {coverLetter?.metadata.isTailored && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">AI Optimization</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-blue-800">Match Score</span>
                <span className="text-2xl font-bold text-blue-900">
                  {coverLetter.metadata.matchScore}%
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {coverLetter.metadata.keywords.map((kw, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-800">
                    {kw}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        {coverLetter ? (
          <>
            <CoverLetterPreview data={coverLetter} />
            <CoverLetterExport data={coverLetter} />
          </>
        ) : (
          <Card className="h-96 flex items-center justify-center text-muted-foreground">
            <p>Fill in job details and generate your cover letter</p>
          </Card>
        )}
      </div>
    </div>
  );
};
