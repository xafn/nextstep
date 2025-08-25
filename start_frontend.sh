#!/bin/bash

echo "🚀 Starting NextStep Frontend Server..."

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start the Vite development server
echo "🌐 Starting Vite development server..."
echo "   Frontend will be available at: http://localhost:5173"
echo "   Make sure the backend is running at http://127.0.0.1:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev 