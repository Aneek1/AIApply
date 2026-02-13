export interface CoverLetterData {
  id?: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  recipient: {
    name?: string;
    title?: string;
    company: string;
    address?: string;
    city?: string;
    state?: string;
  };
  jobDetails: {
    title: string;
    postingUrl?: string;
    description: string;
  };
  content: {
    greeting: string;
    opening: string;
    body: string;
    closing: string;
    signature: string;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    tone: 'professional' | 'enthusiastic' | 'formal' | 'casual';
    isTailored: boolean;
    keywords: string[];
    matchScore?: number;
  };
}

export type CoverLetterTone = 'professional' | 'enthusiastic' | 'formal' | 'casual';

export interface TailoringOptions {
  tone: CoverLetterTone;
  highlightRelevantExperience: boolean;
  includeSpecificAchievements: boolean;
  maxLength: 'short' | 'medium' | 'long';
}
