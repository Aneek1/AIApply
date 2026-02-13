export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  original_content: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  job_title: string;
  company: string;
  job_description: string;
  status: 'pending' | 'generated' | 'applied';
  ats_score: number | null;
  generated_resume: string | null;
  generated_cover_letter: string | null;
  matched_keywords: string[] | null;
  suggestions: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface GenerationResult {
  resume: string;
  coverLetter: string;
  atsScore: number;
  matchedKeywords: string[];
  suggestions: string[];
}
