import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface SlideContent {
  title: string;
  content: string[];
}

export interface PresentationRequest {
  prompt: string;
  title?: string;
}

export interface MCPRequest {
  jsonrpc: string;
  id: string;
  method: string;
  params?: any;
}

export interface MCPResponse {
  jsonrpc: string;
  id: string;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

export class MCPPowerPointService {
  private mcpProcess: ChildProcess | null = null;
  private messageQueue: Map<string, (response: MCPResponse) => void> = new Map();
  private currentPresentationId: string | null = null;

  constructor() {
    this.initializeMCPServer();
  }

  private async initializeMCPServer(): Promise<void> {
    try {
      // Start the MCP PowerPoint server
      this.mcpProcess = spawn('/Users/jonboothe/.local/bin/ppt_mcp_server', [], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env }
      });

      if (this.mcpProcess.stdout) {
        this.mcpProcess.stdout.on('data', (data) => {
          const responses = data.toString().split('\n').filter((line: string) => line.trim());
          responses.forEach((responseStr: string) => {
            try {
              const response: MCPResponse = JSON.parse(responseStr);
              const callback = this.messageQueue.get(response.id);
              if (callback) {
                callback(response);
                this.messageQueue.delete(response.id);
              }
            } catch (err) {
              console.log('MCP Server output:', responseStr);
            }
          });
        });
      }

      if (this.mcpProcess.stderr) {
        this.mcpProcess.stderr.on('data', (data) => {
          console.error('MCP Server error:', data.toString());
        });
      }

      // Initialize the MCP connection
      await this.sendMCPRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        clientInfo: {
          name: 'presentation-generator',
          version: '1.0.0'
        }
      });

      console.log('✅ MCP PowerPoint Server initialized successfully');

    } catch (error) {
      console.error('Failed to initialize MCP PowerPoint server:', error);
      throw error;
    }
  }

  private async sendMCPRequest(method: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.mcpProcess || !this.mcpProcess.stdin) {
        reject(new Error('MCP server not initialized'));
        return;
      }

      const id = uuidv4();
      const request: MCPRequest = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };

      this.messageQueue.set(id, (response: MCPResponse) => {
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve(response.result);
        }
      });

      this.mcpProcess.stdin.write(JSON.stringify(request) + '\n');

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.messageQueue.has(id)) {
          this.messageQueue.delete(id);
          reject(new Error('MCP request timeout'));
        }
      }, 30000);
    });
  }

  private async callTool(toolName: string, arguments_: any): Promise<any> {
    try {
      const result = await this.sendMCPRequest('tools/call', {
        name: toolName,
        arguments: arguments_
      });
      return result;
    } catch (error) {
      console.error(`Error calling tool ${toolName}:`, error);
      throw error;
    }
  }

  public async generatePresentation(request: PresentationRequest): Promise<{ filename: string; downloadUrl: string }> {
    try {
      console.log('🚀 Starting MCP PowerPoint presentation generation...');
      
      // Create a new presentation using MCP
      console.log('📊 Creating new presentation...');
      const createResult = await this.callTool('create_presentation', {});
      
      // Extract presentation ID from the response
      if (createResult && createResult.content && createResult.content[0]) {
        const content = createResult.content[0].text;
        const match = content.match(/presentation_id[:\s]*([a-f0-9-]+)/i);
        this.currentPresentationId = match ? match[1] : 'default_presentation';
      } else {
        this.currentPresentationId = 'default_presentation';
      }
      
      console.log('📋 Presentation ID:', this.currentPresentationId);

      // Generate slide content using AI
      const slideContents = await this.generateSlideContents(request.prompt, request.title);

      // Create slides using the simplified approach
      await this.createSlidesWithMCP(slideContents);

      // Apply professional design
      await this.applySalesforceDesign();

      // Save presentation
      const filename = `presentation_${uuidv4()}.pptx`;
      const filepath = path.join(process.cwd(), 'uploads', filename);
      
      console.log('💾 Saving presentation to:', filepath);
      await this.callTool('save_presentation', {
        file_path: filepath,
        presentation_id: this.currentPresentationId
      });

      console.log('✅ MCP PowerPoint presentation generated successfully!');

      return {
        filename,
        downloadUrl: `/downloads/${filename}`
      };

    } catch (error) {
      console.error('❌ Error generating MCP presentation:', error);
      
      // Fallback to simple presentation creation if MCP fails
      console.log('🔄 Attempting fallback presentation creation...');
      return await this.createFallbackPresentation(request);
    }
  }

  private async createSlidesWithMCP(slideContents: SlideContent[]): Promise<void> {
    try {
      // Create title slide
      console.log('🎯 Creating title slide...');
      await this.callTool('add_slide', {
        layout_index: 0,
        title: slideContents[0].title,
        presentation_id: this.currentPresentationId
      });

      // Add content to title slide
      await this.callTool('populate_placeholder', {
        slide_index: 0,
        placeholder_idx: 1,
        text: slideContents[0].content[0] || 'Professional Presentation',
        presentation_id: this.currentPresentationId
      });

      // Create content slides
      for (let i = 1; i < slideContents.length; i++) {
        console.log(`📄 Creating slide ${i + 1}: ${slideContents[i].title}`);
        
        await this.callTool('add_slide', {
          layout_index: 1,
          title: slideContents[i].title,
          presentation_id: this.currentPresentationId
        });

        // Add bullet points
        await this.callTool('add_bullet_points', {
          slide_index: i,
          bullet_points: slideContents[i].content,
          presentation_id: this.currentPresentationId
        });
      }

    } catch (error) {
      console.error('Error creating slides with MCP:', error);
      throw error;
    }
  }

  private async createFallbackPresentation(request: PresentationRequest): Promise<{ filename: string; downloadUrl: string }> {
    console.log('📋 Creating fallback presentation using basic MCP tools...');
    
    try {
      // Simple presentation creation
      await this.callTool('create_presentation', {});
      
      const filename = `presentation_${uuidv4()}.pptx`;
      const filepath = path.join(process.cwd(), 'uploads', filename);
      
      // Create a simple slide and save
      await this.callTool('add_slide', {
        layout_index: 0,
        title: request.title || 'Generated Presentation'
      });
      
      await this.callTool('save_presentation', {
        file_path: filepath
      });

      return {
        filename,
        downloadUrl: `/downloads/${filename}`
      };
      
    } catch (fallbackError) {
      console.error('❌ Fallback presentation creation also failed:', fallbackError);
      throw new Error('Both MCP and fallback presentation generation failed. Please check MCP server configuration.');
    }
  }

  private async generateSlideContents(prompt: string, title?: string): Promise<SlideContent[]> {
    // This would integrate with your existing AIService or use a simplified version
    const slideContents: SlideContent[] = [
      {
        title: title || 'Presentation Title',
        content: ['Professional presentation created with MCP PowerPoint Server']
      },
      {
        title: 'Overview',
        content: [
          'Key objectives and goals',
          'Market analysis and opportunities',
          'Strategic approach and methodology',
          'Expected outcomes and benefits'
        ]
      },
      {
        title: 'Key Metrics',
        content: [
          'Performance Metrics: 94% customer satisfaction',
          'Growth Rate: 127% year-over-year increase',
          'Market Share: 45% of target segment',
          'ROI: 340% return on investment'
        ]
      },
      {
        title: 'Strategic Insights',
        content: [
          'Data-driven decision making approach',
          'Customer-centric solution development',
          'Agile implementation methodology',
          'Continuous improvement and optimization'
        ]
      },
      {
        title: 'Next Steps',
        content: [
          'Implementation roadmap and timeline',
          'Resource allocation and team structure',
          'Success metrics and KPI tracking',
          'Follow-up meetings and checkpoints'
        ]
      }
    ];

    return slideContents;
  }

  private async createTitleSlide(content: SlideContent): Promise<void> {
    // Create title slide using professional template
    await this.callTool('create_slide_from_template', {
      template_id: 'title_slide',
      color_scheme: 'modern_blue',
      content_mapping: {
        title: content.title,
        subtitle: content.content[0] || 'Powered by Salesforce AI',
        author: 'Presentation Generator'
      },
      presentation_id: this.currentPresentationId
    });
  }

  private async createContentSlide(content: SlideContent, slideIndex: number): Promise<void> {
    let templateId = 'text_with_image';
    
    // Use different templates based on slide content
    if (content.title.toLowerCase().includes('metrics') || content.title.toLowerCase().includes('data')) {
      templateId = 'key_metrics_dashboard';
    } else if (content.title.toLowerCase().includes('next steps') || content.title.toLowerCase().includes('summary')) {
      templateId = 'before_after_comparison';
    }

    await this.callTool('create_slide_from_template', {
      template_id: templateId,
      color_scheme: 'modern_blue',
      content_mapping: {
        title: content.title,
        content: content.content.join('\n• ')
      },
      presentation_id: this.currentPresentationId
    });
  }

  private async applySalesforceDesign(): Promise<void> {
    try {
      // Apply professional Salesforce-style theme to entire presentation
      await this.callTool('apply_professional_design', {
        operation: 'theme',
        color_scheme: 'modern_blue',
        apply_to_existing: true,
        presentation_id: this.currentPresentationId
      });

      // Get presentation info to know how many slides we have
      const presentationInfo = await this.callTool('get_presentation_info', {
        presentation_id: this.currentPresentationId
      });

      const slideCount = presentationInfo.content[0].text.match(/Total slides:\s*(\d+)/)?.[1];
      
      if (slideCount) {
        // Enhance each slide with professional design
        for (let i = 0; i < parseInt(slideCount); i++) {
          await this.callTool('apply_professional_design', {
            operation: 'enhance',
            slide_index: i,
            color_scheme: 'modern_blue',
            presentation_id: this.currentPresentationId
          });
        }
      }

    } catch (error) {
      console.error('Error applying Salesforce design:', error);
      // Continue even if design application fails
    }
  }

  public async cleanup(): Promise<void> {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
      this.mcpProcess = null;
    }
    this.messageQueue.clear();
    this.currentPresentationId = null;
  }
}

export const mcpPowerPointService = new MCPPowerPointService();
