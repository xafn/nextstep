<script>
    import {
        Briefcase,
        Users,
        TrendingUp,
        Shield,
        Star,
        Clock,
        DollarSign,
    } from "lucide-svelte";
</script>

<svelte:head>
    <title>NextStep - Your Path to Independence</title>
    <meta
        name="description"
        content="Find your first job, build skills, and gain independence. NextStep connects teenagers with opportunities that fit their schedule and goals."
    />
</svelte:head>

<!-- Navigation -->
<nav class="navbar">
    <div class="container">
        <div class="navbar-content">
            <div class="logo">NextStep</div>
            <div class="nav-links">
                <a href="#how-it-works">How It Works</a>
                <a href="#features">Features</a>
                <a href="#about">About</a>
                <a href="/auth/login" class="btn btn-outline">Login</a>
                <a href="/auth/signup" class="btn btn-primary">Sign Up</a>
            </div>
        </div>
    </div>
</nav>

<!-- Hero Section -->
<section class="hero">
    <div class="container">
        <h1>Your Path to Independence Starts Here</h1>
        <p>
            Find your first job, build real-world skills, and earn money while
            balancing school and life. NextStep connects ambitious teenagers
            with opportunities that fit their schedule.
        </p>
        <div
            style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;"
        >
            <a href="/auth/signup" class="btn btn-secondary"
                >Find Your First Job</a
            >
            <a href="#how-it-works" class="btn btn-outline">Learn More</a>
        </div>
    </div>
</section>

<!-- How It Works Section -->
<section id="how-it-works" class="features">
    <div class="container">
        <h2 style="text-align: center; margin-bottom: 1rem;">
            How NextStep Works
        </h2>
        <p
            style="text-align: center; font-size: 1.2rem; max-width: 600px; margin: 0 auto 3rem;"
        >
            Three simple steps to start your journey toward financial
            independence
        </p>

        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <Users size={24} />
                </div>
                <h3>1. Create Your Profile</h3>
                <p>
                    Sign up and build your teen-friendly profile. Highlight your
                    skills, interests, and availability. No experience required!
                </p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <Briefcase size={24} />
                </div>
                <h3>2. Discover Opportunities</h3>
                <p>
                    Browse through verified jobs and gigs that match your
                    schedule. Filter by location, pay rate, and job type.
                </p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <TrendingUp size={24} />
                </div>
                <h3>3. Apply & Grow</h3>
                <p>
                    Apply with confidence using our guided application process.
                    Build your resume and gain valuable experience.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section id="features" class="cta-section">
    <div class="container">
        <h2 style="text-align: center; margin-bottom: 1rem;">
            Why Choose NextStep?
        </h2>
        <p
            style="text-align: center; font-size: 1.2rem; max-width: 600px; margin: 0 auto 3rem;"
        >
            Built specifically for teenagers, by people who understand your
            needs
        </p>

        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <Shield size={24} />
                </div>
                <h3>Safe & Verified</h3>
                <p>
                    All employers are verified and jobs are screened for safety.
                    Your well-being is our top priority.
                </p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <Clock size={24} />
                </div>
                <h3>Flexible Scheduling</h3>
                <p>
                    Find jobs that work around your school schedule,
                    extracurricular activities, and family time.
                </p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <DollarSign size={24} />
                </div>
                <h3>Competitive Pay</h3>
                <p>
                    Earn fair wages for your work. We ensure all jobs offer
                    competitive pay rates for teenagers.
                </p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <Star size={24} />
                </div>
                <h3>Skill Building</h3>
                <p>
                    Gain real-world experience, develop professional skills, and
                    build your resume for future opportunities.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- About Section -->
<section id="about" class="features">
    <div class="container">
        <h2 style="text-align: center; margin-bottom: 1rem;">About NextStep</h2>
        <p
            style="text-align: center; font-size: 1.2rem; max-width: 800px; margin: 0 auto 3rem;"
        >
            We believe every teenager deserves the opportunity to gain
            independence, build confidence, and develop valuable life skills
            through meaningful work experiences. Our platform connects ambitious
            young people with employers who understand the unique needs and
            potential of teenage workers.
        </p>

        <div style="text-align: center; margin-top: 2rem;">
            <a
                href="/auth/signup"
                class="btn btn-primary"
                style="font-size: 1.1rem; padding: 1rem 2rem;"
                >Start Your Journey Today</a
            >
        </div>
    </div>
</section>

<!-- Footer -->
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h4>NextStep</h4>
                <p>
                    Empowering teenagers to build independence through
                    meaningful work experiences.
                </p>
            </div>

            <div class="footer-section">
                <h4>For Teens</h4>
                <a href="/auth/signup">Create Account</a>
                <a href="/jobs">Browse Jobs</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#features">Features</a>
            </div>

            <div class="footer-section">
                <h4>For Employers</h4>
                <a href="/employer/signup">Post a Job</a>
                <a href="/employer/about">About Hiring Teens</a>
                <a href="/employer/guidelines">Guidelines</a>
            </div>

            <div class="footer-section">
                <h4>Support</h4>
                <a href="/help">Help Center</a>
                <a href="/contact">Contact Us</a>
                <a href="/safety">Safety Guidelines</a>
                <a href="/privacy">Privacy Policy</a>
            </div>
        </div>

        <div
            style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 1rem;"
        >
            <p>
                &copy; 2024 NextStep. All rights reserved. Empowering the next
                generation of workers.
            </p>
        </div>
    </div>
</footer>
