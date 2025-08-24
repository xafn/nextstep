<script lang="ts">
    import {
        Eye,
        EyeOff,
        Mail,
        Lock,
        User,
        Calendar,
        MapPin,
        Phone,
        ArrowLeft,
        Check,
        Globe,
    } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import { auth } from "$lib/stores/auth";
    import IdVerification from "$lib/components/IdVerification.svelte";

    let currentStep = 1;
    let totalSteps = 6; // Increased to include ID verification
    let userType = ""; // "teen" or "employer"
    let idVerified = false;
    let idVerificationFile: File | null = null;

    // Step 1: Basic Info
    let firstName = "";
    let lastName = "";
    let email = "";
    let password = "";
    let confirmPassword = "";
    let showPassword = false;
    let showConfirmPassword = false;

    // Step 2: Personal Details
    let birthDate = "";
    let phone = "";
    let city = "";
    let state = "";

    // Step 3: Skills & Interests
    let skills: string[] = [];
    let interests: string[] = [];
    let availability: string[] = [];

    // Step 4: Goals & Preferences (for teens)
    let jobGoals: string[] = [];
    let preferredPay = "";
    let workStyle = "";

    // Step 5: Employer Details (for employers)
    let companyName = "";
    let companyType = "";
    let industry = "";
    let companySize = "";
    let website = "";

    let isLoading = false;
    let error = "";

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
    ];

    const interestOptions = [
        "Technology",
        "Healthcare",
        "Education",
        "Retail",
        "Food Service",
        "Creative Arts",
        "Sports",
        "Environment",
        "Animals",
        "Community Service",
    ];

    const availabilityOptions = [
        "Weekdays after school",
        "Weekends",
        "Summer break",
        "Holidays",
        "Evenings",
        "Flexible schedule",
    ];

    const jobGoalOptions = [
        "Save for college",
        "Learn new skills",
        "Build resume",
        "Earn spending money",
        "Gain work experience",
        "Help family financially",
    ];

    const payOptions = [
        "Minimum wage",
        "Above minimum wage",
        "Commission-based",
        "Negotiable",
    ];

    const workStyleOptions = [
        "Team environment",
        "Independent work",
        "Customer-facing",
        "Behind the scenes",
        "Creative projects",
        "Structured tasks",
    ];

    const companyTypeOptions = [
        "Small Business",
        "Medium Business",
        "Large Corporation",
        "Non-profit",
        "Government",
        "Startup",
        "Franchise",
        "Other",
    ];

    const industryOptions = [
        "Technology",
        "Healthcare",
        "Education",
        "Retail",
        "Food Service",
        "Manufacturing",
        "Finance",
        "Real Estate",
        "Entertainment",
        "Other",
    ];

    const companySizeOptions = [
        "1-10 employees",
        "11-50 employees",
        "51-200 employees",
        "201-500 employees",
        "500+ employees",
    ];

    function nextStep() {
        if (currentStep === 1 && !userType) {
            error = "Please select whether you're a teenager or employer";
            return;
        }

        if (currentStep < totalSteps) {
            // Skip teen-specific steps for employers
            if (userType === "employer" && currentStep === 3) {
                currentStep = 5; // Skip to employer details
            } else if (userType === "teen" && currentStep === 5) {
                currentStep = 6; // Skip employer details for teens
            } else {
                currentStep++;
            }
        }
    }

    function handleIdVerification(event: CustomEvent) {
        idVerified = true;
        idVerificationFile = event.detail.file;
        nextStep();
    }

    function prevStep() {
        if (currentStep > 1) {
            // Handle step navigation for different user types
            if (userType === "employer" && currentStep === 5) {
                currentStep = 3; // Go back to personal details
            } else if (userType === "teen" && currentStep === 6) {
                currentStep = 5; // Go back to skills & interests
            } else {
                currentStep--;
            }
        }
    }

    function toggleArrayItem(array: string[], item: string): string[] {
        if (array.includes(item)) {
            array = array.filter((i: string) => i !== item);
        } else {
            array = [...array, item];
        }
        return array;
    }

    async function handleSignup() {
        if (!validateForm()) {
            return;
        }

        isLoading = true;
        error = "";

        try {
            // TODO: Connect to Django backend
            // For now, simulate signup
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Create mock user data
            const user = {
                id: "1",
                email: email,
                name: `${firstName} ${lastName}`,
            };

            // Login user after successful signup
            auth.login(user);

            // Redirect based on user type
            if (userType === "employer") {
                goto("/employer/jobs");
            } else {
                goto("/dashboard");
            }
        } catch (err) {
            error = "Signup failed. Please try again.";
        } finally {
            isLoading = false;
        }
    }

    function validateForm() {
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            error = "Please fill in all required fields";
            return false;
        }

        if (password !== confirmPassword) {
            error = "Passwords do not match";
            return false;
        }

        if (password.length < 8) {
            error = "Password must be at least 8 characters long";
            return false;
        }

        if (!birthDate) {
            error = "Please enter your birth date";
            return false;
        }

        // Check if user is at least 14 years old
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (age < 14 || (age === 14 && monthDiff < 0)) {
            error = "You must be at least 14 years old to use NextStep";
            return false;
        }

        if (!idVerified) {
            error = "Please complete ID verification";
            return false;
        }

        return true;
    }

    function getStepProgress() {
        return (currentStep / totalSteps) * 100;
    }
</script>

<svelte:head>
    <title>Sign Up - NextStep</title>
    <meta
        name="description"
        content="Create your NextStep account and start your journey to independence"
    />
</svelte:head>

<div class="auth-container">
    <div class="auth-card">
        <div class="auth-header">
            <a href="/" class="back-link">
                <ArrowLeft size={20} />
                Back to Home
            </a>
            <h1>Join NextStep</h1>
            <p>Start your journey toward independence and financial freedom</p>

            <!-- Progress Bar -->
            <div class="progress-container">
                <div class="progress-bar">
                    <div
                        class="progress-fill"
                        style="width: {getStepProgress()}%"
                    ></div>
                </div>
                <div class="progress-text">
                    Step {currentStep} of {totalSteps}
                </div>
            </div>
        </div>

        <form on:submit|preventDefault={handleSignup} class="auth-form">
            {#if error}
                <div class="error-message">
                    {error}
                </div>
            {/if}

            <!-- Step 1: User Type Selection -->
            {#if currentStep === 1}
                <div class="step-content">
                    <h3>I am a...</h3>
                    <p>
                        Tell us who you are so we can customize your experience
                    </p>

                    <div class="user-type-selection">
                        <div
                            class="user-type-card"
                            class:selected={userType === "teen"}
                            on:click={() => (userType = "teen")}
                        >
                            <div class="user-type-icon">👨‍🎓</div>
                            <h4>Teenager</h4>
                            <p>
                                I'm looking for my first job or internship
                                opportunities
                            </p>
                            <ul>
                                <li>Browse job listings</li>
                                <li>Build your resume</li>
                                <li>Apply to positions</li>
                                <li>Track applications</li>
                            </ul>
                        </div>

                        <div
                            class="user-type-card"
                            class:selected={userType === "employer"}
                            on:click={() => (userType = "employer")}
                        >
                            <div class="user-type-icon">🏢</div>
                            <h4>Employer</h4>
                            <p>I want to hire teenagers for my business</p>
                            <ul>
                                <li>Post job listings</li>
                                <li>Review applications</li>
                                <li>Manage candidates</li>
                                <li>Hire great talent</li>
                            </ul>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Step 2: Basic Info -->
            {#if currentStep === 2}
                <div class="step-content">
                    <h3>Basic Information</h3>
                    <p>Let's start with the basics to create your account</p>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="firstName">First Name *</label>
                            <div class="input-wrapper">
                                <User size={20} class="input-icon" />
                                <input
                                    id="firstName"
                                    type="text"
                                    bind:value={firstName}
                                    placeholder="Enter your first name"
                                    required
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="lastName">Last Name *</label>
                            <div class="input-wrapper">
                                <User size={20} class="input-icon" />
                                <input
                                    id="lastName"
                                    type="text"
                                    bind:value={lastName}
                                    placeholder="Enter your last name"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <div class="input-wrapper">
                            <Mail size={20} class="input-icon" />
                            <input
                                id="email"
                                type="email"
                                bind:value={email}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="password">Password *</label>
                            <div class="input-wrapper">
                                <Lock size={20} class="input-icon" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    bind:value={password}
                                    placeholder="Create a password"
                                    required
                                />
                                <button
                                    type="button"
                                    class="password-toggle"
                                    on:click={() =>
                                        (showPassword = !showPassword)}
                                >
                                    {#if showPassword}
                                        <EyeOff size={20} />
                                    {:else}
                                        <Eye size={20} />
                                    {/if}
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="confirmPassword"
                                >Confirm Password *</label
                            >
                            <div class="input-wrapper">
                                <Lock size={20} class="input-icon" />
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword
                                        ? "text"
                                        : "password"}
                                    bind:value={confirmPassword}
                                    placeholder="Confirm your password"
                                    required
                                />
                                <button
                                    type="button"
                                    class="password-toggle"
                                    on:click={() =>
                                        (showConfirmPassword =
                                            !showConfirmPassword)}
                                >
                                    {#if showConfirmPassword}
                                        <EyeOff size={20} />
                                    {:else}
                                        <Eye size={20} />
                                    {/if}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Step 3: Personal Details -->
            {#if currentStep === 3}
                <div class="step-content">
                    <h3>Personal Details</h3>
                    <p>Help us understand your background and availability</p>

                    <div class="form-group">
                        <label for="birthDate">Birth Date *</label>
                        <div class="input-wrapper">
                            <Calendar size={20} class="input-icon" />
                            <input
                                id="birthDate"
                                type="date"
                                bind:value={birthDate}
                                required
                            />
                        </div>
                        <small
                            >You must be at least 14 years old to use NextStep</small
                        >
                    </div>

                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <div class="input-wrapper">
                            <Phone size={20} class="input-icon" />
                            <input
                                id="phone"
                                type="tel"
                                bind:value={phone}
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="city">City</label>
                            <div class="input-wrapper">
                                <MapPin size={20} class="input-icon" />
                                <input
                                    id="city"
                                    type="text"
                                    bind:value={city}
                                    placeholder="Enter your city"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="state">State</label>
                            <div class="input-wrapper">
                                <MapPin size={20} class="input-icon" />
                                <input
                                    id="state"
                                    type="text"
                                    bind:value={state}
                                    placeholder="Enter your state"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Step 4: ID Verification -->
            {#if currentStep === 4}
                <div class="step-content">
                    <IdVerification on:verified={handleIdVerification} />
                </div>
            {/if}

            <!-- Step 5: Skills & Interests -->
            {#if currentStep === 5}
                <div class="step-content">
                    <h3>Skills & Interests</h3>
                    <p>Tell us about your strengths and what interests you</p>

                    <div class="form-group">
                        <label
                            >What skills do you have? (Select all that apply)</label
                        >
                        <div class="checkbox-grid">
                            {#each skillOptions as skill}
                                <label class="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={skills.includes(skill)}
                                        on:change={() =>
                                            (skills = toggleArrayItem(
                                                skills,
                                                skill,
                                            ))}
                                    />
                                    <span class="checkmark"></span>
                                    {skill}
                                </label>
                            {/each}
                        </div>
                    </div>

                    <div class="form-group">
                        <label
                            >What interests you? (Select all that apply)</label
                        >
                        <div class="checkbox-grid">
                            {#each interestOptions as interest}
                                <label class="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={interests.includes(interest)}
                                        on:change={() =>
                                            (interests = toggleArrayItem(
                                                interests,
                                                interest,
                                            ))}
                                    />
                                    <span class="checkmark"></span>
                                    {interest}
                                </label>
                            {/each}
                        </div>
                    </div>

                    <div class="form-group">
                        <label
                            >When are you available to work? (Select all that
                            apply)</label
                        >
                        <div class="checkbox-grid">
                            {#each availabilityOptions as availabilityOption}
                                <label class="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={availability.includes(
                                            availabilityOption,
                                        )}
                                        on:change={() =>
                                            (availability = toggleArrayItem(
                                                availability,
                                                availabilityOption,
                                            ))}
                                    />
                                    <span class="checkmark"></span>
                                    {availabilityOption}
                                </label>
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Step 6: Goals & Preferences (Teens Only) -->
            {#if currentStep === 6 && userType === "teen"}
                <div class="step-content">
                    <h3>Goals & Preferences</h3>
                    <p>Help us find the perfect opportunities for you</p>

                    <div class="form-group">
                        <label
                            >What are your job goals? (Select all that apply)</label
                        >
                        <div class="checkbox-grid">
                            {#each jobGoalOptions as goal}
                                <label class="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={jobGoals.includes(goal)}
                                        on:change={() =>
                                            (jobGoals = toggleArrayItem(
                                                jobGoals,
                                                goal,
                                            ))}
                                    />
                                    <span class="checkmark"></span>
                                    {goal}
                                </label>
                            {/each}
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="preferredPay">Preferred Pay Rate</label>
                        <select id="preferredPay" bind:value={preferredPay}>
                            <option value="">Select your preference</option>
                            {#each payOptions as pay}
                                <option value={pay}>{pay}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="workStyle">Preferred Work Style</label>
                        <select id="workStyle" bind:value={workStyle}>
                            <option value="">Select your preference</option>
                            {#each workStyleOptions as style}
                                <option value={style}>{style}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            {/if}

            <!-- Step 6: Employer Details (Employers Only) -->
            {#if currentStep === 6 && userType === "employer"}
                <div class="step-content">
                    <h3>Company Information</h3>
                    <p>
                        Tell us about your business so we can help you find
                        great candidates
                    </p>

                    <div class="form-group">
                        <label for="companyName">Company Name *</label>
                        <div class="input-wrapper">
                            <User size={20} class="input-icon" />
                            <input
                                id="companyName"
                                type="text"
                                bind:value={companyName}
                                placeholder="Enter your company name"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="companyType">Company Type</label>
                            <select id="companyType" bind:value={companyType}>
                                <option value="">Select company type</option>
                                {#each companyTypeOptions as type}
                                    <option value={type}>{type}</option>
                                {/each}
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="industry">Industry</label>
                            <select id="industry" bind:value={industry}>
                                <option value="">Select industry</option>
                                {#each industryOptions as ind}
                                    <option value={ind}>{ind}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="companySize">Company Size</label>
                        <select id="companySize" bind:value={companySize}>
                            <option value="">Select company size</option>
                            {#each companySizeOptions as size}
                                <option value={size}>{size}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="website">Company Website</label>
                        <div class="input-wrapper">
                            <Globe size={20} class="input-icon" />
                            <input
                                id="website"
                                type="url"
                                bind:value={website}
                                placeholder="https://yourcompany.com"
                            />
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Navigation Buttons -->
            {#if currentStep !== 4}
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
                            Next
                        </button>
                    {:else}
                        <button
                            type="submit"
                            class="btn btn-primary"
                            disabled={isLoading}
                        >
                            {#if isLoading}
                                Creating Account...
                            {:else}
                                Create Account
                            {/if}
                        </button>
                    {/if}
                </div>
            {/if}
        </form>

        <div class="auth-footer">
            <p>Already have an account? <a href="/auth/login">Login here</a></p>
        </div>
    </div>
</div>

<style>
    .auth-container {
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

    .auth-card {
        background: white;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        padding: 2.5rem;
        width: 100%;
        max-width: 500px;
        border: 1px solid var(--border);
    }

    .auth-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 1rem;
        text-decoration: none;
        transition: color var(--transition-fast);
    }

    .back-link:hover {
        color: var(--primary);
    }

    .auth-header h1 {
        color: var(--text);
        margin-bottom: 0.5rem;
        font-size: 2rem;
        font-weight: 700;
    }

    .auth-header p {
        color: var(--text-secondary);
        margin: 0 0 1.5rem 0;
        font-size: 1rem;
    }

    .progress-container {
        margin-bottom: 1.5rem;
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background: var(--border);
        border-radius: var(--radius-sm);
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .progress-fill {
        height: 100%;
        background: var(--primary);
        transition: width var(--transition-slow);
    }

    .progress-text {
        font-size: 0.9rem;
        color: var(--text-secondary);
        font-weight: 500;
    }

    .step-content h3 {
        color: var(--text);
        margin-bottom: 0.5rem;
        text-align: center;
        font-size: 1.5rem;
        font-weight: 600;
    }

    .step-content p {
        color: var(--text-secondary);
        margin-bottom: 2rem;
        text-align: center;
        font-size: 1rem;
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-group label {
        font-weight: 500;
        color: var(--text);
        font-size: 0.9rem;
    }

    .form-group small {
        font-size: 0.8rem;
        color: var(--text-secondary);
        margin-top: 0.25rem;
    }

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .input-icon {
        position: absolute;
        left: 1rem;
        color: var(--text-secondary);
        z-index: 1;
    }

    .input-wrapper input,
    .form-group select {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.75rem;
        border: 2px solid var(--border);
        border-radius: var(--radius-md);
        font-size: 1rem;
        transition: all var(--transition-fast);
        background: white;
        color: var(--text);
    }

    .form-group select {
        padding-left: 1rem;
    }

    .input-wrapper input:focus,
    .form-group select:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px var(--primary-light);
    }

    .input-wrapper input::placeholder {
        color: var(--text-muted);
    }

    .password-toggle {
        position: absolute;
        right: 1rem;
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0;
        transition: color var(--transition-fast);
        z-index: 1;
    }

    .password-toggle:hover {
        color: var(--text);
    }

    .checkbox-grid {
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
        padding: 0.5rem;
        border-radius: var(--radius-sm);
        transition: background-color var(--transition-fast);
    }

    .checkbox-label:hover {
        background: var(--surface-hover);
    }

    .checkbox-label input[type="checkbox"] {
        display: none;
    }

    .checkmark {
        width: 18px;
        height: 18px;
        border: 2px solid var(--border);
        border-radius: var(--radius-sm);
        position: relative;
        transition: all var(--transition-fast);
        flex-shrink: 0;
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

    .step-navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 2rem;
        gap: 1rem;
    }

    .step-navigation .btn {
        min-width: 120px;
    }

    .auth-footer {
        text-align: center;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border);
    }

    .auth-footer p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .auth-footer a {
        color: var(--primary);
        font-weight: 500;
        text-decoration: none;
        transition: color var(--transition-fast);
    }

    .auth-footer a:hover {
        color: var(--primary-dark);
    }

    .error-message {
        background: var(--error-light);
        color: var(--error);
        padding: 0.75rem;
        border-radius: var(--radius-md);
        border: 1px solid #fecaca;
        font-size: 0.9rem;
        text-align: center;
        margin-bottom: 1rem;
    }

    /* User Type Selection Styles */
    .user-type-selection {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .user-type-card {
        border: 2px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 2rem 1.5rem;
        text-align: center;
        cursor: pointer;
        transition: all var(--transition-fast);
        background: white;
    }

    .user-type-card:hover {
        border-color: var(--primary);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    .user-type-card.selected {
        border-color: var(--primary);
        background: var(--primary-light);
        box-shadow: var(--shadow-md);
    }

    .user-type-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .user-type-card h4 {
        color: var(--text);
        margin-bottom: 0.5rem;
        font-size: 1.25rem;
        font-weight: 600;
    }

    .user-type-card p {
        color: var(--text-secondary);
        margin-bottom: 1rem;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .user-type-card ul {
        list-style: none;
        padding: 0;
        margin: 0;
        text-align: left;
    }

    .user-type-card li {
        color: var(--text-secondary);
        font-size: 0.85rem;
        margin-bottom: 0.25rem;
        padding-left: 1rem;
        position: relative;
    }

    .user-type-card li::before {
        content: "✓";
        position: absolute;
        left: 0;
        color: var(--primary);
        font-weight: bold;
    }

    @media (max-width: 600px) {
        .auth-container {
            padding: 1rem 0.5rem;
        }

        .auth-card {
            padding: 2rem 1.5rem;
            margin: 1rem;
        }

        .form-row {
            grid-template-columns: 1fr;
        }

        .checkbox-grid {
            grid-template-columns: 1fr;
        }

        .user-type-selection {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .step-navigation {
            flex-direction: column;
            gap: 1rem;
        }

        .step-navigation .btn {
            width: 100%;
        }

        .auth-header h1 {
            font-size: 1.75rem;
        }

        .step-content h3 {
            font-size: 1.25rem;
        }
    }

    @media (max-width: 480px) {
        .auth-card {
            padding: 1.5rem 1rem;
        }

        .auth-header h1 {
            font-size: 1.5rem;
        }

        .step-content h3 {
            font-size: 1.1rem;
        }
    }
</style>
