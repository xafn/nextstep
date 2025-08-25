<script lang="ts">
  import {
    Search,
    Filter,
    MapPin,
    Clock,
    DollarSign,
    Star,
    Briefcase,
    Building,
    Calendar,
    ArrowRight,
    TrendingUp,
    Users,
    Award,
    X,
    CheckCircle,
    Target,
    Zap,
    FileText,
  } from "lucide-svelte";
  import { onMount } from "svelte";

  // Sample job data - will come from Django backend
  let jobs = [
    {
      id: 1,
      title: "Lawn Mowing & Yard Work",
      company: "Green Thumb Services",
      location: "Scarborough, ON",
      hourlyRate: "$20-25",
      jobType: "Gig",
      schedule: "Flexible",
      rating: 4.6,
      reviewCount: 34,
      description:
        "Help homeowners maintain their lawns and gardens. Perfect for teens who enjoy outdoor work and want flexible hours.",
      requirements: [
        "Must be 14+",
        "Reliable transportation",
        "Basic lawn care knowledge",
      ],
      postedDate: "2 days ago",
      tags: ["Outdoors", "Flexible", "Physical Work"],
      featured: true,
    },
    {
      id: 2,
      title: "Private Math Tutor",
      company: "Toronto Math Academy",
      location: "North York, ON",
      hourlyRate: "$25-35",
      jobType: "Part-time",
      schedule: "Part-time",
      rating: 4.8,
      reviewCount: 42,
      description:
        "Tutor students in math subjects from elementary to high school. Great opportunity for students who excel in mathematics.",
      requirements: [
        "Must be 16+",
        "Strong math skills",
        "Patient personality",
      ],
      postedDate: "1 week ago",
      tags: ["Education", "Math", "Teaching"],
    },
    {
      id: 3,
      title: "Lifeguard",
      company: "Toronto Community Centres",
      location: "Etobicoke, ON",
      hourlyRate: "$18-22",
      jobType: "Part-time",
      schedule: "Part-time",
      rating: 4.4,
      reviewCount: 28,
      description:
        "Ensure pool safety and assist swimmers. Perfect for strong swimmers who want to develop leadership skills.",
      requirements: [
        "Must be 16+",
        "Lifeguard certification",
        "Strong swimming ability",
      ],
      postedDate: "3 days ago",
      tags: ["Safety", "Swimming", "Leadership"],
    },
    {
      id: 4,
      title: "Camp Counselor",
      company: "High Park Nature Camp",
      location: "Toronto, ON",
      hourlyRate: "$16-20",
      jobType: "Seasonal",
      schedule: "Full-time",
      rating: 4.7,
      reviewCount: 56,
      description:
        "Lead outdoor activities and supervise children during summer camp. Great for nature lovers and outgoing teens.",
      requirements: [
        "Must be 16+",
        "First aid certification preferred",
        "Enthusiastic personality",
      ],
      postedDate: "5 days ago",
      tags: ["Summer", "Education", "Outdoors"],
      featured: true,
    },
    {
      id: 5,
      title: "Retail Assistant",
      company: "Yorkdale Shopping Centre",
      location: "Toronto, ON",
      hourlyRate: "$15-18",
      jobType: "Part-time",
      schedule: "Part-time",
      rating: 4.1,
      reviewCount: 31,
      description:
        "Assist customers and maintain store appearance. Perfect opportunity to develop customer service and retail skills.",
      requirements: ["Must be 15+", "Friendly attitude", "Available weekends"],
      postedDate: "1 day ago",
      tags: ["Retail", "Customer Service", "Shopping"],
    },
  ];

  let selectedJob: any = null;
  let searchQuery = "";
  let selectedFilters = {
    jobType: "",
    schedule: "",
    location: "",
    payRange: "",
  };

  let showFilters = false;
  let isFirstTime = true;
  let showOnboarding = false;
  let mounted = false;
  let showApplicationModal = false;
  let currentApplicationStep = 1;
  let applicationData = {
    coverLetter: "",
    availability: [] as string[],
    whyInterested: "",
    relevantExperience: "",
    questions: "",
  };
  let isSubmitting = false;
  let showSuccessModal = false;
  let showSearchSuggestions = false;

  // Search suggestions based on available data
  const searchSuggestions = [
    "lawn mowing",
    "tutoring",
    "lifeguard",
    "camp counselor",
    "retail",
    "customer service",
    "outdoors",
    "education",
    "summer",
    "part-time",
    "flexible",
    "Toronto",
    "Scarborough",
    "North York",
  ];

  // Filter options
  const jobTypes = ["All", "Part-time", "Full-time", "Seasonal", "Gig"];
  const schedules = ["All", "Part-time", "Full-time", "Flexible"];
  const locations = [
    "All",
    "Toronto, ON",
    "Scarborough, ON",
    "North York, ON",
    "Etobicoke, ON",
    "Mississauga, ON",
    "Markham, ON",
    "Vaughan, ON",
  ];
  const payRanges = ["All", "Under $10", "$10-15", "$15-20", "$20+"];

  const availabilityOptions = [
    "Weekdays after school",
    "Weekends",
    "Summer break",
    "Holidays",
    "Evenings",
    "Flexible schedule",
  ];

  function filterJobs() {
    return jobs.filter((job) => {
      // Search functionality - search in title, company, description, and tags
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        job.location.toLowerCase().includes(searchLower);

      // Job type filter
      const matchesType =
        !selectedFilters.jobType ||
        selectedFilters.jobType === "All" ||
        job.jobType === selectedFilters.jobType;

      // Schedule filter
      const matchesSchedule =
        !selectedFilters.schedule ||
        selectedFilters.schedule === "All" ||
        job.schedule === selectedFilters.schedule;

      // Location filter
      const matchesLocation =
        !selectedFilters.location ||
        selectedFilters.location === "All" ||
        job.location.includes(selectedFilters.location);

      // Pay range filter - extract numeric values and compare
      const matchesPay =
        !selectedFilters.payRange ||
        selectedFilters.payRange === "All" ||
        (() => {
          // Extract the minimum hourly rate from the job's pay range
          const jobPayMatch = job.hourlyRate.match(/\$(\d+)/);
          const jobMinPay = jobPayMatch ? parseInt(jobPayMatch[1]) : 0;

          switch (selectedFilters.payRange) {
            case "Under $10":
              return jobMinPay < 10;
            case "$10-15":
              return jobMinPay >= 10 && jobMinPay <= 15;
            case "$15-20":
              return jobMinPay >= 15 && jobMinPay <= 20;
            case "$20+":
              return jobMinPay >= 20;
            default:
              return true;
          }
        })();

      return (
        matchesSearch &&
        matchesType &&
        matchesSchedule &&
        matchesLocation &&
        matchesPay
      );
    });
  }

  function selectJob(job: any) {
    selectedJob = job;
    if (isFirstTime) {
      showOnboarding = true;
      isFirstTime = false;
    }
  }

  function closeOnboarding() {
    showOnboarding = false;
  }

  function clearFilters() {
    selectedFilters = {
      jobType: "",
      schedule: "",
      location: "",
      payRange: "",
    };
  }

  function handleSearchFocus() {
    if (searchQuery.length > 0) {
      showSearchSuggestions = true;
    }
  }

  function handleSearchBlur() {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      showSearchSuggestions = false;
    }, 200);
  }

  function selectSuggestion(suggestion: string) {
    searchQuery = suggestion;
    showSearchSuggestions = false;
  }

  function clearSearch() {
    searchQuery = "";
    showSearchSuggestions = false;
  }

  function openApplicationModal() {
    showApplicationModal = true;
    currentApplicationStep = 1;
    applicationData = {
      coverLetter: "",
      availability: [],
      whyInterested: "",
      relevantExperience: "",
      questions: "",
    };
  }

  function closeApplicationModal() {
    showApplicationModal = false;
  }

  function nextStep() {
    if (currentApplicationStep < 3) {
      currentApplicationStep++;
    }
  }

  function prevStep() {
    if (currentApplicationStep > 1) {
      currentApplicationStep--;
    }
  }

  function toggleAvailability(option: string) {
    if (applicationData.availability.includes(option)) {
      applicationData.availability = applicationData.availability.filter(
        (item) => item !== option,
      );
    } else {
      applicationData.availability = [...applicationData.availability, option];
    }
  }

  async function submitApplication() {
    isSubmitting = true;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    isSubmitting = false;
    showApplicationModal = false;
    showSuccessModal = true;

    // Auto-hide success modal after 3 seconds
    setTimeout(() => {
      showSuccessModal = false;
    }, 3000);
  }

  onMount(() => {
    mounted = true;
  });

  $: filteredJobs = filterJobs();
</script>

<svelte:head>
  <title>Find Jobs - NextStep</title>
  <meta
    name="description"
    content="Browse and apply to teen-friendly jobs in your area"
  />
</svelte:head>

<div class="job-board">
  <!-- Header -->
  <header class="job-header">
    <div class="container">
      <div class="header-content">
        <div class="header-left" class:animate-fade-in-up={mounted}>
          <div class="header-badge">
            <TrendingUp size={16} />
            <span>500+ Jobs Available</span>
          </div>
          <h1>Find Your Perfect Job</h1>
          <p>
            Discover opportunities that match your skills, schedule, and goals
          </p>
        </div>
        <div
          class="header-actions"
          class:animate-fade-in-up={mounted}
          style="animation-delay: 0.1s"
        >
          <button
            class="btn btn-outline"
            on:click={() => (showOnboarding = true)}
          >
            <Users size={16} />
            How to Apply
          </button>
        </div>
      </div>
    </div>
  </header>

  <div class="job-board-content">
    <div class="container">
      <div class="job-board-layout">
        <!-- Left Sidebar - Job Listings -->
        <div class="job-listings">
          <!-- Search and Filters -->
          <div
            class="search-filters"
            class:animate-fade-in-up={mounted}
            style="animation-delay: 0.2s"
          >
            <div class="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                bind:value={searchQuery}
                on:focus={handleSearchFocus}
                on:blur={handleSearchBlur}
              />
              {#if searchQuery}
                <button class="clear-search" on:click={clearSearch}>
                  <X size={16} />
                </button>
              {/if}
            </div>

            <!-- Search Suggestions -->
            {#if showSearchSuggestions && searchQuery.length > 0}
              <div class="search-suggestions">
                {#each searchSuggestions.filter((s) => s
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())) as suggestion}
                  <button
                    class="suggestion-item"
                    on:click={() => selectSuggestion(suggestion)}
                  >
                    <Search size={14} />
                    <span>{suggestion}</span>
                  </button>
                {/each}
              </div>
            {/if}

            <button
              class="filter-toggle btn btn-outline"
              on:click={() => (showFilters = !showFilters)}
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          {#if showFilters}
            <div class="filters-panel animate-fade-in-up">
              <div class="filter-group">
                <label>Job Type</label>
                <select bind:value={selectedFilters.jobType}>
                  {#each jobTypes as type}
                    <option value={type}>{type}</option>
                  {/each}
                </select>
              </div>

              <div class="filter-group">
                <label>Schedule</label>
                <select bind:value={selectedFilters.schedule}>
                  {#each schedules as schedule}
                    <option value={schedule}>{schedule}</option>
                  {/each}
                </select>
              </div>

              <div class="filter-group">
                <label>Location</label>
                <select bind:value={selectedFilters.location}>
                  {#each locations as location}
                    <option value={location}>{location}</option>
                  {/each}
                </select>
              </div>

              <div class="filter-group">
                <label>Pay Range</label>
                <select bind:value={selectedFilters.payRange}>
                  {#each payRanges as range}
                    <option value={range}>{range}</option>
                  {/each}
                </select>
              </div>

              <button class="btn btn-outline" on:click={clearFilters}>
                Clear Filters
              </button>
            </div>
          {/if}

          <!-- Job List -->
          <div class="job-list">
            {#each filteredJobs as job, index}
              <div
                class="job-card {selectedJob?.id === job.id
                  ? 'selected'
                  : ''} {job.featured ? 'featured' : ''}"
                class:animate-fade-in-up={mounted}
                style="animation-delay: {0.3 + index * 0.1}s"
                on:click={() => selectJob(job)}
              >
                {#if job.featured}
                  <div class="featured-badge">
                    <Award size={14} />
                    <span>Featured</span>
                  </div>
                {/if}

                <div class="job-card-header">
                  <h3>{job.title}</h3>
                </div>

                <div class="job-company">
                  <Building size={16} />
                  <span>{job.company}</span>
                </div>

                <div class="job-location">
                  <MapPin size={16} />
                  <span>{job.location}</span>
                </div>

                <div class="job-tags">
                  <span class="tag pay-tag">
                    <DollarSign size={14} />
                    {job.hourlyRate}
                  </span>
                  <span class="tag type-tag">{job.jobType}</span>
                  <span class="tag schedule-tag">{job.schedule}</span>
                </div>

                <div class="job-rating">
                  <Star size={16} class="star-icon" />
                  <span>{job.rating}</span>
                  <span class="review-count">({job.reviewCount} reviews)</span>
                </div>

                <div class="job-posted">
                  <Calendar size={14} />
                  <span>{job.postedDate}</span>
                </div>
              </div>
            {/each}

            {#if filteredJobs.length === 0}
              <div class="no-jobs animate-fade-in-up">
                <h3>No jobs found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Right Sidebar - Job Details -->
        <div class="job-details">
          {#if selectedJob}
            <div class="job-detail-card animate-fade-in-up">
              <div class="job-detail-header">
                <h2>{selectedJob.title}</h2>
              </div>

              <div class="company-info">
                <div class="company-header">
                  <Building size={20} />
                  <div>
                    <h4>{selectedJob.company}</h4>
                    <div class="company-rating">
                      <Star size={16} class="star-icon" />
                      <span>{selectedJob.rating}</span>
                      <span class="review-count"
                        >({selectedJob.reviewCount} reviews)</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="job-meta">
                <div class="meta-item">
                  <MapPin size={16} />
                  <span>{selectedJob.location}</span>
                </div>
                <div class="meta-item">
                  <Clock size={16} />
                  <span>{selectedJob.schedule} • {selectedJob.jobType}</span>
                </div>
                <div class="meta-item">
                  <DollarSign size={16} />
                  <span>{selectedJob.hourlyRate}/hour</span>
                </div>
                <div class="meta-item">
                  <Calendar size={16} />
                  <span>Posted {selectedJob.postedDate}</span>
                </div>
              </div>

              <div class="job-description">
                <h4>Job Description</h4>
                <p>{selectedJob.description}</p>
              </div>

              <div class="job-requirements">
                <h4>Requirements</h4>
                <ul>
                  {#each selectedJob.requirements as requirement}
                    <li>{requirement}</li>
                  {/each}
                </ul>
              </div>

              <div class="job-tags-detail">
                <h4>Tags</h4>
                <div class="tags-container">
                  {#each selectedJob.tags as tag}
                    <span class="tag">{tag}</span>
                  {/each}
                </div>
              </div>

              <div class="apply-section">
                <button
                  class="btn btn-primary full-width"
                  on:click={openApplicationModal}
                >
                  Apply for this Position
                  <ArrowRight size={16} />
                </button>
                <p class="apply-note">
                  This will take you to our guided application process
                </p>
              </div>
            </div>
          {:else}
            <div class="no-job-selected animate-fade-in-up">
              <div class="no-job-content">
                <Briefcase size={48} />
                <h3>Select a Job</h3>
                <p>Choose a job from the list to see details and apply</p>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Job Application Modal -->
{#if showApplicationModal}
  <div class="modal-overlay" on:click={closeApplicationModal}>
    <div class="application-modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2>Apply for {selectedJob?.title}</h2>
        <button class="close-btn" on:click={closeApplicationModal}>
          <X size={24} />
        </button>
      </div>

      <!-- Progress Bar -->
      <div class="progress-bar">
        <div
          class="progress-fill"
          style="width: {(currentApplicationStep / 3) * 100}%"
        ></div>
        <div class="progress-text">Step {currentApplicationStep} of 3</div>
      </div>

      <!-- Step 1: Cover Letter -->
      {#if currentApplicationStep === 1}
        <div class="modal-step">
          <h3>Tell us about yourself</h3>
          <p>
            Write a brief cover letter explaining why you're interested in this
            position
          </p>

          <div class="form-group">
            <label for="coverLetter">Cover Letter</label>
            <textarea
              id="coverLetter"
              bind:value={applicationData.coverLetter}
              placeholder="Hi! I'm excited to apply for this position because..."
              rows="6"
            ></textarea>
          </div>

          <div class="form-group">
            <label>When are you available to work?</label>
            <div class="checkbox-grid">
              {#each availabilityOptions as option}
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    checked={applicationData.availability.includes(option)}
                    on:change={() => toggleAvailability(option)}
                  />
                  <span class="checkmark"></span>
                  {option}
                </label>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      <!-- Step 2: Experience & Interest -->
      {#if currentApplicationStep === 2}
        <div class="modal-step">
          <h3>Share your experience</h3>
          <p>Help the employer understand why you're a great fit</p>

          <div class="form-group">
            <label for="whyInterested"
              >Why are you interested in this job?</label
            >
            <textarea
              id="whyInterested"
              bind:value={applicationData.whyInterested}
              placeholder="I'm interested in this job because..."
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="relevantExperience">Any relevant experience?</label>
            <textarea
              id="relevantExperience"
              bind:value={applicationData.relevantExperience}
              placeholder="I have experience with..."
              rows="4"
            ></textarea>
          </div>
        </div>
      {/if}

      <!-- Step 3: Final Questions -->
      {#if currentApplicationStep === 3}
        <div class="modal-step">
          <h3>Final touches</h3>
          <p>Any questions for the employer?</p>

          <div class="form-group">
            <label for="questions">Questions for the employer (optional)</label>
            <textarea
              id="questions"
              bind:value={applicationData.questions}
              placeholder="I'd like to know more about..."
              rows="4"
            ></textarea>
          </div>

          <div class="application-summary">
            <h4>Application Summary</h4>
            <div class="summary-item">
              <strong>Position:</strong>
              {selectedJob?.title}
            </div>
            <div class="summary-item">
              <strong>Company:</strong>
              {selectedJob?.company}
            </div>
            <div class="summary-item">
              <strong>Pay:</strong>
              {selectedJob?.hourlyRate}/hour
            </div>
          </div>
        </div>
      {/if}

      <!-- Navigation Buttons -->
      <div class="modal-actions">
        {#if currentApplicationStep > 1}
          <button class="btn btn-outline" on:click={prevStep}>
            Previous
          </button>
        {:else}
          <div></div>
        {/if}

        {#if currentApplicationStep < 3}
          <button class="btn btn-primary" on:click={nextStep}> Next </button>
        {:else}
          <button
            class="btn btn-primary"
            on:click={submitApplication}
            disabled={isSubmitting}
          >
            {#if isSubmitting}
              Submitting...
            {:else}
              Submit Application
            {/if}
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}

<!-- Success Modal -->
{#if showSuccessModal}
  <div class="modal-overlay">
    <div class="success-modal">
      <div class="success-icon">
        <CheckCircle size={48} />
      </div>
      <h2>Application Submitted! 🎉</h2>
      <p>Great job! Your application has been sent to {selectedJob?.company}</p>
      <div class="success-stats">
        <div class="stat-item">
          <Target size={20} />
          <span>+50 XP Earned!</span>
        </div>
        <div class="stat-item">
          <Award size={20} />
          <span>New Badge: First Application</span>
        </div>
      </div>
      <button
        class="btn btn-primary"
        on:click={() => (showSuccessModal = false)}
      >
        Continue Browsing
      </button>
    </div>
  </div>
{/if}

<!-- Onboarding Modal -->
{#if showOnboarding}
  <div class="onboarding-overlay" on:click={closeOnboarding}>
    <div class="onboarding-modal animate-fade-in-up" on:click|stopPropagation>
      <div class="onboarding-header">
        <h2>Welcome to NextStep! 🎉</h2>
        <p>Let us guide you through your first job application</p>
      </div>

      <div class="onboarding-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>Browse Jobs</h4>
            <p>
              Scroll through our curated list of teen-friendly opportunities
            </p>
          </div>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>Review Details</h4>
            <p>
              Click on any job to see full description, requirements, and
              company info
            </p>
          </div>
        </div>

        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>Apply with Confidence</h4>
            <p>
              Use our guided application process - we'll help you every step of
              the way!
            </p>
          </div>
        </div>
      </div>

      <div class="onboarding-actions">
        <button class="btn btn-primary" on:click={closeOnboarding}>
          Got it! Let's find jobs
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .job-board {
    min-height: 100vh;
    background: var(--surface);
  }

  .job-header {
    background: linear-gradient(
      135deg,
      var(--primary) 0%,
      var(--primary-dark) 100%
    );
    color: white;
    padding: 3rem 0;
    position: relative;
    overflow: hidden;
  }

  .job-header::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.3;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .header-left h1 {
    margin-bottom: 0.5rem;
    color: white;
    font-size: clamp(2rem, 4vw, 2.5rem);
  }

  .header-left p {
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
  }

  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-2xl);
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
    backdrop-filter: blur(10px);
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.9);
  }

  .job-board-content {
    padding: 2rem 0;
  }

  .job-board-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  }

  .job-listings {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .search-filters {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .search-bar {
    flex: 1;
    display: flex;
    align-items: center;
    background: white;
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    padding: 0.75rem 1rem;
    gap: 0.75rem;
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-fast);
  }

  .search-bar:focus-within {
    border-color: var(--primary);
    box-shadow: var(--shadow-md);
  }

  .search-bar input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 1rem;
  }

  .clear-search {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }

  .clear-search:hover {
    background: var(--surface);
    color: var(--text);
  }

  .filter-toggle {
    white-space: nowrap;
  }

  .filters-panel {
    background: white;
    border-radius: var(--radius-md);
    padding: 1.5rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-md);
  }

  .filter-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: var(--text);
  }

  .filter-group select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    transition: border-color var(--transition-fast);
  }

  .filter-group select:focus {
    outline: none;
    border-color: var(--primary);
  }

  .job-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .job-card {
    background: white;
    border-radius: var(--radius-md);
    padding: 1.5rem;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all var(--transition-normal);
    position: relative;
    box-shadow: var(--shadow-sm);
  }

  .job-card:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .job-card.selected {
    border-color: var(--primary);
    background: var(--primary-light);
  }

  .job-card.featured {
    border-color: var(--secondary);
    background: linear-gradient(135deg, white 0%, var(--warning-light) 100%);
  }

  .featured-badge {
    position: absolute;
    top: -0.5rem;
    right: 1rem;
    background: linear-gradient(
      135deg,
      var(--secondary) 0%,
      var(--secondary-dark) 100%
    );
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-2xl);
    font-size: 0.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    box-shadow: var(--shadow-md);
  }

  .job-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }

  .job-card-header h3 {
    margin: 0;
    color: var(--text);
    font-size: 1.1rem;
  }

  .job-company,
  .job-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .job-tags {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
  }

  .tag {
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .pay-tag {
    background: var(--success-light);
    color: var(--success);
  }

  .type-tag {
    background: var(--info-light);
    color: var(--info);
  }

  .schedule-tag {
    background: var(--warning-light);
    color: var(--warning);
  }

  .job-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .star-icon {
    color: #fbbf24;
  }

  .review-count {
    color: var(--text-secondary);
    font-size: 0.8rem;
  }

  .job-posted {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.8rem;
  }

  .job-details {
    position: sticky;
    top: 2rem;
  }

  .job-detail-card {
    background: white;
    border-radius: var(--radius-lg);
    padding: 2rem;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-md);
  }

  .job-detail-header {
    margin-bottom: 1.5rem;
  }

  .job-detail-header h2 {
    margin-bottom: 1rem;
    color: var(--text);
  }

  .job-actions {
    display: flex;
    gap: 1rem;
  }

  .company-info {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .company-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .company-header h4 {
    margin: 0 0 0.5rem 0;
    color: var(--text);
  }

  .company-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .job-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .job-description,
  .job-requirements,
  .job-tags-detail {
    margin-bottom: 1.5rem;
  }

  .job-description h4,
  .job-requirements h4,
  .job-tags-detail h4 {
    margin-bottom: 0.75rem;
    color: var(--text);
  }

  .job-requirements ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .job-requirements li {
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
  }

  .tags-container {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tags-container .tag {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
  }

  .apply-section {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
    text-align: center;
  }

  .full-width {
    width: 100%;
  }

  .apply-note {
    margin-top: 0.75rem;
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  .no-job-selected {
    background: white;
    border-radius: var(--radius-lg);
    padding: 3rem 2rem;
    text-align: center;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-md);
  }

  .no-job-content {
    color: var(--text-secondary);
  }

  .no-job-content h3 {
    margin: 1rem 0 0.5rem 0;
    color: var(--text);
  }

  .no-jobs {
    text-align: center;
    padding: 3rem 2rem;
    color: var(--text-secondary);
  }

  .onboarding-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
    backdrop-filter: blur(4px);
  }

  .onboarding-modal {
    background: white;
    border-radius: var(--radius-xl);
    padding: 2rem;
    max-width: 500px;
    width: 100%;
    text-align: center;
    box-shadow: var(--shadow-xl);
  }

  .onboarding-header h2 {
    margin-bottom: 0.5rem;
    color: var(--text);
  }

  .onboarding-header p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }

  .onboarding-steps {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .step {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    text-align: left;
  }

  .step-number {
    width: 2rem;
    height: 2rem;
    background: var(--primary);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
  }

  .step-content h4 {
    margin: 0 0 0.25rem 0;
    color: var(--text);
  }

  .step-content p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .onboarding-actions {
    display: flex;
    justify-content: center;
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
    backdrop-filter: blur(4px);
  }

  .application-modal {
    background: white;
    border-radius: var(--radius-xl);
    padding: 2rem;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-xl);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .modal-header h2 {
    margin: 0;
    color: var(--text);
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }

  .close-btn:hover {
    background: var(--surface);
    color: var(--text);
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--border);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1rem;
    position: relative;
  }

  .progress-fill {
    height: 100%;
    background: var(--primary);
    transition: width var(--transition-normal);
  }

  .progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .modal-step h3 {
    margin: 0 0 0.5rem 0;
    color: var(--text);
  }

  .modal-step p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--text);
  }

  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    transition: border-color var(--transition-fast);
  }

  .form-group textarea:focus {
    outline: none;
    border-color: var(--primary);
  }

  .checkbox-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .checkbox-label input[type="checkbox"] {
    display: none;
  }

  .checkmark {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border);
    border-radius: 0.25rem;
    position: relative;
    transition: all var(--transition-fast);
  }

  .checkbox-label input[type="checkbox"]:checked + .checkmark {
    background: var(--primary);
    border-color: var(--primary);
  }

  .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  .application-summary {
    background: var(--surface);
    padding: 1rem;
    border-radius: var(--radius-md);
    margin-bottom: 1rem;
  }

  .application-summary h4 {
    margin: 0 0 0.75rem 0;
    color: var(--text);
  }

  .summary-item {
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
  }

  .modal-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }

  /* Success Modal */
  .success-modal {
    background: white;
    border-radius: var(--radius-xl);
    padding: 2rem;
    max-width: 500px;
    width: 100%;
    text-align: center;
    box-shadow: var(--shadow-xl);
  }

  .success-icon {
    color: var(--success);
    margin-bottom: 1rem;
  }

  .success-modal h2 {
    margin-bottom: 0.5rem;
    color: var(--text);
  }

  .success-modal p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }

  .success-stats {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .success-stats .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    color: var(--accent);
    font-weight: 500;
  }

  .search-suggestions {
    position: absolute;
    top: 100%; /* Position below the search bar */
    left: 0;
    right: 0;
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    z-index: 10;
    max-height: 200px; /* Limit height for suggestions */
    overflow-y: auto;
    margin-top: 0.5rem;
  }

  .suggestion-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background-color var(--transition-fast);
  }

  .suggestion-item:hover {
    background-color: var(--primary-light);
  }

  @media (max-width: 1024px) {
    .job-board-layout {
      grid-template-columns: 1fr;
    }

    .job-details {
      position: static;
    }
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .search-filters {
      flex-direction: column;
    }

    .filters-panel {
      grid-template-columns: 1fr;
    }

    .job-meta {
      grid-template-columns: 1fr;
    }

    .job-actions {
      flex-direction: column;
    }

    .job-header {
      padding: 2rem 0;
    }

    .application-modal {
      padding: 1.5rem;
      margin: 1rem;
    }

    .modal-actions {
      flex-direction: column;
      gap: 1rem;
    }

    .checkbox-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
