#!/bin/bash

# Presentation Generator Startup Script
echo "🎯 Starting Presentation Generator..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating one from template..."
    cp .env.example .env
    echo "📝 Please edit .env file and add your OpenAI API key before running the application."
    echo "   You can get an API key from: https://platform.openai.com/api-keys"
    exit 1
fi

# Check if OpenAI API key is set
if ! grep -q "^OPENAI_API_KEY=sk-" .env; then
    echo "⚠️  OpenAI API key not found or invalid in .env file."
    echo "📝 Please edit .env file and add your OpenAI API key:"
    echo "   OPENAI_API_KEY=sk-your-key-here"
    echo "   You can get an API key from: https://platform.openai.com/api-keys"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd client && npm install && cd ..
fi

# Create uploads directory if it doesn't exist
mkdir -p uploads

echo "🚀 Starting development servers..."
echo "   - Backend: http://localhost:3001"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "🎨 Open http://localhost:3000 in your browser to start generating presentations!"
echo ""

# Start both servers
npm run dev
