#!/bin/bash

echo "🚀 Starting NextStep Full Stack Development Environment..."

# Check if setup has been run
if [ ! -d "backend/venv" ]; then
    echo "❌ Backend not set up. Running setup first..."
    ./setup_backend.sh
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Check if concurrently is installed
if ! npm list concurrently >/dev/null 2>&1; then
    echo "📦 Installing concurrently..."
    npm install concurrently
fi

echo "🌐 Starting both servers..."
echo "   Backend: http://127.0.0.1:8000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start both servers concurrently
npx concurrently \
    --names "backend,frontend" \
    --prefix-colors "blue,green" \
    "cd backend && source venv/bin/activate && python manage.py runserver 127.0.0.1:8000" \
    "cd frontend && npm run dev" 