import PptxGenJS from 'pptxgenjs';
import { SlideContent } from './AIService';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export class PresentationService {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(__dirname, '../../uploads');
    this.ensureUploadsDirectory();
  }

  private ensureUploadsDirectory(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async createPresentation(slides: SlideContent[], presentationTitle: string): Promise<string> {
    try {
      console.log('📊 Creating PowerPoint presentation...');

      const pptx = new PptxGenJS();
      
      // Set presentation properties
      pptx.author = 'Presentation Generator';
      pptx.company = 'Account Management Pro';
      pptx.title = presentationTitle;
      
      // Define the professional color scheme and styling
      const theme = this.getProfessionalTheme();
      
      // Create slides
      slides.forEach((slideContent, index) => {
        if (index === 0) {
          this.createTitleSlide(pptx, slideContent, presentationTitle, theme);
        } else {
          this.createContentSlide(pptx, slideContent, theme);
        }
      });

      // Generate filename and save
      const filename = `presentation_${uuidv4()}.pptx`;
      const filePath = path.join(this.uploadsDir, filename);
      
      await pptx.writeFile({ fileName: filePath });
      
      console.log('✅ Presentation created successfully:', filename);
      return filename;

    } catch (error) {
      console.error('Error creating presentation:', error);
      throw new Error('Failed to create presentation');
    }
  }

  private getProfessionalTheme() {
    return {
      primary: '1f4e79',     // Professional blue
      secondary: '70ad47',   // Success green
      accent: 'ff6b35',      // Attention orange
      text: '2f2f2f',        // Dark gray
      lightGray: 'f2f2f2',   // Light background
      white: 'ffffff'
    };
  }

  private createTitleSlide(pptx: PptxGenJS, slideContent: SlideContent, presentationTitle: string, theme: any): void {
    const slide = pptx.addSlide();
    
    // Background color
    slide.background = { fill: theme.primary };

    // Main title
    slide.addText(presentationTitle, {
      x: 1,
      y: 2.5,
      w: 8,
      h: 1.5,
      fontSize: 44,
      bold: true,
      color: theme.white,
      align: 'center',
      fontFace: 'Calibri'
    });

    // Subtitle
    slide.addText('Account Management Excellence', {
      x: 1,
      y: 4.2,
      w: 8,
      h: 0.8,
      fontSize: 24,
      color: theme.lightGray,
      align: 'center',
      fontFace: 'Calibri'
    });

    // Date
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    slide.addText(today, {
      x: 1,
      y: 6,
      w: 8,
      h: 0.5,
      fontSize: 16,
      color: theme.lightGray,
      align: 'center',
      fontFace: 'Calibri'
    });
  }

  private createContentSlide(pptx: PptxGenJS, slideContent: SlideContent, theme: any): void {
    const slide = pptx.addSlide();
    
    // Slide background
    slide.background = { fill: theme.white };

    // Header bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 10,
      h: 0.8,
      fill: { color: theme.primary }
    });

    // Title
    slide.addText(slideContent.title, {
      x: 0.5,
      y: 0.1,
      w: 9,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: theme.white,
      align: 'left',
      fontFace: 'Calibri'
    });

    // Content bullets
    slideContent.content.forEach((bullet, index) => {
      slide.addText(`• ${bullet}`, {
        x: 1,
        y: 1.5 + (index * 0.8),
        w: 8,
        h: 0.6,
        fontSize: 20,
        color: theme.text,
        fontFace: 'Calibri',
        bullet: false // We're adding bullets manually for better control
      });
    });

    // Accent line at bottom
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 6.8,
      w: 9,
      h: 0.1,
      fill: { color: theme.secondary }
    });

    // Footer with slide number
    slide.addText('Account Management Pro', {
      x: 0.5,
      y: 7,
      w: 4,
      h: 0.3,
      fontSize: 12,
      color: theme.text,
      italic: true,
      fontFace: 'Calibri'
    });
  }
}
