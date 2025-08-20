import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Fade,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import {
  Slideshow,
  Download,
  AutoAwesome,
  BusinessCenter,
  TrendingUp
} from '@mui/icons-material';
import axios from 'axios';

interface GenerationResponse {
  success: boolean;
  data?: {
    filename: string;
    downloadUrl: string;
    message: string;
  };
  error?: {
    message: string;
  };
}

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResponse | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setResult({
        success: false,
        error: { message: 'Please enter a prompt for your presentation' }
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post<GenerationResponse>('/api/presentations/generate', {
        prompt: prompt.trim(),
        title: title.trim() || undefined
      });

      setResult(response.data);
    } catch (error) {
      console.error('Generation error:', error);
      setResult({
        success: false,
        error: { 
          message: axios.isAxiosError(error) 
            ? error.response?.data?.error?.message || 'Failed to generate presentation'
            : 'An unexpected error occurred'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result?.success && result.data?.downloadUrl) {
      window.location.href = result.data.downloadUrl;
    }
  };

  const examplePrompts = [
    "Create a visually compelling presentation about customer success metrics and retention strategies for enterprise SaaS clients",
    "Build a data-rich presentation on account expansion opportunities with visual KPIs and growth projections",
    "Design a presentation about AI-powered sales enablement tools with charts showing ROI and adoption metrics",
    "Generate a quarterly business review presentation with performance dashboards and strategic recommendations"
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
          <Slideshow sx={{ fontSize: 40, color: '#1f4e79' }} />
          <Typography variant="h2" component="h1" fontWeight="bold" color="#1f4e79">
            Presentation Generator
          </Typography>
        </Box>
        <Typography variant="h5" color="text.secondary" mb={1}>
          Create Visually Stunning AI-Powered Presentations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate professional 5-slide PowerPoint presentations with the powerful Office PowerPoint MCP Server - featuring 32+ advanced tools, professional templates, and enterprise-grade design capabilities
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesome color="primary" />
              Generate Your Presentation
            </Typography>
            
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
              <TextField
                fullWidth
                label="Presentation Title (Optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                placeholder="e.g., Q4 Account Review"
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Describe your presentation topic"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                margin="normal"
                placeholder="e.g., Create a presentation about customer retention strategies for our enterprise SaaS clients, focusing on reducing churn and increasing expansion revenue..."
                required
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading || !prompt.trim()}
                startIcon={loading ? <CircularProgress size={20} /> : <Slideshow />}
                sx={{ 
                  py: 2, 
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #1f4e79 30%, #4472c4 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1a4269 30%, #3d66b8 90%)',
                  }
                }}
              >
                {loading ? 'Generating Presentation...' : 'Generate Presentation'}
              </Button>
            </Box>

            {result && (
              <Fade in>
                <Box mt={3}>
                  {result.success ? (
                    <Alert 
                      severity="success" 
                      action={
                        <Button 
                          color="inherit" 
                          size="small" 
                          startIcon={<Download />}
                          onClick={handleDownload}
                        >
                          Download
                        </Button>
                      }
                    >
                      {result.data?.message || 'Presentation generated successfully!'}
                    </Alert>
                  ) : (
                    <Alert severity="error">
                      {result.error?.message || 'An error occurred'}
                    </Alert>
                  )}
                </Box>
              </Fade>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessCenter color="primary" />
                Features
              </Typography>
              <Box>
                <Chip label="Office PowerPoint MCP Server" size="small" sx={{ m: 0.5 }} />
                <Chip label="32+ Professional Tools" size="small" sx={{ m: 0.5 }} />
                <Chip label="Built-in Slide Templates" size="small" sx={{ m: 0.5 }} />
                <Chip label="Salesforce Design Themes" size="small" sx={{ m: 0.5 }} />
                <Chip label="Dynamic Content Adaptation" size="small" sx={{ m: 0.5 }} />
                <Chip label="Professional Visual Effects" size="small" sx={{ m: 0.5 }} />
                <Chip label="Enterprise-Grade Quality" size="small" sx={{ m: 0.5 }} />
                <Chip label="AI-Generated Content" size="small" sx={{ m: 0.5 }} />
              </Box>
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp color="primary" />
                Example Prompts
              </Typography>
              <Box>
                {examplePrompts.map((example, index) => (
                  <Typography 
                    key={index}
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 1, 
                      p: 1, 
                      backgroundColor: 'grey.50', 
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'grey.100' }
                    }}
                    onClick={() => setPrompt(example)}
                  >
                    "{example}"
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={6}>
        <Typography variant="body2" color="text.secondary">
          Powered by Office PowerPoint MCP Server v2.0 • Enterprise AI Presentation Generation
        </Typography>
      </Box>
    </Container>
  );
};

export default App;
