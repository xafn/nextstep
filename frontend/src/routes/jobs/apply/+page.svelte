<script>
  import {
    ArrowLeft,
    Check,
    FileText,
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Star,
    Building,
    Clock,
    DollarSign,
  } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  let currentStep = 1;
  let totalSteps = 5;

  // Application data
  let application = {
    // Step 1: Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Step 2: Education & Experience
    education: "",
    schoolName: "",
    graduationYear: "",
    gpa: "",
    relevantCourses: "",
    workExperience: [],
    volunteerExperience: [],

    // Step 3: Skills & Availability
    skills: [],
    languages: [],
    certifications: [],
    availability: {
      weekdays: false,
      weekends: false,
      evenings: false,
      summer: false,
      flexible: false,
    },
    startDate: "",

    // Step 4: Why This Job
    whyThisJob: "",
    whatYouCanOffer: "",
    careerGoals: "",

    // Step 5: Review & Submit
    agreeToTerms: false,
    agreeToBackgroundCheck: false,
  };

  let isLoading = false;
  let showSuccess = false;

  // Sample job data (would come from route params in real app)
  let job = {
    title: "Summer Camp Counselor",
    company: "Sunshine Day Camp",
    location: "Austin, TX",
    hourlyRate: "$12-15",
    jobType: "Seasonal",
    schedule: "Full-time",
  };

  const skillOptions = [
    "Customer Service",
    "Communication",
    "Organization",
    "Problem Solving",
    "Teamwork",
    "Leadership",
    "Creativity",
    "Technical Skills",
    "Time Management",
    "Attention to Detail",
    "Patience",
    "Enthusiasm",
  ];

  const languageOptions = [
    "English",
    "Spanish",
    "French",
    "German",
    "Mandarin",
    "Other",
  ];

  function nextStep() {
    if (currentStep < totalSteps && validateCurrentStep()) {
      currentStep++;
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  function validateCurrentStep() {
    switch (currentStep) {
      case 1:
        return (
          application.firstName &&
          application.lastName &&
          application.email &&
          application.phone
        );
      case 2:
        return application.education && application.schoolName;
      case 3:
        return (
          application.skills.length > 0 &&
          Object.values(application.availability).some((v) => v)
        );
      case 4:
        return application.whyThisJob && application.whatYouCanOffer;
      case 5:
        return application.agreeToTerms && application.agreeToBackgroundCheck;
      default:
        return true;
    }
  }

  function toggleSkill(skill) {
    if (application.skills.includes(skill)) {
      application.skills = application.skills.filter((s) => s !== skill);
    } else {
      application.skills = [...application.skills, skill];
    }
  }

  function toggleLanguage(language) {
    if (application.languages.includes(language)) {
      application.languages = application.languages.filter(
        (l) => l !== language,
      );
    } else {
      application.languages = [...application.languages, language];
    }
  }

  function addWorkExperience() {
    application.workExperience = [
      ...application.workExperience,
      {
        company: "",
        position: "",
        duration: "",
        description: "",
      },
    ];
  }

  function removeWorkExperience(index) {
    application.workExperience = application.workExperience.filter(
      (_, i) => i !== index,
    );
  }

  function updateWorkExperience(index, field, value) {
    application.workExperience[index][field] = value;
    application.workExperience = [...application.workExperience];
  }

  async function submitApplication() {
    if (!validateCurrentStep()) {
      return;
    }

    isLoading = true;

    try {
      // TODO: Connect to Django backend
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showSuccess = true;
    } catch (error) {
      console.error("Application submission failed:", error);
    } finally {
      isLoading = false;
    }
  }

  function getStepProgress() {
    return (currentStep / totalSteps) * 100;
  }
</script>

<svelte:head>
  <title>Apply for {job.title} - NextStep</title>
  <meta
    name="description"
    content="Apply for {job.title} at {job.company} with our guided application process"
  />
</svelte:head>

{#if showSuccess}
  <div class="success-container">
    <div class="success-card">
      <div class="success-icon">
        <Check size={48} />
      </div>
      <h1>Application Submitted! 🎉</h1>
      <p>
        Thank you for applying to {job.title} at {job.company}. We've sent you a
        confirmation email.
      </p>

      <div class="next-steps">
        <h3>What happens next?</h3>
        <ul>
          <li>We'll review your application within 2-3 business days</li>
          <li>If selected, you'll receive an email to schedule an interview</li>
          <li>You can track your application status in your dashboard</li>
        </ul>
      </div>

      <div class="success-actions">
        <a href="/jobs" class="btn btn-outline">Browse More Jobs</a>
        <a href="/dashboard" class="btn btn-primary">View Dashboard</a>
      </div>
    </div>
  </div>
{:else}
  <div class="apply-container">
    <!-- Header -->
    <header class="apply-header">
      <div class="container">
        <div class="header-content">
          <a href="/jobs" class="back-link">
            <ArrowLeft size={20} />
            Back to Jobs
          </a>
          <div class="job-summary">
            <h1>Apply for {job.title}</h1>
            <div class="job-meta">
              <span><Building size={16} /> {job.company}</span>
              <span><MapPin size={16} /> {job.location}</span>
              <span><Clock size={16} /> {job.schedule}</span>
              <span><DollarSign size={16} /> {job.hourlyRate}/hour</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="apply-content">
      <div class="container">
        <div class="apply-layout">
          <!-- Left Sidebar - Progress -->
          <div class="apply-progress">
            <div class="progress-header">
              <h3>Application Progress</h3>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  style="width: {getStepProgress()}%"
                ></div>
              </div>
              <p>Step {currentStep} of {totalSteps}</p>
            </div>

            <div class="progress-steps">
              <div class="progress-step {currentStep >= 1 ? 'active' : ''}">
                <div class="step-number">1</div>
                <div class="step-info">
                  <h4>Personal Information</h4>
                  <p>Basic contact details</p>
                </div>
              </div>

              <div class="progress-step {currentStep >= 2 ? 'active' : ''}">
                <div class="step-number">2</div>
                <div class="step-info">
                  <h4>Education & Experience</h4>
                  <p>Your background</p>
                </div>
              </div>

              <div class="progress-step {currentStep >= 3 ? 'active' : ''}">
                <div class="step-number">3</div>
                <div class="step-info">
                  <h4>Skills & Availability</h4>
                  <p>What you can offer</p>
                </div>
              </div>

              <div class="progress-step {currentStep >= 4 ? 'active' : ''}">
                <div class="step-number">4</div>
                <div class="step-info">
                  <h4>Why This Job</h4>
                  <p>Your motivation</p>
                </div>
              </div>

              <div class="progress-step {currentStep >= 5 ? 'active' : ''}">
                <div class="step-number">5</div>
                <div class="step-info">
                  <h4>Review & Submit</h4>
                  <p>Final step</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side - Application Form -->
          <div class="apply-form">
            <form on:submit|preventDefault={nextStep}>
              <!-- Step 1: Personal Information -->
              {#if currentStep === 1}
                <div class="form-step">
                  <div class="step-header">
                    <h2>Personal Information</h2>
                    <p>Tell us about yourself so we can get in touch</p>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="firstName">First Name *</label>
                      <input
                        id="firstName"
                        type="text"
                        bind:value={application.firstName}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>

                    <div class="form-group">
                      <label for="lastName">Last Name *</label>
                      <input
                        id="lastName"
                        type="text"
                        bind:value={application.lastName}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="email">Email Address *</label>
                      <input
                        id="email"
                        type="email"
                        bind:value={application.email}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div class="form-group">
                      <label for="phone">Phone Number *</label>
                      <input
                        id="phone"
                        type="tel"
                        bind:value={application.phone}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="birthDate">Birth Date *</label>
                    <input
                      id="birthDate"
                      type="date"
                      bind:value={application.birthDate}
                      required
                    />
                    <small>You must be at least 14 years old to apply</small>
                  </div>

                  <div class="form-group">
                    <label for="address">Street Address</label>
                    <input
                      id="address"
                      type="text"
                      bind:value={application.address}
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="city">City</label>
                      <input
                        id="city"
                        type="text"
                        bind:value={application.city}
                        placeholder="Enter your city"
                      />
                    </div>

                    <div class="form-group">
                      <label for="state">State</label>
                      <input
                        id="state"
                        type="text"
                        bind:value={application.state}
                        placeholder="Enter your state"
                      />
                    </div>

                    <div class="form-group">
                      <label for="zipCode">ZIP Code</label>
                      <input
                        id="zipCode"
                        type="text"
                        bind:value={application.zipCode}
                        placeholder="Enter ZIP code"
                      />
                    </div>
                  </div>
                </div>
              {/if}

              <!-- Step 2: Education & Experience -->
              {#if currentStep === 2}
                <div class="form-step">
                  <div class="step-header">
                    <h2>Education & Experience</h2>
                    <p>
                      Share your educational background and any relevant
                      experience
                    </p>
                  </div>

                  <div class="form-group">
                    <label for="education">Highest Education Level *</label>
                    <select
                      id="education"
                      bind:value={application.education}
                      required
                    >
                      <option value="">Select education level</option>
                      <option value="High School (In Progress)"
                        >High School (In Progress)</option
                      >
                      <option value="High School Diploma"
                        >High School Diploma</option
                      >
                      <option value="Some College">Some College</option>
                      <option value="Associate's Degree"
                        >Associate's Degree</option
                      >
                      <option value="Bachelor's Degree"
                        >Bachelor's Degree</option
                      >
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="schoolName">School Name *</label>
                    <input
                      id="schoolName"
                      type="text"
                      bind:value={application.schoolName}
                      placeholder="Enter your school name"
                      required
                    />
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="graduationYear"
                        >Expected/Actual Graduation Year</label
                      >
                      <input
                        id="graduationYear"
                        type="number"
                        bind:value={application.graduationYear}
                        placeholder="e.g., 2025"
                        min="2020"
                        max="2030"
                      />
                    </div>

                    <div class="form-group">
                      <label for="gpa">GPA (Optional)</label>
                      <input
                        id="gpa"
                        type="number"
                        bind:value={application.gpa}
                        placeholder="e.g., 3.5"
                        min="0"
                        max="4"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="relevantCourses"
                      >Relevant Courses (Optional)</label
                    >
                    <textarea
                      id="relevantCourses"
                      bind:value={application.relevantCourses}
                      placeholder="List any courses that might be relevant to this job..."
                      rows="3"
                    ></textarea>
                  </div>

                  <div class="form-group">
                    <label>Work Experience (Optional)</label>
                    <p class="help-text">
                      Add any previous jobs, internships, or volunteer work
                    </p>

                    {#each application.workExperience as experience, index}
                      <div class="experience-item">
                        <div class="form-row">
                          <div class="form-group">
                            <label>Company/Organization</label>
                            <input
                              type="text"
                              bind:value={experience.company}
                              on:input={(e) =>
                                updateWorkExperience(
                                  index,
                                  "company",
                                  e.target.value,
                                )}
                              placeholder="Company name"
                            />
                          </div>

                          <div class="form-group">
                            <label>Position</label>
                            <input
                              type="text"
                              bind:value={experience.position}
                              on:input={(e) =>
                                updateWorkExperience(
                                  index,
                                  "position",
                                  e.target.value,
                                )}
                              placeholder="Job title"
                            />
                          </div>
                        </div>

                        <div class="form-row">
                          <div class="form-group">
                            <label>Duration</label>
                            <input
                              type="text"
                              bind:value={experience.duration}
                              on:input={(e) =>
                                updateWorkExperience(
                                  index,
                                  "duration",
                                  e.target.value,
                                )}
                              placeholder="e.g., 3 months, Summer 2024"
                            />
                          </div>

                          <div class="form-group">
                            <button
                              type="button"
                              class="btn btn-outline remove-btn"
                              on:click={() => removeWorkExperience(index)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div class="form-group">
                          <label>Description</label>
                          <textarea
                            bind:value={experience.description}
                            on:input={(e) =>
                              updateWorkExperience(
                                index,
                                "description",
                                e.target.value,
                              )}
                            placeholder="Briefly describe your responsibilities and achievements..."
                            rows="2"
                          ></textarea>
                        </div>
                      </div>
                    {/each}

                    <button
                      type="button"
                      class="btn btn-outline"
                      on:click={addWorkExperience}
                    >
                      + Add Work Experience
                    </button>
                  </div>
                </div>
              {/if}

              <!-- Step 3: Skills & Availability -->
              {#if currentStep === 3}
                <div class="form-step">
                  <div class="step-header">
                    <h2>Skills & Availability</h2>
                    <p>Show us what you can bring to this position</p>
                  </div>

                  <div class="form-group">
                    <label>Skills (Select all that apply) *</label>
                    <div class="checkbox-grid">
                      {#each skillOptions as skill}
                        <label class="checkbox-label">
                          <input
                            type="checkbox"
                            checked={application.skills.includes(skill)}
                            on:change={() => toggleSkill(skill)}
                          />
                          <span class="checkmark"></span>
                          {skill}
                        </label>
                      {/each}
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Languages (Select all that apply)</label>
                    <div class="checkbox-grid">
                      {#each languageOptions as language}
                        <label class="checkbox-label">
                          <input
                            type="checkbox"
                            checked={application.languages.includes(language)}
                            on:change={() => toggleLanguage(language)}
                          />
                          <span class="checkmark"></span>
                          {language}
                        </label>
                      {/each}
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Certifications (Optional)</label>
                    <textarea
                      bind:value={application.certifications}
                      placeholder="List any relevant certifications, licenses, or training..."
                      rows="3"
                    ></textarea>
                  </div>

                  <div class="form-group">
                    <label>When are you available to work? *</label>
                    <div class="availability-grid">
                      <label class="checkbox-label">
                        <input
                          type="checkbox"
                          bind:checked={application.availability.weekdays}
                        />
                        <span class="checkmark"></span>
                        Weekdays after school
                      </label>

                      <label class="checkbox-label">
                        <input
                          type="checkbox"
                          bind:checked={application.availability.weekends}
                        />
                        <span class="checkmark"></span>
                        Weekends
                      </label>

                      <label class="checkbox-label">
                        <input
                          type="checkbox"
                          bind:checked={application.availability.evenings}
                        />
                        <span class="checkmark"></span>
                        Evenings
                      </label>

                      <label class="checkbox-label">
                        <input
                          type="checkbox"
                          bind:checked={application.availability.summer}
                        />
                        <span class="checkmark"></span>
                        Summer break
                      </label>

                      <label class="checkbox-label">
                        <input
                          type="checkbox"
                          bind:checked={application.availability.flexible}
                        />
                        <span class="checkmark"></span>
                        Flexible schedule
                      </label>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="startDate">When can you start? *</label>
                    <input
                      id="startDate"
                      type="date"
                      bind:value={application.startDate}
                      required
                    />
                  </div>
                </div>
              {/if}

              <!-- Step 4: Why This Job -->
              {#if currentStep === 4}
                <div class="form-step">
                  <div class="step-header">
                    <h2>Why This Job?</h2>
                    <p>
                      Help us understand your motivation and what you can
                      contribute
                    </p>
                  </div>

                  <div class="form-group">
                    <label for="whyThisJob"
                      >Why are you interested in this position? *</label
                    >
                    <textarea
                      id="whyThisJob"
                      bind:value={application.whyThisJob}
                      placeholder="Tell us what excites you about this opportunity..."
                      rows="4"
                      required
                    ></textarea>
                    <small
                      >This is your chance to show enthusiasm and explain your
                      interest!</small
                    >
                  </div>

                  <div class="form-group">
                    <label for="whatYouCanOffer"
                      >What can you bring to this role? *</label
                    >
                    <textarea
                      id="whatYouCanOffer"
                      bind:value={application.whatYouCanOffer}
                      placeholder="Describe your strengths, skills, and what makes you a great fit..."
                      rows="4"
                      required
                    ></textarea>
                    <small
                      >Highlight your relevant skills, personality traits, and
                      experiences</small
                    >
                  </div>

                  <div class="form-group">
                    <label for="careerGoals"
                      >What are your career goals? (Optional)</label
                    >
                    <textarea
                      id="careerGoals"
                      bind:value={application.careerGoals}
                      placeholder="How does this job fit into your long-term plans?"
                      rows="3"
                    ></textarea>
                    <small
                      >This helps us understand your motivation and potential
                      for growth</small
                    >
                  </div>
                </div>
              {/if}

              <!-- Step 5: Review & Submit -->
              {#if currentStep === 5}
                <div class="form-step">
                  <div class="step-header">
                    <h2>Review & Submit</h2>
                    <p>Review your application before submitting</p>
                  </div>

                  <div class="review-section">
                    <h3>Application Summary</h3>

                    <div class="review-item">
                      <h4>Personal Information</h4>
                      <p>
                        <strong>Name:</strong>
                        {application.firstName}
                        {application.lastName}
                      </p>
                      <p><strong>Email:</strong> {application.email}</p>
                      <p><strong>Phone:</strong> {application.phone}</p>
                    </div>

                    <div class="review-item">
                      <h4>Education</h4>
                      <p><strong>Level:</strong> {application.education}</p>
                      <p><strong>School:</strong> {application.schoolName}</p>
                      {#if application.graduationYear}
                        <p>
                          <strong>Graduation:</strong>
                          {application.graduationYear}
                        </p>
                      {/if}
                    </div>

                    <div class="review-item">
                      <h4>Skills & Availability</h4>
                      <p>
                        <strong>Skills:</strong>
                        {application.skills.join(", ")}
                      </p>
                      <p>
                        <strong>Available:</strong>
                        {Object.entries(application.availability)
                          .filter(([k, v]) => v)
                          .map(([k, v]) => k)
                          .join(", ")}
                      </p>
                    </div>

                    <div class="review-item">
                      <h4>Motivation</h4>
                      <p>
                        <strong>Why this job:</strong>
                        {application.whyThisJob}
                      </p>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        bind:checked={application.agreeToTerms}
                        required
                      />
                      <span class="checkmark"></span>
                      I agree to the
                      <a href="/terms" target="_blank">Terms of Service</a>
                      and <a href="/privacy" target="_blank">Privacy Policy</a> *
                    </label>
                  </div>

                  <div class="form-group">
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        bind:checked={application.agreeToBackgroundCheck}
                        required
                      />
                      <span class="checkmark"></span>
                      I authorize a background check if required for this position
                      *
                    </label>
                  </div>

                  <div class="submit-section">
                    <button
                      type="submit"
                      class="btn btn-primary full-width"
                      disabled={isLoading}
                    >
                      {#if isLoading}
                        Submitting Application...
                      {:else}
                        Submit Application
                      {/if}
                    </button>
                    <p class="submit-note">
                      Once submitted, you cannot edit your application
                    </p>
                  </div>
                </div>
              {/if}

              <!-- Navigation -->
              <div class="step-navigation">
                {#if currentStep > 1}
                  <button
                    type="button"
                    class="btn btn-outline"
                    on:click={prevStep}
                  >
                    Previous
                  </button>
                {:else}
                  <div></div>
                {/if}

                {#if currentStep < totalSteps}
                  <button
                    type="button"
                    class="btn btn-primary"
                    on:click={nextStep}
                  >
                    Next Step
                  </button>
                {:else}
                  <button
                    type="button"
                    class="btn btn-primary"
                    on:click={submitApplication}
                    disabled={isLoading}
                  >
                    {#if isLoading}
                      Submitting...
                    {:else}
                      Submit Application
                    {/if}
                  </button>
                {/if}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .apply-container {
    min-height: 100vh;
    background: var(--surface);
  }

  .apply-header {
    background: white;
    border-bottom: 1px solid var(--border);
    padding: 2rem 0;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .back-link:hover {
    color: var(--primary);
  }

  .job-summary h1 {
    margin: 0 0 0.5rem 0;
    color: var(--text);
  }

  .job-meta {
    display: flex;
    gap: 1.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .job-meta span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .apply-content {
    padding: 2rem 0;
  }

  .apply-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    align-items: start;
  }

  .apply-progress {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    border: 1px solid var(--border);
    position: sticky;
    top: 2rem;
  }

  .progress-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .progress-header h3 {
    margin-bottom: 1rem;
    color: var(--text);
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--border);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: var(--primary);
    transition: width 0.3s ease;
  }

  .progress-header p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .progress-steps {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .progress-step {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }

  .progress-step.active {
    background: var(--surface);
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
    font-size: 0.9rem;
  }

  .step-info h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.9rem;
    color: var(--text);
  }

  .step-info p {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .apply-form {
    background: white;
    border-radius: 0.5rem;
    padding: 2rem;
    border: 1px solid var(--border);
  }

  .form-step {
    max-width: 600px;
  }

  .step-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .step-header h2 {
    margin-bottom: 0.5rem;
    color: var(--text);
  }

  .step-header p {
    color: var(--text-secondary);
    margin: 0;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
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

  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--border);
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--primary);
  }

  .form-group small {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .help-text {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }

  .checkbox-grid,
  .availability-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.75rem;
    margin-top: 0.5rem;
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
    transition: all 0.2s ease;
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

  .experience-item {
    background: var(--surface);
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid var(--border);
  }

  .remove-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .step-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
  }

  .review-section {
    background: var(--surface);
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .review-section h3 {
    margin-bottom: 1.5rem;
    color: var(--text);
  }

  .review-item {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .review-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .review-item h4 {
    margin-bottom: 0.75rem;
    color: var(--text);
    font-size: 1rem;
  }

  .review-item p {
    margin: 0 0 0.5rem 0;
    color: var(--text-secondary);
  }

  .submit-section {
    text-align: center;
    margin-top: 2rem;
  }

  .full-width {
    width: 100%;
  }

  .submit-note {
    margin-top: 0.75rem;
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  .success-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      135deg,
      var(--primary) 0%,
      var(--primary-dark) 100%
    );
    padding: 2rem 1rem;
  }

  .success-card {
    background: white;
    border-radius: 1rem;
    padding: 3rem 2rem;
    text-align: center;
    max-width: 500px;
    width: 100%;
  }

  .success-icon {
    width: 4rem;
    height: 4rem;
    background: var(--accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    color: white;
  }

  .success-card h1 {
    margin-bottom: 1rem;
    color: var(--text);
  }

  .success-card p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }

  .next-steps {
    text-align: left;
    margin-bottom: 2rem;
  }

  .next-steps h3 {
    margin-bottom: 1rem;
    color: var(--text);
  }

  .next-steps ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .next-steps li {
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
  }

  .success-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  @media (max-width: 1024px) {
    .apply-layout {
      grid-template-columns: 1fr;
    }

    .apply-progress {
      position: static;
      margin-bottom: 1rem;
    }
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .job-meta {
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .checkbox-grid,
    .availability-grid {
      grid-template-columns: 1fr;
    }

    .step-navigation {
      flex-direction: column;
      gap: 1rem;
    }

    .success-actions {
      flex-direction: column;
    }
  }
</style>
