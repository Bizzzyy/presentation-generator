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
Create exactly 5 slides for a VISUALLY STUNNING professional presentation based on the user's prompt.

IMPORTANT: This presentation will include modern visual elements, charts, and graphics.

Guidelines:
- Target audience: Account management professionals in tech companies
- Style: Professional, data-driven, action-oriented, VISUALLY APPEALING
- Focus: Business value, metrics, relationships, growth opportunities
- Keep content concise and impactful for visual presentation
- Include relevant business frameworks when appropriate
- Content should work well with charts, graphics, and visual elements

Slide Structure:
1. Title slide - Compelling main title
2. Context/Problem slide - Current state analysis
3. Data/Metrics slide - Include quantifiable metrics and KPIs (this will have visual charts)
4. Solution/Strategy slide - Actionable recommendations
5. Next Steps slide - Clear action items and outcomes

Return a JSON array of exactly 5 slide objects, each with:
- title: Clear, compelling slide title (max 8 words)
- content: Array of 3-4 bullet points (max 12 words each, focus on impact)
- notes: Optional presenter notes for context

For the metrics slide (#3), focus on quantifiable data points and KPIs.
For the final slide (#5), focus on specific next steps and action items.
`;

      const userPrompt = `
Create a 5-slide presentation about: ${prompt}
${title ? `Presentation title: ${title}` : ''}

Focus on account management best practices with strong visual content including metrics, strategies, and actionable insights.
Make it suitable for a modern, graphically-rich presentation with charts and visual elements.
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
    console.log('🔄 Using enhanced visual slide template');
    
    return [
      {
        title: title || 'Strategic Account Management',
        content: [
          'Comprehensive approach to client relationship excellence',
          'Data-driven growth and retention strategies',
          'Technology-enabled business transformation',
          'Measurable outcomes and value delivery'
        ],
        notes: 'Introduction slide with compelling value proposition'
      },
      {
        title: 'Current State Assessment',
        content: [
          'Account portfolio health and segmentation analysis',
          'Performance benchmarks across key metrics',
          'Market opportunities and competitive positioning',
          'Risk factors and mitigation strategies'
        ],
        notes: 'Foundation analysis of current account status'
      },
      {
        title: 'Performance Metrics & KPIs',
        content: [
          'Revenue growth: 127% year-over-year increase',
          'Customer satisfaction: 94% retention rate',
          'Expansion rate: 340% net revenue retention',
          'Time to value: 45% reduction in onboarding'
        ],
        notes: 'Key performance indicators with visual charts and data visualization'
      },
      {
        title: 'Strategic Recommendations',
        content: [
          'AI-powered customer success automation',
          'Multi-touch engagement orchestration',
          'Predictive analytics for churn prevention',
          'Cross-functional collaboration frameworks'
        ],
        notes: 'Actionable recommendations with implementation roadmap'
      },
      {
        title: 'Next Steps & Action Plan',
        content: [
          'Implement advanced analytics dashboard',
          'Launch executive business review program',
          'Establish quarterly success metrics review',
          'Deploy automated engagement workflows'
        ],
        notes: 'Clear action items with ownership and timelines'
      }
    ];
  }
}
