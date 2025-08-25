<script>
	import {
		Briefcase,
		Users,
		TrendingUp,
		Shield,
		Star,
		Clock,
		DollarSign,
		ArrowRight,
		CheckCircle,
		Sparkles,
	} from "lucide-svelte";
	import { onMount } from "svelte";

	let mounted = false;
	let currentHeaderIndex = 0;
	let headers = [
		"Put the fries in the bag.",
		"Jobs bro... jobs...",
		"Time to get employed.",
	];

	onMount(() => {
		mounted = true;

		// Cycle through headers every 3 seconds
		const interval = setInterval(() => {
			currentHeaderIndex = (currentHeaderIndex + 1) % headers.length;
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>NextStep - Your Path to Independence</title>
	<meta
		name="description"
		content="Find your first job, build skills, and gain independence. NextStep connects teenagers with opportunities that fit their schedule and goals."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="hero">
	<div class="container">
		<div class="hero-content">
			<div class="hero-badge">
				<span>Your next step to employment 🌹</span>
			</div>
			<div class="hero-headers">
				{#each headers as header, index}
					<h1
						class="hero-header"
						class:active={currentHeaderIndex === index}
						class:animate-fade-in-up={mounted}
					>
						{header}
					</h1>
				{/each}
			</div>
			<p>
				Mow the lawn, flip some burgers, lead some campers, or any other
				job you can think of. Start earning your first dollar today,
				build your resume, and gain some real independence. It's time to
				become employed, twin.
			</p>
			<div class="hero-actions">
				<a href="/auth/signup" class="btn btn-secondary">
					Find Your First Job
					<ArrowRight size={20} />
				</a>
				<a href="#how-it-works" class="btn btn-outline">Learn More</a>
			</div>
			<div class="hero-stats">
				<div class="stat-item">
					<span class="stat-number">500+</span>
					<span class="stat-label">Jobs Available</span>
				</div>
				<div class="stat-item">
					<span class="stat-number">$15</span>
					<span class="stat-label">Avg. Hourly Rate</span>
				</div>
				<div class="stat-item">
					<span class="stat-number">95%</span>
					<span class="stat-label">Success Rate</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- How It Works Section -->
<section id="how-it-works" class="features">
	<div class="container">
		<div class="section-header">
			<h2>How NextStep Works</h2>
			<p>
				Three simple steps to start your journey toward financial
				independence
			</p>
		</div>

		<div class="feature-grid">
			<div
				class="feature-card"
				class:animate-fade-in-up={mounted}
				style="animation-delay: 0.1s"
			>
				<div class="feature-icon">
					<Users size={28} />
				</div>
				<div class="step-number">1</div>
				<h3>Create Your Profile</h3>
				<p>
					Sign up and build your teen-friendly profile. Highlight your
					skills, interests, and availability. No experience required!
				</p>
				<div class="feature-benefits">
					<div class="benefit-item">
						<CheckCircle size={16} />
						<span>Quick 5-minute setup</span>
					</div>
					<div class="benefit-item">
						<CheckCircle size={16} />
						<span>No experience needed</span>
					</div>
				</div>
			</div>

			<div
				class="feature-card"
				class:animate-fade-in-up={mounted}
				style="animation-delay: 0.2s"
			>
				<div class="feature-icon">
					<Briefcase size={28} />
				</div>
				<div class="step-number">2</div>
				<h3>Discover Opportunities</h3>
				<p>
					Browse through verified jobs and gigs that match your
					schedule. Filter by location, pay rate, and job type.
				</p>
				<div class="feature-benefits">
					<div class="benefit-item">
						<CheckCircle size={16} />
						<span>Curated teen-friendly jobs</span>
					</div>
					<div class="benefit-item">
						<CheckCircle size={16} />
						<span>Flexible scheduling options</span>
					</div>
				</div>
			</div>

			<div
				class="feature-card"
				class:animate-fade-in-up={mounted}
				style="animation-delay: 0.3s"
			>
				<div class="feature-icon">
					<TrendingUp size={28} />
				</div>
				<div class="step-number">3</div>
				<h3>Apply & Grow</h3>
				<p>
					Apply with confidence using our guided application process.
					Build your resume and gain valuable experience.
				</p>
				<div class="feature-benefits">
					<div class="benefit-item">
						<CheckCircle size={16} />
						<span>Guided application process</span>
					</div>
					<div class="benefit-item">
						<CheckCircle size={16} />
						<span>Resume building tools</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section id="features" class="cta-section">
	<div class="container">
		<div class="section-header">
			<h2>Why Choose NextStep?</h2>
			<p>
				Built specifically for teenagers, by people who understand your
				needs
			</p>
		</div>

		<div class="feature-grid">
			<div
				class="feature-card"
				class:animate-fade-in-up={mounted}
				style="animation-delay: 0.1s"
			>
				<div class="feature-icon">
					<Shield size={28} />
				</div>
				<h3>Safe & Verified</h3>
				<p>
					All employers are verified and jobs are screened for safety.
					Your well-being is our top priority.
				</p>
				<div class="feature-highlight">
					<span>100% Verified Employers</span>
				</div>
			</div>

			<div
				class="feature-card"
				class:animate-fade-in-up={mounted}
				style="animation-delay: 0.2s"
			>
				<div class="feature-icon">
					<Clock size={28} />
				</div>
				<h3>Flexible Scheduling</h3>
				<p>
					Find jobs that work around your school schedule,
					extracurricular activities, and family time.
				</p>
				<div class="feature-highlight">
					<span>Work on Your Terms</span>
				</div>
			</div>

			<div
				class="feature-card"
				class:animate-fade-in-up={mounted}
				style="animation-delay: 0.3s"
			>
				<div class="feature-icon">
					<DollarSign size={28} />
				</div>
				<h3>Competitive Pay</h3>
				<p>
					Earn fair wages for your work. We ensure all jobs offer
					competitive pay rates for teenagers.
				</p>
				<div class="feature-highlight">
					<span>Above Minimum Wage</span>
				</div>
			</div>

			<div
				class="feature-card"
				class:animate-fade-in-up={mounted}
				style="animation-delay: 0.4s"
			>
				<div class="feature-icon">
					<Star size={28} />
				</div>
				<h3>Skill Building</h3>
				<p>
					Gain real-world experience, develop professional skills, and
					build your resume for future opportunities.
				</p>
				<div class="feature-highlight">
					<span>Career Development</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- About Section -->
<section id="about" class="features">
	<div class="container">
		<div class="about-content">
			<div class="about-text">
				<h2>About NextStep</h2>
				<p>
					We believe every teenager deserves the opportunity to gain
					independence, build confidence, and develop valuable life
					skills through meaningful work experiences. Our platform
					connects ambitious young people with employers who
					understand the unique needs and potential of teenage
					workers.
				</p>
				<div class="about-stats">
					<div class="about-stat">
						<span class="stat-number">5+</span>
						<span class="stat-label">Years Experience</span>
					</div>
					<div class="about-stat">
						<span class="stat-number">50+</span>
						<span class="stat-label">Cities Served</span>
					</div>
					<div class="about-stat">
						<span class="stat-number">1000+</span>
						<span class="stat-label">Success Stories</span>
					</div>
				</div>
			</div>
			<div class="about-cta">
				<a
					href="/auth/signup"
					class="btn btn-primary"
					style="font-size: 1.1rem; padding: 1rem 2rem;"
				>
					Start Your Journey Today
					<ArrowRight size={20} />
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="footer">
	<div class="container">
		<div class="footer-content">
			<div class="footer-section">
				<h4>For Teens</h4>
				<a href="/auth/signup">Create Account</a>
				<a href="/jobs">Browse Jobs</a>
				<a href="/resume">Build Resume</a>
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

		<div class="footer-bottom">
			<p>
				&copy; 2025 NextStep. Made by Amaar, Krish, and Affan for
				RecessHacks 5.0.
			</p>
		</div>
	</div>
</footer>

<style>
	/* Hero Section Enhancements */
	.hero-content {
		text-align: center;
	}

	.hero-headers {
		position: relative;
		height: 4rem;
		margin-bottom: 1rem;
		overflow: hidden;
	}

	.hero-header {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		opacity: 0;
		transform: translateY(30px);
		transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
		font-size: 3rem;
		font-weight: 700;
		color: white;
		margin: 0;
		line-height: 1.2;
	}

	.hero-header.active {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-header:not(.active) {
		opacity: 0;
		transform: translateY(-30px);
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: var(--radius-2xl);
		padding: 0.5rem 1rem;
		margin-bottom: 2rem;
		backdrop-filter: blur(10px);
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.9);
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 3rem;
	}

	.hero-stats {
		display: flex;
		justify-content: center;
		gap: 3rem;
		flex-wrap: wrap;
	}

	.stat-item {
		text-align: center;
	}

	.stat-number {
		display: block;
		font-size: 2rem;
		font-weight: 700;
		color: white;
		margin-bottom: 0.25rem;
	}

	.stat-label {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.8);
	}

	/* Section Header Enhancements */
	.section-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.section-header h2 {
		margin-bottom: 1rem;
		color: var(--primary);
	}

	.section-header p {
		font-size: 1.2rem;
		max-width: 600px;
		margin: 0 auto;
	}

	/* Feature Card Enhancements */
	.feature-card {
		position: relative;
		padding-top: 1rem;
		overflow: visible;
	}

	.step-number {
		position: absolute;
		top: 0.5rem;
		right: 1.5rem;
		width: 2.5rem;
		height: 2.5rem;
		background: var(--secondary);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 1.1rem;
		box-shadow: var(--shadow-sm);
		z-index: 1;
	}

	.feature-benefits {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.benefit-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	.benefit-item svg {
		color: var(--accent);
		flex-shrink: 0;
	}

	.btn-outline {
		color: rgba(255, 255, 255);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.feature-highlight {
		margin-top: 1.5rem;
		padding: 0.5rem 1rem;
		background: var(--primary-light);
		color: var(--primary-dark);
		border-radius: var(--radius-md);
		font-size: 0.9rem;
		font-weight: 500;
		text-align: center;
	}

	/* About Section Enhancements */
	.about-content {
		text-align: center;
		max-width: 800px;
		margin: 0 auto;
	}

	.about-text h2 {
		margin-bottom: 1.5rem;
	}

	.about-text p {
		font-size: 1.1rem;
		margin-bottom: 2.5rem;
	}

	.about-stats {
		display: flex;
		justify-content: center;
		gap: 3rem;
		margin-bottom: 2.5rem;
		flex-wrap: wrap;
	}

	.about-stat {
		text-align: center;
	}

	.about-stat .stat-number {
		display: block;
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--primary);
		margin-bottom: 0.5rem;
	}

	.about-stat .stat-label {
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	.about-cta {
		margin-top: 2rem;
	}

	/* Footer Enhancements */
	.footer-bottom {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding-top: 1.5rem;
		text-align: center;
	}

	/* Responsive Enhancements */
	@media (max-width: 768px) {
		.hero-headers {
			height: 3rem;
		}

		.hero-header {
			font-size: 2rem;
		}

		.hero-stats {
			gap: 2rem;
		}

		.about-stats {
			gap: 2rem;
		}

		.stat-number {
			font-size: 1.5rem;
		}

		.about-stat .stat-number {
			font-size: 2rem;
		}
	}

	@media (max-width: 480px) {
		.hero-headers {
			height: 2.5rem;
		}

		.hero-header {
			font-size: 1.5rem;
		}

		.hero-actions {
			flex-direction: column;
			align-items: center;
		}

		.hero-stats {
			flex-direction: column;
			gap: 1.5rem;
		}

		.about-stats {
			flex-direction: column;
			gap: 1.5rem;
		}
	}
</style>
