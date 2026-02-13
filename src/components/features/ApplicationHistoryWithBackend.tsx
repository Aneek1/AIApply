import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Trash2 } from 'lucide-react';
import { JobApplication } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useState } from 'react';

interface ApplicationHistoryProps {
  applications: JobApplication[];
  onDelete: (id: string) => void;
  onView: (application: JobApplication) => void;
}

export function ApplicationHistoryWithBackend({ applications, onDelete, onView }: ApplicationHistoryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Application deleted');
      onDelete(id);
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to delete application');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'generated':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getATSScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-500';
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    return 'text-orange-600';
  };

  if (applications.length === 0) {
    return (
      <Card className="p-12 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
        <p className="text-muted-foreground">
          Generate your first AI-optimized job application to see it here
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold">{app.job_title}</h3>
                <Badge className={getStatusColor(app.status)} variant="outline">
                  {app.status}
                </Badge>
              </div>
              
              <p className="text-muted-foreground mb-3">{app.company}</p>
              
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Applied: </span>
                  <span className="font-medium">
                    {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </div>
                {app.ats_score && (
                  <div>
                    <span className="text-muted-foreground">ATS Score: </span>
                    <span className={`font-bold text-lg ${getATSScoreColor(app.ats_score)}`}>
                      {app.ats_score}%
                    </span>
                  </div>
                )}
              </div>

              {app.matched_keywords && app.matched_keywords.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {app.matched_keywords.slice(0, 5).map((keyword, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {app.matched_keywords.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{app.matched_keywords.length - 5} more
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView(app)}
              >
                <FileText className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(app.id)}
                disabled={deletingId === app.id}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deletingId === app.id ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
