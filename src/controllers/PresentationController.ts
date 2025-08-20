import { Request, Response } from 'express';
import { mcpPowerPointService } from '../services/MCPPowerPointService';
import path from 'path';
import fs from 'fs/promises';

export class PresentationController {
  public async generatePresentation(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, title } = req.body;

      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: { message: 'Prompt is required and must be a non-empty string' }
        });
        return;
      }

      console.log('📊 Generating presentation with MCP PowerPoint Server...');
      console.log('📝 Prompt:', prompt);
      
      // Generate presentation using MCP PowerPoint Server
      const result = await mcpPowerPointService.generatePresentation({
        prompt: prompt.trim(),
        title: title?.trim()
      });

      // Verify file was created
      const filepath = path.join(process.cwd(), 'uploads', result.filename);
      try {
        await fs.access(filepath);
        console.log('✅ Presentation file created successfully:', result.filename);
      } catch (error) {
        console.error('❌ Generated file not found:', filepath);
        throw new Error('Presentation file was not created successfully');
      }

      res.json({
        success: true,
        data: {
          filename: result.filename,
          downloadUrl: result.downloadUrl,
          message: `Professional Salesforce-themed presentation created successfully using MCP PowerPoint Server! ${result.filename}`
        }
      });

    } catch (error) {
      console.error('❌ Error generating presentation:', error);
      
      res.status(500).json({
        success: false,
        error: { 
          message: error instanceof Error 
            ? `Failed to generate presentation: ${error.message}` 
            : 'An unexpected error occurred while generating the presentation'
        }
      });
    }
  }

  public async downloadPresentation(req: Request, res: Response): Promise<void> {
    try {
      const { filename } = req.params;
      
      if (!filename || typeof filename !== 'string') {
        res.status(400).json({
          success: false,
          error: { message: 'Filename is required' }
        });
        return;
      }

      const filepath = path.join(process.cwd(), 'uploads', filename);
      
      try {
        await fs.access(filepath);
      } catch (error) {
        res.status(404).json({
          success: false,
          error: { message: 'Presentation file not found' }
        });
        return;
      }

      res.download(filepath, filename, (error) => {
        if (error) {
          console.error('Download error:', error);
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              error: { message: 'Failed to download presentation' }
            });
          }
        }
      });

    } catch (error) {
      console.error('❌ Error downloading presentation:', error);
      
      res.status(500).json({
        success: false,
        error: { 
          message: error instanceof Error 
            ? `Failed to download presentation: ${error.message}` 
            : 'An unexpected error occurred while downloading the presentation'
        }
      });
    }
  }
}

export const presentationController = new PresentationController();
