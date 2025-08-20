# 🎯 AI-Powered Presentation Generator with Office PowerPoint MCP Server

A sophisticated full-stack application that generates professional, visually stunning PowerPoint presentations using AI and the powerful **Office PowerPoint MCP Server v2.0**. Perfect for account management professionals, sales teams, and business executives who need high-quality presentations quickly.

## 🌟 Key Features

### 🚀 **Office PowerPoint MCP Server Integration**
- **32+ Professional Tools**: Complete PowerPoint manipulation with enterprise-grade capabilities
- **Built-in Slide Templates**: 25+ professional templates with dynamic features
- **Professional Design Themes**: Salesforce-inspired color schemes and layouts
- **Dynamic Content Adaptation**: Auto-sizing text, intelligent wrapping, visual effects
- **Enterprise Visual Effects**: Shadows, glows, gradients, and professional animations

### � **Advanced Presentation Generation**
- **AI-Powered Content**: OpenAI GPT-4 integration for intelligent slide content
- **Professional Templates**: Title slides, content layouts, metrics dashboards, and summaries
- **Salesforce Design System**: Modern blue theme with corporate styling
- **Visual Data Elements**: Charts, KPI cards, progress indicators, and infographics
- **Responsive Design**: Auto-adjusting layouts for different content types

### 💼 **Business-Focused Features**
- **Account Management Ready**: Templates designed for client presentations
- **Metrics Dashboards**: Professional KPI visualizations and performance tracking
- **Executive Summaries**: Structured takeaways and action item sections
- **Brand Consistency**: Consistent Salesforce-style color schemes and typography

## 🛠️ Technology Stack

### Backend
- **Node.js + Express**: RESTful API with TypeScript
- **Office PowerPoint MCP Server**: Professional PowerPoint generation engine
- **OpenAI GPT-4**: AI-powered content generation
- **Model Context Protocol**: Advanced PowerPoint manipulation via MCP

### Frontend
- **React + TypeScript**: Modern, responsive user interface
- **Material-UI**: Professional component library with clean design
- **Axios**: HTTP client for API communication

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.6+ for MCP PowerPoint Server
- pipx for Python application management

### 1. Clone the Repository
```bash
git clone https://github.com/Bizzzyy/presentation-generator.git
cd presentation-generator
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### 3. Install Office PowerPoint MCP Server
```bash
# Install pipx if not already installed
brew install pipx

# Install the MCP PowerPoint Server
pipx install office-powerpoint-mcp-server

# Ensure pipx is in PATH
pipx ensurepath
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
NODE_ENV=development
```

### 5. Start the Application
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run server:dev  # Backend on port 3001
npm run client:dev  # Frontend on port 3000
```

## 🎯 Usage Examples

### Business Presentation Prompts
```
"Create a quarterly business review presentation showing our SaaS platform's growth metrics, customer success stories, and expansion opportunities for 2025"

"Generate a proposal for our AI-powered customer analytics platform targeting enterprise retail clients, highlighting ROI and competitive advantages"

"Build a cybersecurity solution presentation focusing on threat detection capabilities and compliance benefits for financial services"
```

### Account Management Presentations
```
"Develop a customer success presentation showing platform adoption rates and expansion opportunities for our largest enterprise client"

"Create a renewal presentation demonstrating value delivered, upcoming enhancements, and strategic partnership benefits"

"Generate a digital transformation consulting presentation showcasing methodology and implementation frameworks"
```

## 🏗️ Architecture

### MCP PowerPoint Service
The application integrates with the Office PowerPoint MCP Server, providing:
- **32 Specialized Tools**: Organized into 11 modules covering all PowerPoint operations
- **Professional Templates**: Built-in slide layouts with dynamic features
- **Advanced Design Tools**: Themes, effects, fonts, and professional styling
- **Content Management**: Text, images, charts, tables, and multimedia elements

### API Endpoints
- `POST /api/presentations/generate` - Generate new presentation
- `GET /downloads/:filename` - Download generated presentation
- `GET /api/health` - Health check endpoint

## 🎨 Design Features

### Salesforce-Inspired Themes
- **Modern Blue**: Primary brand colors with professional gradients
- **Enterprise Layouts**: Clean headers, structured content sections
- **Professional Typography**: Salesforce-style fonts and sizing
- **Visual Hierarchy**: Clear information architecture and flow

### Advanced Visual Elements
- **KPI Dashboards**: Metrics cards with data visualizations
- **Professional Charts**: Column, bar, line, and pie charts
- **Interactive Elements**: Hover effects and professional animations
- **Brand Consistency**: Unified color schemes and styling

## 📊 Generated Presentation Structure

1. **Title Slide**: Professional header with gradient background
2. **Overview**: Key objectives and strategic approach
3. **Metrics Dashboard**: KPI visualizations and performance data
4. **Strategic Insights**: Data-driven recommendations
5. **Next Steps**: Implementation roadmap and follow-up actions

## 🚀 Development

### Building for Production
```bash
npm run build
```

### Testing the MCP Integration
```bash
# Test MCP server directly
ppt_mcp_server --help

# Check if MCP server is accessible
which ppt_mcp_server
```

## 📈 Features Roadmap

- [ ] Additional slide templates (comparison, timeline, team intro)
- [ ] Custom brand theme integration
- [ ] Presentation analytics and tracking
- [ ] Collaborative editing features
- [ ] Integration with CRM systems
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Office PowerPoint MCP Server](https://github.com/GongRzhe/Office-PowerPoint-MCP-Server) - Professional PowerPoint generation engine
- [OpenAI](https://openai.com/) - AI-powered content generation
- [Material-UI](https://mui.com/) - React component library
- Salesforce Design System - Inspiration for professional themes

---

**Made with ❤️ for account management professionals who need beautiful presentations, fast.**
