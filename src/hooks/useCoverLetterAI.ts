import { useState, useCallback } from 'react';

export const useCoverLetterAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCoverLetter = useCallback(async (resumeData, jobDescription, options) => {
    setIsGenerating(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Extract keywords from job description
    const keywords = ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker'].filter(kw => 
      jobDescription.toLowerCase().includes(kw.toLowerCase())
    );
    
    const toneStarters = {
      professional: `I am writing to express my strong interest in the position. With my background in software development and proven track record of delivering high-quality solutions, I am confident in my ability to contribute effectively to your team.`,
      enthusiastic: `I am thrilled to apply for this position! As a passionate developer who has been following your company's innovative work, I am excited about the opportunity to bring my skills and energy to your team.`,
      formal: `Dear Hiring Manager, I wish to apply for the position at your company. Please accept this letter as my formal application.`,
      casual: `Hi there! I'm reaching out about this role. I think I'd be a great fit and would love to tell you why.`
    };

    const coverLetter = {
      personalInfo: {
        fullName: resumeData?.personalInfo?.fullName || 'Your Name',
        email: resumeData?.personalInfo?.email || '',
        phone: resumeData?.personalInfo?.phone || '',
        city: resumeData?.personalInfo?.location?.split(',')[0] || '',
        state: resumeData?.personalInfo?.location?.split(',')[1]?.trim() || '',
      },
      recipient: {
        company: 'Company Name',
        name: '',
        title: '',
      },
      jobDetails: {
        title: 'Position',
        description: jobDescription,
      },
      content: {
        greeting: 'Dear Hiring Manager,',
        opening: toneStarters[options.tone] || toneStarters.professional,
        body: `Throughout my career, I have developed expertise in technologies relevant to this role. My experience includes building scalable applications and solving complex technical challenges. I am particularly drawn to your company because of your commitment to innovation.\n\nIn my previous roles, I have consistently delivered results that exceeded expectations. These experiences have prepared me to make an immediate impact on your team.`,
        closing: `I would welcome the opportunity to discuss how my background and skills align with your needs. Thank you for considering my application.`,
        signature: resumeData?.personalInfo?.fullName || 'Your Name'
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        tone: options.tone,
        isTailored: true,
        keywords,
        matchScore: Math.floor(Math.random() * 20) + 75, // Random score 75-95%
      },
    };
    
    setIsGenerating(false);
    return coverLetter;
  }, []);

  return {
    generateCoverLetter,
    isGenerating,
  };
};
