# NextStep - Job Platform Monorepo

A full-stack job platform designed for teenagers and employers, built with Django (backend) and SvelteKit (frontend).

## 🏗️ Architecture

- **Backend**: Django REST API with JWT authentication
- **Frontend**: SvelteKit with TypeScript and modern UI
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT tokens with refresh mechanism

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Python 3.8+
- pip (Python package manager)

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd nextstep

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Run database migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Create environment file
cp .env.example .env
# Edit .env and set VITE_API_URL=http://localhost:8000

# Start the frontend development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Run Both Services

From the root directory:

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run them separately
npm run dev:backend  # Terminal 1
npm run dev:frontend # Terminal 2
```

## 📁 Project Structure

```
nextstep/
├── backend/                 # Django backend
│   ├── apps/               # Django applications
│   │   ├── accounts/       # User authentication & profiles
│   │   └── resume/         # Resume management
│   ├── core/               # Django project settings
│   ├── manage.py           # Django management script
│   └── requirements.txt    # Python dependencies
├── frontend/               # SvelteKit frontend
│   ├── src/
│   │   ├── lib/           # Shared utilities
│   │   │   ├── api/       # API client & services
│   │   │   ├── components/# Reusable components
│   │   │   └── stores/    # State management
│   │   └── routes/        # Application routes
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
├── package.json            # Root package.json (monorepo)
└── README.md              # This file
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=NextStep
```

## 🗄️ Database

The project uses SQLite by default for development. To use PostgreSQL:

1. Install PostgreSQL and psycopg2
2. Update `backend/core/settings.py` with your database configuration
3. Run migrations: `python manage.py migrate`

## 🔐 Authentication

The platform uses JWT tokens for authentication:

- **Access Token**: Short-lived (1 hour) for API requests
- **Refresh Token**: Long-lived (7 days) for getting new access tokens
- **Automatic Refresh**: Frontend automatically refreshes expired tokens

## 🧪 Testing

```bash
# Frontend tests
cd frontend && npm run check

# Backend tests
cd backend && python manage.py test
```

## 🚀 Deployment

### Backend (Django)

1. Set `DEBUG=False` in production
2. Use a production database (PostgreSQL recommended)
3. Configure static files and media serving
4. Use Gunicorn or uWSGI as WSGI server
5. Set up reverse proxy (Nginx/Apache)

### Frontend (SvelteKit)

1. Build the project: `npm run build`
2. Deploy the `build/` directory
3. Configure your web server to serve the SPA

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/accounts/register/` - User registration
- `POST /api/accounts/login/` - User login
- `GET /api/accounts/me/` - Get current user profile
- `POST /api/accounts/token/refresh/` - Refresh access token

### Base URL

- Development: `http://localhost:8000`
- Production: `https://your-domain.com`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the logs for error messages
2. Ensure all dependencies are installed
3. Verify environment variables are set correctly
4. Check that both services are running
5. Open an issue with detailed error information

## 🔄 Development Workflow

1. **Backend First**: Start with Django backend development
2. **API Design**: Design and implement API endpoints
3. **Frontend Integration**: Connect frontend to backend APIs
4. **Testing**: Test both services together
5. **Iteration**: Refine based on testing results

## 🎯 Next Steps

- [ ] Implement job posting functionality
- [ ] Add resume builder features
- [ ] Create employer dashboard
- [ ] Add real-time notifications
- [ ] Implement search and filtering
- [ ] Add analytics and reporting 