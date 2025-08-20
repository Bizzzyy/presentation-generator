import OpenAI from 'openai';

export interface SlideContent {
  title: string;
  content: string[];
  notes?: string;
}

export class AIService {
  private openai: OpenAI | null = null;

  constructor() {
    // Initialize OpenAI client lazily to avoid startup errors
  }

  private getOpenAIClient(): OpenAI {
    if (!this.openai) {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
        throw new Error('Please set a valid OpenAI API key in your .env file. Get one from https://platform.openai.com/api-keys');
      }
      
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    return this.openai;
  }

  async generateSlideContent(prompt: string, title?: string): Promise<SlideContent[]> {
    try {
      console.log('🤖 Generating AI content for:', prompt);

      const systemPrompt = `
You are an expert presentation designer specializing in account management for tech companies. 
Create exactly 5 slides for a professional presentation based on the user's prompt.

Guidelines:
- Target audience: Account management professionals in tech companies
- Style: Professional, data-driven, action-oriented
- Focus: Business value, metrics, relationships, growth opportunities
- Keep content concise and impactful
- Include relevant business frameworks when appropriate

Return a JSON array of exactly 5 slide objects, each with:
- title: Clear, compelling slide title
- content: Array of 3-5 bullet points (max 15 words each)
- notes: Optional presenter notes for context

Ensure content is specific, actionable, and relevant to account management in tech.
`;

      const userPrompt = `
Create a 5-slide presentation about: ${prompt}
${title ? `Presentation title: ${title}` : ''}

Focus on account management best practices and include relevant metrics, strategies, and actionable insights.
`;

      const openai = this.getOpenAIClient();
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No content generated from AI service');
      }

      // Parse JSON response
      const slides = JSON.parse(responseContent) as SlideContent[];
      
      if (!Array.isArray(slides) || slides.length !== 5) {
        throw new Error('AI generated invalid slide structure');
      }

      console.log('✅ Generated 5 slides successfully');
      return slides;

    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Fallback to template slides if AI fails
      return this.getFallbackSlides(prompt, title);
    }
  }

  private getFallbackSlides(prompt: string, title?: string): SlideContent[] {
    console.log('🔄 Using fallback slide template');
    
    return [
      {
        title: title || 'Account Management Strategy',
        content: [
          'Strategic approach to client relationship management',
          'Focus on growth and retention metrics',
          'Alignment with business objectives',
          'Data-driven decision making'
        ],
        notes: 'Introduction slide setting the context for the presentation'
      },
      {
        title: 'Current State Analysis',
        content: [
          'Account portfolio overview and segmentation',
          'Performance metrics and KPIs',
          'Identified opportunities and challenges',
          'Market position and competitive landscape'
        ],
        notes: 'Baseline assessment of current account status'
      },
      {
        title: 'Strategic Recommendations',
        content: [
          'Prioritized growth opportunities',
          'Risk mitigation strategies',
          'Resource allocation optimization',
          'Technology and process improvements'
        ],
        notes: 'Core recommendations based on analysis'
      },
      {
        title: 'Implementation Roadmap',
        content: [
          'Phased approach with clear milestones',
          'Timeline and resource requirements',
          'Success metrics and KPIs',
          'Risk management and contingency plans'
        ],
        notes: 'Actionable plan for executing recommendations'
      },
      {
        title: 'Expected Outcomes & Next Steps',
        content: [
          'Projected impact on key metrics',
          'ROI and business value estimation',
          'Immediate action items',
          'Follow-up and review schedule'
        ],
        notes: 'Summary of expected results and next actions'
      }
    ];
  }
}
