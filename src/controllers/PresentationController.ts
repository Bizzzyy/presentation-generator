import { Request, Response } from 'express';
import { PresentationService } from '../services/PresentationService';
import { AIService } from '../services/AIService';
import path from 'path';
import fs from 'fs';

export class PresentationController {
  private presentationService: PresentationService;
  private aiService: AIService;

  constructor() {
    this.presentationService = new PresentationService();
    this.aiService = new AIService();
  }

  generatePresentation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { prompt, title } = req.body;

      if (!prompt) {
        res.status(400).json({
          success: false,
          error: { message: 'Prompt is required' }
        });
        return;
      }

      console.log('🎯 Generating presentation for prompt:', prompt);

      // Generate content using AI
      const slideContent = await this.aiService.generateSlideContent(prompt, title);
      
      // Create presentation
      const filename = await this.presentationService.createPresentation(
        slideContent, 
        title || 'Account Management Presentation'
      );

      res.json({
        success: true,
        data: {
          filename,
          downloadUrl: `/api/presentations/download/${filename}`,
          message: 'Presentation generated successfully'
        }
      });

    } catch (error) {
      console.error('Error generating presentation:', error);
      res.status(500).json({
        success: false,
        error: { 
          message: error instanceof Error ? error.message : 'Failed to generate presentation'
        }
      });
    }
  };

  downloadPresentation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { filename } = req.params;
      const filePath = path.join(__dirname, '../../uploads', filename);

      if (!fs.existsSync(filePath)) {
        res.status(404).json({
          success: false,
          error: { message: 'File not found' }
        });
        return;
      }

      res.download(filePath, filename, (err) => {
        if (err) {
          console.error('Download error:', err);
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              error: { message: 'Failed to download file' }
            });
          }
        }
      });

    } catch (error) {
      console.error('Error downloading presentation:', error);
      res.status(500).json({
        success: false,
        error: { 
          message: error instanceof Error ? error.message : 'Failed to download presentation'
        }
      });
    }
  };
}
