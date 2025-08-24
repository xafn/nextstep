# NextStep - Your Path to Independence 🚀

A modern job board website specifically designed for teenagers, helping them find their first job, build skills, and gain financial independence. Built with SvelteKit and ready to connect with a Django backend.

## ✨ Features

### 🏠 Landing Page
- **Hero Section**: Compelling introduction to the platform
- **How It Works**: Step-by-step guide for new users
- **Features**: Highlighting safety, flexibility, and skill-building opportunities
- **About Section**: Mission and values explanation

### 🔐 Authentication System
- **User Registration**: Multi-step signup process with guided forms
- **Login System**: Secure authentication with password visibility toggle
- **Profile Building**: Collects skills, interests, availability, and goals

### 💼 Job Board
- **Job Listings**: Browse through teen-friendly opportunities
- **Smart Filtering**: Filter by job type, schedule, location, and pay range
- **Job Details**: Comprehensive job information with company ratings
- **Search Functionality**: Find jobs by keywords, company, or description

### 📝 Guided Application Process
- **5-Step Application**: Structured approach to job applications
- **Personal Information**: Contact details and basic info
- **Education & Experience**: Academic background and work history
- **Skills & Availability**: What you can offer and when you're available
- **Motivation**: Why you want the job and what you can contribute
- **Review & Submit**: Final review before submission

### 📊 User Dashboard
- **Application Tracking**: Monitor your job application status
- **Statistics**: View your application count and interview progress
- **Quick Actions**: Easy access to profile updates and job browsing

## 🛠️ Technology Stack

- **Frontend**: SvelteKit 5 + TypeScript
- **Styling**: CSS with CSS Variables for theming
- **Icons**: Lucide Svelte for consistent iconography
- **Fonts**: Inter and Poppins for modern typography
- **Backend**: Ready for Django integration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd teen-jobs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript and Svelte checks

## 📁 Project Structure

```
src/
├── app.css              # Global styles and CSS variables
├── app.html             # HTML template
├── routes/              # Application routes
│   ├── +layout.svelte   # Main layout with navigation
│   ├── +page.svelte     # Landing page
│   ├── auth/            # Authentication pages
│   │   ├── login/       # Login page
│   │   └── signup/      # Multi-step signup
│   ├── jobs/            # Job-related pages
│   │   ├── +page.svelte # Job board
│   │   └── apply/       # Job application process
│   └── dashboard/       # User dashboard
└── lib/                 # Shared components and utilities
```

## 🎯 Key Features Explained

### Multi-Step Signup Process
The signup process is designed to be teen-friendly and comprehensive:

1. **Basic Information**: Name, email, password
2. **Personal Details**: Birth date, phone, address
3. **Skills & Interests**: Select from predefined options
4. **Goals & Preferences**: Job preferences and career goals

### Job Application Wizard
The application process guides teenagers through creating a professional application:

1. **Personal Info**: Contact and basic details
2. **Education & Experience**: Academic and work background
3. **Skills & Availability**: What they can offer and when
4. **Motivation**: Why they want the job
5. **Review & Submit**: Final confirmation

### Smart Job Filtering
Users can filter jobs by:
- **Job Type**: Part-time, full-time, seasonal, gig
- **Schedule**: Flexible, after school, weekends, summer
- **Location**: City, neighborhood, remote options
- **Pay Range**: Hourly rates and compensation

## 🔌 Backend Integration

The application is designed to easily integrate with a Django backend:

### API Endpoints Needed
- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration
- `GET /api/jobs` - Fetch job listings
- `POST /api/applications` - Submit job applications
- `GET /api/applications` - User's application history

### Data Models
- **User**: Profile information, skills, preferences
- **Job**: Title, company, requirements, compensation
- **Application**: User-job relationship with status tracking
- **Company**: Business information and ratings

## 🎨 Design System

### Color Palette
- **Primary**: #6366f1 (Indigo)
- **Secondary**: #f59e0b (Amber)
- **Accent**: #10b981 (Emerald)
- **Background**: #ffffff (White)
- **Surface**: #f8fafc (Light Gray)

### Typography
- **Headings**: Poppins (Bold, Semi-bold)
- **Body**: Inter (Regular, Medium, Semi-bold)

### Components
- **Buttons**: Primary, secondary, and outline variants
- **Cards**: Consistent spacing and shadow system
- **Forms**: Accessible input fields with validation
- **Navigation**: Sticky header with responsive design

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured experience with side-by-side layouts
- **Tablet**: Optimized for medium screens
- **Mobile**: Touch-friendly interface with stacked layouts

## 🔒 Security Features

- **Age Verification**: Ensures users are at least 14 years old
- **Input Validation**: Client-side and server-side validation
- **Secure Forms**: Protected against common vulnerabilities
- **Privacy Focused**: Minimal data collection, clear privacy policy

## 🚧 Future Enhancements

- **Resume Builder**: Create professional resumes
- **Interview Prep**: Mock interviews and tips
- **Skill Assessments**: Evaluate and certify skills
- **Mentorship Program**: Connect with experienced professionals
- **Mobile App**: Native iOS and Android applications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the next generation of workers**

*NextStep - Empowering teenagers to build independence through meaningful work experiences.*
