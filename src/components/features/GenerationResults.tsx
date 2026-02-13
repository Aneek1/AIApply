import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Mail, TrendingUp, CheckCircle } from 'lucide-react';
import { GenerationResult } from '@/types';
import successIcon from '@/assets/success-icon.png';

interface GenerationResultsProps {
  result: GenerationResult;
  jobTitle: string;
  company: string;
}

export function GenerationResults({ result, jobTitle, company }: GenerationResultsProps) {
  const handleDownload = (type: 'resume' | 'coverLetter') => {
    console.log(`Downloading ${type} for ${jobTitle} at ${company}`);
    // Mock download - in real app, would generate and download PDF/DOCX
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-4">
          <img src={successIcon} alt="Success" className="w-16 h-16" />
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">Application Generated Successfully!</h3>
            <p className="text-muted-foreground">
              Your tailored resume and cover letter for <span className="font-semibold">{jobTitle}</span> at <span className="font-semibold">{company}</span> are ready.
            </p>
          </div>
        </div>
      </Card>

      {/* ATS Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-1">ATS Compatibility Score</h3>
            <p className="text-sm text-muted-foreground">
              How well your application matches the job requirements
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-purple-600" />
        </div>

        <div className="flex items-center gap-8">
          {/* Score Circle */}
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(result.atsScore / 100) * 351.86} 351.86`}
                className={getScoreColor(result.atsScore)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(result.atsScore)}`}>
                {result.atsScore}
              </span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>

          {/* Score Details */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-semibold ${getScoreColor(result.atsScore)}`}>
                  {getScoreLabel(result.atsScore)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your application is well-optimized for Applicant Tracking Systems
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {result.matchedKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm"
                >
                  <CheckCircle className="h-3 w-3" />
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Document Downloads */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Resume Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Tailored Resume</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Optimized for {jobTitle} position
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleDownload('resume')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload('resume')}
                >
                  <Download className="h-4 w-4 mr-1" />
                  DOCX
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Cover Letter Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Cover Letter</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Personalized for {company}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleDownload('coverLetter')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload('coverLetter')}
                >
                  <Download className="h-4 w-4 mr-1" />
                  DOCX
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Improvement Suggestions */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h4 className="font-semibold mb-3">💡 Suggestions to Improve Your Score</h4>
        <ul className="space-y-2">
          {result.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-blue-600 font-semibold">{index + 1}.</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
