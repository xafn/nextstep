@echo off
REM NextStep Monorepo Setup Script for Windows
echo 🚀 Setting up NextStep Monorepo...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

REM Create backend virtual environment
echo 🐍 Setting up Python virtual environment...
cd backend
if not exist "venv" (
    python -m venv venv
)

REM Activate virtual environment and install dependencies
echo 📦 Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo 🔧 Creating backend environment file...
    copy env.example .env
    echo ⚠️  Please edit backend\.env with your configuration
)

REM Run migrations
echo 🗄️  Running database migrations...
python manage.py migrate

echo ✅ Backend setup complete!
cd ..

REM Create frontend environment file
echo 🔧 Creating frontend environment file...
cd frontend
if not exist ".env" (
    echo # Django Backend API Configuration > .env
    echo VITE_API_URL=http://localhost:8000 >> .env
    echo. >> .env
    echo # Frontend Configuration >> .env
    echo VITE_APP_NAME=NextStep >> .env
    echo VITE_APP_VERSION=1.0.0 >> .env
    echo ✅ Frontend environment file created
)
cd ..

echo.
echo 🎉 Setup complete! Next steps:
echo.
echo 1. Start the backend:
echo    cd backend ^& venv\Scripts\activate.bat ^& python manage.py runserver
echo.
echo 2. Start the frontend (in a new terminal):
echo    cd frontend ^& npm run dev
echo.
echo 3. Or run both from the root directory:
echo    npm run dev
echo.
echo 4. Create a superuser (optional):
echo    cd backend ^& venv\Scripts\activate.bat ^& python manage.py createsuperuser
echo.
echo 🌐 Backend will be available at: http://localhost:8000
echo 🌐 Frontend will be available at: http://localhost:5173
echo.
echo 📚 See README.md for more detailed instructions
pause 