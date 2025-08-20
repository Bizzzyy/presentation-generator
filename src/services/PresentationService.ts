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
        } else if (index === slides.length - 1) {
          this.createSummarySlide(pptx, slideContent, theme);
        } else if (index === 2) { // Middle slide gets special treatment
          this.createMetricsSlide(pptx, slideContent, theme);
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
      // Salesforce-inspired color palette
      salesforceBlue: '1589ee',      // Primary Salesforce blue
      salesforceDarkBlue: '0176d3',  // Darker Salesforce blue
      salesforceNavy: '032d60',      // Navy for headers
      salesforceLight: 'ecf0f1',     // Light background
      white: 'ffffff',
      
      // Accent colors for data and emphasis
      success: '04844b',             // Salesforce green
      warning: 'fe9339',             // Salesforce orange
      error: 'c23934',               // Salesforce red
      info: '1ab8f7',                // Light blue
      
      // Text colors
      textDark: '080707',            // Almost black
      textMedium: '444444',          // Medium gray
      textLight: '747474',           // Light gray
      
      // Additional enterprise colors
      enterprise: '6b46c1',          // Purple for enterprise
      innovation: '10b981',          // Teal for innovation
      growth: 'f59e0b'               // Amber for growth
    };
  }

  private createTitleSlide(pptx: PptxGenJS, slideContent: SlideContent, presentationTitle: string, theme: any): void {
    const slide = pptx.addSlide();
    
    // Clean white background (typical Salesforce style)
    slide.background = { fill: theme.white };

    // Large header section with Salesforce blue
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 10,
      h: 2.5,
      fill: { color: theme.salesforceBlue }
    });

    // Salesforce logo area (placeholder)
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 0.3,
      w: 1.5,
      h: 0.4,
      fill: { color: theme.white }
    });

    slide.addText('SALESFORCE', {
      x: 0.6,
      y: 0.35,
      w: 1.3,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: theme.salesforceBlue,
      fontFace: 'Arial'
    });

    // Main title - clean and professional
    slide.addText(presentationTitle.toUpperCase(), {
      x: 0.5,
      y: 3.5,
      w: 9,
      h: 1.2,
      fontSize: 42,
      bold: true,
      color: theme.textDark,
      align: 'left',
      fontFace: 'Arial'
    });

    // Subtitle with enterprise styling
    slide.addText('CONFIDENTIAL & PROPRIETARY', {
      x: 0.5,
      y: 4.8,
      w: 9,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: theme.textMedium,
      align: 'left',
      fontFace: 'Arial',
      charSpacing: 2
    });

    // Professional divider line
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 5.4,
      w: 3,
      h: 0.05,
      fill: { color: theme.salesforceBlue }
    });

    // Date and context
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    slide.addText(today, {
      x: 0.5,
      y: 5.7,
      w: 4,
      h: 0.4,
      fontSize: 14,
      color: theme.textLight,
      fontFace: 'Arial'
    });

    // Modern accent element (bottom right)
    slide.addShape(pptx.ShapeType.rect, {
      x: 7,
      y: 6.5,
      w: 2.5,
      h: 1,
      fill: { color: theme.salesforceLight }
    });

    // Brand consistency element
    slide.addShape(pptx.ShapeType.rect, {
      x: 8.5,
      y: 6.7,
      w: 0.8,
      h: 0.6,
      fill: { color: theme.success, transparency: 70 }
    });
  }

  private createContentSlide(pptx: PptxGenJS, slideContent: SlideContent, theme: any): void {
    const slide = pptx.addSlide();
    
    // Clean white background
    slide.background = { fill: theme.white };

    // Header with Salesforce branding
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 10,
      h: 1,
      fill: { color: theme.salesforceNavy }
    });

    // Salesforce logo area
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.3,
      y: 0.2,
      w: 1.2,
      h: 0.3,
      fill: { color: theme.white }
    });

    slide.addText('SALESFORCE', {
      x: 0.35,
      y: 0.25,
      w: 1.1,
      h: 0.2,
      fontSize: 10,
      bold: true,
      color: theme.salesforceBlue,
      fontFace: 'Arial'
    });

    // Title with professional styling
    slide.addText(slideContent.title.toUpperCase(), {
      x: 2,
      y: 0.2,
      w: 7.5,
      h: 0.6,
      fontSize: 24,
      bold: true,
      color: theme.white,
      align: 'left',
      fontFace: 'Arial'
    });

    // Content area with enterprise layout
    slideContent.content.forEach((bullet, index) => {
      const yPos = 1.8 + (index * 1);
      
      // Professional bullet container
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: yPos - 0.1,
        w: 9,
        h: 0.8,
        fill: { color: theme.salesforceLight, transparency: 40 },
        line: { width: 1, color: theme.salesforceBlue, transparency: 60 }
      });

      // Salesforce-style bullet point
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: yPos + 0.15,
        w: 0.2,
        h: 0.2,
        fill: { color: theme.salesforceBlue }
      });

      // Content text with enterprise font
      slide.addText(bullet, {
        x: 1.2,
        y: yPos,
        w: 8,
        h: 0.6,
        fontSize: 16,
        color: theme.textDark,
        fontFace: 'Arial',
        valign: 'middle'
      });

      // Subtle accent line
      slide.addShape(pptx.ShapeType.rect, {
        x: 1.2,
        y: yPos + 0.5,
        w: index === 0 ? 2.5 : index === 1 ? 3.2 : index === 2 ? 1.8 : 2.8, // Varied lengths
        h: 0.03,
        fill: { color: theme.success, transparency: 50 }
      });
    });

    // ROI/Value section (typical in Salesforce presentations)
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 6.2,
      w: 9,
      h: 0.8,
      fill: { color: theme.success, transparency: 15 }
    });

    slide.addText('💰 BUSINESS VALUE & ROI', {
      x: 0.7,
      y: 6.4,
      w: 4,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: theme.textDark,
      fontFace: 'Arial'
    });

    // Value indicators (common in Salesforce decks)
    const valueMetrics = ['↗ 25% Revenue Growth', '⚡ 40% Time Saved', '📈 98% Satisfaction'];
    valueMetrics.forEach((metric, i) => {
      slide.addText(metric, {
        x: 5.5 + (i * 1.4),
        y: 6.4,
        w: 1.3,
        h: 0.4,
        fontSize: 10,
        bold: true,
        color: theme.success,
        fontFace: 'Arial'
      });
    });

    // Footer with Salesforce styling
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 7.3,
      w: 10,
      h: 0.2,
      fill: { color: theme.salesforceBlue }
    });

    slide.addText('CONFIDENTIAL', {
      x: 0.3,
      y: 7.05,
      w: 2,
      h: 0.25,
      fontSize: 8,
      color: theme.textLight,
      fontFace: 'Arial'
    });
  }

  private createMetricsSlide(pptx: PptxGenJS, slideContent: SlideContent, theme: any): void {
    const slide = pptx.addSlide();
    
    // Clean white background
    slide.background = { fill: theme.white };

    // Salesforce header
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 10,
      h: 1,
      fill: { color: theme.salesforceNavy }
    });

    // Logo area
    slide.addText('SALESFORCE', {
      x: 0.3,
      y: 0.25,
      w: 1.5,
      h: 0.2,
      fontSize: 10,
      bold: true,
      color: theme.white,
      fontFace: 'Arial'
    });

    slide.addText(slideContent.title.toUpperCase(), {
      x: 2,
      y: 0.2,
      w: 7.5,
      h: 0.6,
      fontSize: 24,
      bold: true,
      color: theme.white,
      align: 'left',
      fontFace: 'Arial'
    });

    // Key metrics dashboard style
    const metrics = slideContent.content.slice(0, 4);
    
    metrics.forEach((metric, index) => {
      const xPos = 0.5 + (index % 2) * 4.7;
      const yPos = 1.8 + Math.floor(index / 2) * 2.4;
      
      // Metric card with Salesforce styling
      slide.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: yPos,
        w: 4.2,
        h: 2,
        fill: { color: theme.white },
        line: { width: 2, color: theme.salesforceBlue }
      });

      // Metric header bar
      slide.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: yPos,
        w: 4.2,
        h: 0.4,
        fill: { color: theme.salesforceBlue }
      });

      // Chart visualization (Salesforce style)
      const colors = [theme.salesforceBlue, theme.success, theme.warning, theme.enterprise];
      const barHeights = [0.8, 1.0, 0.6, 0.9];
      
      for (let i = 0; i < 3; i++) {
        slide.addShape(pptx.ShapeType.rect, {
          x: xPos + 0.3 + (i * 0.4),
          y: yPos + 1.8 - barHeights[i],
          w: 0.3,
          h: barHeights[i],
          fill: { color: colors[index % colors.length], transparency: i * 20 }
        });
      }

      // Large metric number (typical Salesforce KPI style)
      const metricNumbers = ['127%', '94%', '340%', '45%'];
      slide.addText(metricNumbers[index], {
        x: xPos + 2.2,
        y: yPos + 0.7,
        w: 1.8,
        h: 0.8,
        fontSize: 36,
        bold: true,
        color: colors[index % colors.length],
        align: 'center',
        fontFace: 'Arial'
      });

      // Metric description
      slide.addText(metric.replace(/^[^:]*:\s*/, ''), {
        x: xPos + 0.1,
        y: yPos + 0.5,
        w: 4,
        h: 0.3,
        fontSize: 12,
        bold: true,
        color: theme.textDark,
        fontFace: 'Arial'
      });
    });

    // Bottom insights section
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 6.5,
      w: 9,
      h: 0.8,
      fill: { color: theme.success, transparency: 20 }
    });

    slide.addText('🎯 EXECUTIVE SUMMARY', {
      x: 0.7,
      y: 6.7,
      w: 3,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: theme.textDark,
      fontFace: 'Arial'
    });

    slide.addText('Performance metrics demonstrate strong ROI and customer satisfaction across all key indicators', {
      x: 4,
      y: 6.7,
      w: 5.3,
      h: 0.4,
      fontSize: 12,
      color: theme.textMedium,
      fontFace: 'Arial'
    });
  }

  private createSummarySlide(pptx: PptxGenJS, slideContent: SlideContent, theme: any): void {
    const slide = pptx.addSlide();
    
    // Clean white background
    slide.background = { fill: theme.white };

    // Salesforce header with gradient
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 10,
      h: 1.5,
      fill: { color: theme.salesforceNavy }
    });

    // Logo area
    slide.addText('SALESFORCE', {
      x: 0.3,
      y: 0.3,
      w: 1.5,
      h: 0.2,
      fontSize: 10,
      bold: true,
      color: theme.white,
      fontFace: 'Arial'
    });

    slide.addText('EXECUTIVE SUMMARY', {
      x: 2,
      y: 0.4,
      w: 7.5,
      h: 0.7,
      fontSize: 30,
      bold: true,
      color: theme.white,
      align: 'left',
      fontFace: 'Arial'
    });

    // Key takeaways section
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 2,
      w: 9,
      h: 0.5,
      fill: { color: theme.salesforceBlue }
    });

    slide.addText('KEY TAKEAWAYS', {
      x: 0.7,
      y: 2.15,
      w: 3,
      h: 0.2,
      fontSize: 16,
      bold: true,
      color: theme.white,
      fontFace: 'Arial'
    });

    // Key points with Salesforce styling
    slideContent.content.slice(0, 4).forEach((point, index) => {
      const yPos = 2.8 + (index * 0.8);
      
      // Salesforce-style bullet point
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: yPos + 0.1,
        w: 0.15,
        h: 0.15,
        fill: { color: theme.salesforceBlue }
      });

      slide.addText(point.replace(/^[^:]*:\s*/, ''), {
        x: 1.1,
        y: yPos,
        w: 8.2,
        h: 0.6,
        fontSize: 14,
        color: theme.textDark,
        fontFace: 'Arial'
      });
    });

    // Next steps section
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 6,
      w: 4.2,
      h: 1.8,
      fill: { color: theme.success, transparency: 10 },
      line: { width: 2, color: theme.success }
    });

    slide.addText('NEXT STEPS', {
      x: 0.7,
      y: 6.2,
      w: 3.8,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: theme.success,
      fontFace: 'Arial'
    });

    const nextSteps = [
      '✓ Implementation roadmap',
      '✓ Stakeholder alignment',
      '✓ Success metrics tracking'
    ];

    nextSteps.forEach((step, index) => {
      slide.addText(step, {
        x: 0.8,
        y: 6.6 + (index * 0.3),
        w: 3.6,
        h: 0.25,
        fontSize: 12,
        color: theme.textDark,
        fontFace: 'Arial'
      });
    });

    // Contact section
    slide.addShape(pptx.ShapeType.rect, {
      x: 5.3,
      y: 6,
      w: 4.2,
      h: 1.8,
      fill: { color: theme.salesforceBlue, transparency: 10 },
      line: { width: 2, color: theme.salesforceBlue }
    });

    slide.addText('CONTACT', {
      x: 5.5,
      y: 6.2,
      w: 3.8,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: theme.salesforceBlue,
      fontFace: 'Arial'
    });

    slide.addText('Ready to discuss next steps? Let\'s schedule a follow-up meeting.', {
      x: 5.6,
      y: 6.6,
      w: 3.6,
      h: 0.8,
      fontSize: 12,
      color: theme.textDark,
      fontFace: 'Arial'
    });

    // Footer with Salesforce branding
    slide.addShape(pptx.ShapeType.line, {
      x: 0,
      y: 8.2,
      w: 10,
      h: 0,
      line: { width: 3, color: theme.salesforceBlue }
    });

    slide.addText('Thank you', {
      x: 0.5,
      y: 8.5,
      w: 9,
      h: 0.4,
      fontSize: 24,
      bold: true,
      color: theme.salesforceNavy,
      align: 'center',
      fontFace: 'Arial'
    });
  }
}
