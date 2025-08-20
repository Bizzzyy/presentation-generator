# Presentation Generator

AI-powered presentation generator that creates professional 5-slide PowerPoint presentations from user prompts, specifically designed for account management professionals in tech companies.

## Features

- 🎯 AI-powered content generation
- 🎨 Professional design templates
- 📊 Account management focused layouts
- 💼 Tech industry optimized content
- 📱 Clean, intuitive web interface
- 📥 Direct PPT file download

## Quick Start

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

2. Run the startup script:
```bash
./start.sh
```

Or manually:

1. Install dependencies:
```bash
npm install
cd client && npm install && cd ..
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your_api_key_here
PORT=3001
NODE_ENV=development
```

4. Start the development servers:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, TypeScript, Material-UI
- **AI**: OpenAI GPT API
- **Presentation**: PptxGenJS
- **Styling**: Professional design system

## Usage

1. Enter your presentation topic/prompt
2. Click "Generate Presentation"
3. Download the generated PowerPoint file
4. Customize as needed

## Project Structure

```
presentation-generator/
├── src/                    # Backend source
├── client/                 # React frontend
├── dist/                   # Compiled backend
└── uploads/                # Temporary file storage
```
