#!/bin/bash

# NextStep Monorepo Setup Script
echo "🚀 Setting up NextStep Monorepo..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Create backend virtual environment
echo "🐍 Setting up Python virtual environment..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "📦 Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔧 Creating backend environment file..."
    cp env.example .env
    echo "⚠️  Please edit backend/.env with your configuration"
fi

# Run migrations
echo "🗄️  Running database migrations..."
python manage.py migrate

echo "✅ Backend setup complete!"
cd ..

# Create frontend environment file
echo "🔧 Creating frontend environment file..."
cd frontend
if [ ! -f ".env" ]; then
    cat > .env << EOF
# Django Backend API Configuration
VITE_API_URL=http://localhost:8000

# Frontend Configuration
VITE_APP_NAME=NextStep
VITE_APP_VERSION=1.0.0
EOF
    echo "✅ Frontend environment file created"
fi
cd ..

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Start the backend:"
echo "   cd backend && source venv/bin/activate && python manage.py runserver"
echo ""
echo "2. Start the frontend (in a new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Or run both from the root directory:"
echo "   npm run dev"
echo ""
echo "4. Create a superuser (optional):"
echo "   cd backend && source venv/bin/activate && python manage.py createsuperuser"
echo ""
echo "🌐 Backend will be available at: http://localhost:8000"
echo "🌐 Frontend will be available at: http://localhost:5173"
echo ""
echo "📚 See README.md for more detailed instructions" 