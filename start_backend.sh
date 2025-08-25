#!/bin/bash

echo "🚀 Starting NextStep Backend Server..."

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run setup_backend.sh first."
    echo "   ./setup_backend.sh"
    exit 1
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Check if Django is installed
if ! python -c "import django" 2>/dev/null; then
    echo "❌ Django not found. Please run setup_backend.sh first."
    echo "   ./setup_backend.sh"
    exit 1
fi

# Check if migrations are applied
echo "🗄️  Checking database migrations..."
python manage.py migrate --check 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Running pending migrations..."
    python manage.py migrate
fi

# Start the Django development server
echo "🌐 Starting Django development server..."
echo "   Backend will be available at: http://127.0.0.1:8000"
echo "   API Root: http://127.0.0.1:8000/"
echo "   Admin Panel: http://127.0.0.1:8000/admin"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python manage.py runserver 127.0.0.1:8000 