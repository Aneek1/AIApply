import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const onspaceAiKey = Deno.env.get('ONSPACE_AI_API_KEY')!;
const onspaceAiBaseUrl = Deno.env.get('ONSPACE_AI_BASE_URL')!;

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { jobTitle, company, jobDescription, resumeContent } = await req.json();

    console.log('Generating application for:', jobTitle, company);

    // Call OnSpace AI to generate tailored resume and cover letter
    const aiResponse = await fetch(`${onspaceAiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${onspaceAiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume writer and career consultant. Your task is to analyze job descriptions and optimize resumes for ATS (Applicant Tracking Systems) and hiring managers. Always provide actionable, specific improvements.`
          },
          {
            role: 'user',
            content: `I need you to create a tailored resume and cover letter for the following job:

JOB TITLE: ${jobTitle}
COMPANY: ${company}

JOB DESCRIPTION:
${jobDescription}

MY CURRENT RESUME/BACKGROUND:
${resumeContent || 'No resume provided yet - please create a template highlighting key skills needed for this role'}

Please provide:
1. A tailored resume optimized for this specific job (highlight relevant experience, use keywords from job description)
2. A professional cover letter addressing the company and role
3. ATS score (0-100) - estimate how well this application matches the job requirements
4. List of matched keywords from the job description
5. 3-5 specific suggestions to improve the application

Return your response in this EXACT JSON format:
{
  "resume": "Full tailored resume text in markdown format",
  "coverLetter": "Full cover letter text",
  "atsScore": 85,
  "matchedKeywords": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`
          }
        ]
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('OnSpace AI error:', errorText);
      return new Response(
        JSON.stringify({ error: `AI generation failed: ${errorText}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices?.[0]?.message?.content ?? '';
    
    console.log('AI response received, length:', generatedContent.length);

    // Parse the JSON from AI response
    let result;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = generatedContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                        generatedContent.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : generatedContent;
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback: create structured response from unstructured content
      result = {
        resume: generatedContent,
        coverLetter: 'Please review the generated resume and provide a cover letter.',
        atsScore: 75,
        matchedKeywords: [],
        suggestions: ['Review the generated content and refine as needed']
      };
    }

    // Save to database
    const { data: application, error: dbError } = await supabase
      .from('job_applications')
      .insert({
        user_id: user.id,
        job_title: jobTitle,
        company: company,
        job_description: jobDescription,
        status: 'generated',
        ats_score: result.atsScore,
        generated_resume: result.resume,
        generated_cover_letter: result.coverLetter,
        matched_keywords: result.matchedKeywords,
        suggestions: result.suggestions,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: `Database error: ${dbError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Application saved successfully:', application.id);

    return new Response(
      JSON.stringify({
        success: true,
        application: application,
        result: result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
