#!/bin/bash

echo "🚀 Setting up NextStep Backend..."

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔧 Creating environment file..."
    cat > .env << EOF
SECRET_KEY=django-insecure-nextstep-dev-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
EOF
    echo "✅ Environment file created"
fi

# Run migrations
echo "🗄️  Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser if it doesn't exist
echo "👤 Creating superuser..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@nextstep.com').exists():
    User.objects.create_superuser('admin@nextstep.com', 'admin@nextstep.com', 'admin123')
    print('Superuser created: admin@nextstep.com / admin123')
else:
    print('Superuser already exists')
"

echo "✅ Backend setup complete!"
echo ""
echo "🌐 Start the backend with:"
echo "   cd backend && source venv/bin/activate && python manage.py runserver"
echo ""
echo "🔗 Backend will be available at: http://localhost:8000"
echo "🔗 Admin panel: http://localhost:8000/admin"
echo "   Username: admin@nextstep.com"
echo "   Password: admin123" 