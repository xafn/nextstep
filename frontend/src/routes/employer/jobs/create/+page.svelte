<script lang="ts">
    import {
        ArrowLeft,
        Briefcase,
        MapPin,
        Calendar,
        DollarSign,
        Clock,
        Users,
        FileText,
        Plus,
        Trash2,
        Save,
        Eye,
        Building,
        Globe,
        Mail,
        Phone,
    } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import { auth } from "$lib/stores/auth";
    import { onMount } from "svelte";

    // Job Details
    let jobTitle = "";
    let jobType = "";
    let location = "";
    let salary = "";
    let salaryType = "";
    let hoursPerWeek = "";
    let startDate = "";
    let duration = "";
    let isRemote = false;
    let description = "";
    let requirements = "";
    let benefits = "";
    let responsibilities: string[] = [];
    let qualifications: string[] = [];
    let skills: string[] = [];

    // Company Details
    let companyName = "";
    let companyDescription = "";
    let contactEmail = "";
    let contactPhone = "";

    let isLoading = false;
    let error = "";
    let success = "";

    // Check authentication on mount
    onMount(() => {
        if (!$auth.isAuthenticated) {
            goto("/auth/login?redirect=/employer/jobs/create");
        }
    });

    const jobTypeOptions = [
        "Part-time",
        "Full-time",
        "Internship",
        "Seasonal",
        "Temporary",
        "Freelance",
    ];

    const salaryTypeOptions = [
        "Hourly",
        "Weekly",
        "Monthly",
        "Project-based",
        "Negotiable",
    ];

    const durationOptions = [
        "1-3 months",
        "3-6 months",
        "6-12 months",
        "1+ years",
        "Ongoing",
        "Seasonal",
    ];

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
        "Computer Skills",
        "Social Media",
        "Data Entry",
        "Cash Handling",
        "Food Safety",
        "First Aid",
    ];

    function addResponsibility() {
        if (responsibilities.length < 10) {
            responsibilities = [...responsibilities, ""];
        }
    }

    function removeResponsibility(index: number) {
        responsibilities = responsibilities.filter((_, i) => i !== index);
    }

    function updateResponsibility(index: number, value: string) {
        responsibilities[index] = value;
        responsibilities = [...responsibilities];
    }

    function addQualification() {
        if (qualifications.length < 10) {
            qualifications = [...qualifications, ""];
        }
    }

    function removeQualification(index: number) {
        qualifications = qualifications.filter((_, i) => i !== index);
    }

    function updateQualification(index: number, value: string) {
        qualifications[index] = value;
        qualifications = [...qualifications];
    }

    function toggleSkill(skill: string) {
        if (skills.includes(skill)) {
            skills = skills.filter((s) => s !== skill);
        } else {
            skills = [...skills, skill];
        }
    }

    function validateForm(): boolean {
        if (!jobTitle || !jobType || !location || !description) {
            error = "Please fill in all required fields";
            return false;
        }

        if (responsibilities.length === 0) {
            error = "Please add at least one responsibility";
            return false;
        }

        if (qualifications.length === 0) {
            error = "Please add at least one qualification";
            return false;
        }

        return true;
    }

    async function handleSubmit() {
        if (!validateForm()) {
            return;
        }

        isLoading = true;
        error = "";
        success = "";

        try {
            // TODO: Connect to backend API
            await new Promise((resolve) => setTimeout(resolve, 2000));

            success = "Job listing created successfully!";

            // Redirect to job management page after a delay
            setTimeout(() => {
                goto("/employer/jobs");
            }, 2000);
        } catch (err) {
            error = "Failed to create job listing. Please try again.";
        } finally {
            isLoading = false;
        }
    }

    function previewJob() {
        // TODO: Implement job preview functionality
        alert("Job preview functionality coming soon!");
    }
</script>

<svelte:head>
    <title>Create Job Listing - NextStep</title>
    <meta
        name="description"
        content="Create a new job listing to find talented teenagers for your business"
    />
</svelte:head>

<div class="page-container">
    <div class="page-header">
        <a href="/employer/jobs" class="back-link">
            <ArrowLeft size={20} />
            Back to Jobs
        </a>
        <h1>Create Job Listing</h1>
        <p>
            Post a new job opportunity to find talented teenagers for your
            business
        </p>
    </div>

    <div class="content-grid">
        <!-- Main Form -->
        <div class="form-section">
            <form on:submit|preventDefault={handleSubmit}>
                {#if error}
                    <div class="error-message">
                        {error}
                    </div>
                {/if}

                {#if success}
                    <div class="success-message">
                        {success}
                    </div>
                {/if}

                <!-- Job Details -->
                <div class="form-card">
                    <div class="card-header">
                        <Briefcase size={24} />
                        <h2>Job Details</h2>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="jobTitle">Job Title *</label>
                            <input
                                id="jobTitle"
                                type="text"
                                bind:value={jobTitle}
                                placeholder="e.g., Customer Service Representative"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="jobType">Job Type *</label>
                            <select id="jobType" bind:value={jobType} required>
                                <option value="">Select job type</option>
                                {#each jobTypeOptions as type}
                                    <option value={type}>{type}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="location">Location *</label>
                            <div class="input-wrapper">
                                <MapPin size={20} class="input-icon" />
                                <input
                                    id="location"
                                    type="text"
                                    bind:value={location}
                                    placeholder="City, State or Remote"
                                    required
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="hoursPerWeek">Hours per Week</label>
                            <input
                                id="hoursPerWeek"
                                type="text"
                                bind:value={hoursPerWeek}
                                placeholder="e.g., 15-20 hours"
                            />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="salary">Salary/Pay</label>
                            <div class="input-wrapper">
                                <DollarSign size={20} class="input-icon" />
                                <input
                                    id="salary"
                                    type="text"
                                    bind:value={salary}
                                    placeholder="e.g., $12-15"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="salaryType">Pay Type</label>
                            <select id="salaryType" bind:value={salaryType}>
                                <option value="">Select pay type</option>
                                {#each salaryTypeOptions as type}
                                    <option value={type}>{type}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="startDate">Start Date</label>
                            <div class="input-wrapper">
                                <Calendar size={20} class="input-icon" />
                                <input
                                    id="startDate"
                                    type="date"
                                    bind:value={startDate}
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="duration">Duration</label>
                            <select id="duration" bind:value={duration}>
                                <option value="">Select duration</option>
                                {#each durationOptions as dur}
                                    <option value={dur}>{dur}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" bind:checked={isRemote} />
                            <span class="checkmark"></span>
                            Remote work available
                        </label>
                    </div>
                </div>

                <!-- Job Description -->
                <div class="form-card">
                    <div class="card-header">
                        <FileText size={24} />
                        <h2>Job Description</h2>
                    </div>

                    <div class="form-group">
                        <label for="description">Job Description *</label>
                        <textarea
                            id="description"
                            bind:value={description}
                            placeholder="Describe the role, what the candidate will be doing, and what makes this opportunity great for teenagers..."
                            rows="6"
                            required
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label for="requirements">Requirements</label>
                        <textarea
                            id="requirements"
                            bind:value={requirements}
                            placeholder="Any specific requirements or prerequisites..."
                            rows="4"
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label for="benefits">Benefits & Perks</label>
                        <textarea
                            id="benefits"
                            bind:value={benefits}
                            placeholder="What benefits or perks do you offer? (flexible hours, learning opportunities, etc.)"
                            rows="4"
                        ></textarea>
                    </div>
                </div>

                <!-- Responsibilities -->
                <div class="form-card">
                    <div class="card-header">
                        <Users size={24} />
                        <h2>Responsibilities</h2>
                    </div>

                    <div class="dynamic-list">
                        {#each responsibilities as responsibility, index}
                            <div class="list-item">
                                <input
                                    type="text"
                                    value={responsibility}
                                    placeholder="Enter responsibility"
                                    on:input={(e) =>
                                        updateResponsibility(
                                            index,
                                            (e.target as HTMLInputElement)
                                                .value,
                                        )}
                                />
                                <button
                                    type="button"
                                    class="remove-btn"
                                    on:click={() => removeResponsibility(index)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        {/each}

                        <button
                            type="button"
                            class="add-btn"
                            on:click={addResponsibility}
                            disabled={responsibilities.length >= 10}
                        >
                            <Plus size={16} />
                            Add Responsibility
                        </button>
                    </div>
                </div>

                <!-- Qualifications -->
                <div class="form-card">
                    <div class="card-header">
                        <Briefcase size={24} />
                        <h2>Qualifications</h2>
                    </div>

                    <div class="dynamic-list">
                        {#each qualifications as qualification, index}
                            <div class="list-item">
                                <input
                                    type="text"
                                    value={qualification}
                                    placeholder="Enter qualification"
                                    on:input={(e) =>
                                        updateQualification(
                                            index,
                                            (e.target as HTMLInputElement)
                                                .value,
                                        )}
                                />
                                <button
                                    type="button"
                                    class="remove-btn"
                                    on:click={() => removeQualification(index)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        {/each}

                        <button
                            type="button"
                            class="add-btn"
                            on:click={addQualification}
                            disabled={qualifications.length >= 10}
                        >
                            <Plus size={16} />
                            Add Qualification
                        </button>
                    </div>
                </div>

                <!-- Skills -->
                <div class="form-card">
                    <div class="card-header">
                        <Users size={24} />
                        <h2>Preferred Skills</h2>
                    </div>

                    <div class="skills-grid">
                        {#each skillOptions as skill}
                            <label class="skill-checkbox">
                                <input
                                    type="checkbox"
                                    checked={skills.includes(skill)}
                                    on:change={() => toggleSkill(skill)}
                                />
                                <span class="checkmark"></span>
                                {skill}
                            </label>
                        {/each}
                    </div>
                </div>

                <!-- Company Information -->
                <div class="form-card">
                    <div class="card-header">
                        <Building size={24} />
                        <h2>Company Information</h2>
                    </div>

                    <div class="form-group">
                        <label for="companyName">Company Name</label>
                        <input
                            id="companyName"
                            type="text"
                            bind:value={companyName}
                            placeholder="Your company name"
                        />
                    </div>

                    <div class="form-group">
                        <label for="companyDescription"
                            >Company Description</label
                        >
                        <textarea
                            id="companyDescription"
                            bind:value={companyDescription}
                            placeholder="Brief description of your company..."
                            rows="3"
                        ></textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="contactEmail">Contact Email</label>
                            <div class="input-wrapper">
                                <Mail size={20} class="input-icon" />
                                <input
                                    id="contactEmail"
                                    type="email"
                                    bind:value={contactEmail}
                                    placeholder="contact@company.com"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="contactPhone">Contact Phone</label>
                            <div class="input-wrapper">
                                <Phone size={20} class="input-icon" />
                                <input
                                    id="contactPhone"
                                    type="tel"
                                    bind:value={contactPhone}
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="form-actions">
                    <button
                        type="button"
                        class="btn btn-outline"
                        on:click={previewJob}
                    >
                        <Eye size={16} />
                        Preview
                    </button>

                    <div class="action-group">
                        <button
                            type="button"
                            class="btn btn-outline"
                            on:click={() => goto("/employer/jobs")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="btn btn-primary"
                            disabled={isLoading}
                        >
                            {#if isLoading}
                                <Save size={16} />
                                Creating...
                            {:else}
                                <Save size={16} />
                                Create Job Listing
                            {/if}
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <!-- Sidebar -->
        <div class="sidebar">
            <div class="sidebar-card">
                <h3>Tips for Great Job Listings</h3>
                <ul>
                    <li>Be specific about responsibilities</li>
                    <li>Include learning opportunities</li>
                    <li>Mention flexible scheduling</li>
                    <li>Highlight growth potential</li>
                    <li>Use clear, simple language</li>
                    <li>Include contact information</li>
                </ul>
            </div>

            <div class="sidebar-card">
                <h3>Teen-Friendly Features</h3>
                <ul>
                    <li>Flexible hours</li>
                    <li>Training provided</li>
                    <li>Mentorship opportunities</li>
                    <li>School schedule friendly</li>
                    <li>Growth potential</li>
                    <li>Safe work environment</li>
                </ul>
            </div>
        </div>
    </div>
</div>

<style>
    .page-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .page-header {
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

    .page-header h1 {
        color: var(--text);
        margin-bottom: 0.5rem;
        font-size: 2.5rem;
        font-weight: 700;
    }

    .page-header p {
        color: var(--text-secondary);
        font-size: 1.1rem;
    }

    .content-grid {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 2rem;
    }

    .form-section {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .form-card {
        background: white;
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 2rem;
        box-shadow: var(--shadow-sm);
    }

    .card-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border);
    }

    .card-header h2 {
        color: var(--text);
        font-size: 1.25rem;
        font-weight: 600;
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
        color: var(--text);
        font-weight: 500;
        margin-bottom: 0.5rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        font-size: 1rem;
        transition: border-color var(--transition-fast);
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px var(--primary-light);
    }

    .input-wrapper {
        position: relative;
    }

    .input-icon {
        position: absolute;
        left: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
    }

    .input-wrapper input {
        padding-left: 2.5rem;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .checkbox-label input[type="checkbox"] {
        width: auto;
        margin: 0;
    }

    .dynamic-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .list-item {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .list-item input {
        flex: 1;
    }

    .remove-btn {
        background: var(--error-light);
        color: var(--error);
        border: none;
        border-radius: var(--radius-sm);
        padding: 0.5rem;
        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .remove-btn:hover {
        background: var(--error);
        color: white;
    }

    .add-btn {
        background: var(--primary-light);
        color: var(--primary);
        border: 1px dashed var(--primary);
        border-radius: var(--radius-md);
        padding: 0.75rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all var(--transition-fast);
        font-size: 0.9rem;
    }

    .add-btn:hover:not(:disabled) {
        background: var(--primary);
        color: white;
    }

    .add-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 0.75rem;
    }

    .skill-checkbox {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
        padding: 0.5rem;
        border-radius: var(--radius-sm);
        transition: background var(--transition-fast);
    }

    .skill-checkbox:hover {
        background: var(--background-light);
    }

    .skill-checkbox input[type="checkbox"] {
        width: auto;
        margin: 0;
    }

    .form-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem;
        background: white;
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
    }

    .action-group {
        display: flex;
        gap: 1rem;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: var(--radius-md);
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
        transition: all var(--transition-fast);
        border: none;
        font-size: 1rem;
    }

    .btn-primary {
        background: var(--primary);
        color: white;
    }

    .btn-primary:hover:not(:disabled) {
        background: var(--primary-dark);
    }

    .btn-outline {
        background: transparent;
        color: var(--text);
        border: 1px solid var(--border);
    }

    .btn-outline:hover {
        background: var(--background-light);
        border-color: var(--text);
    }

    .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .sidebar {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .sidebar-card {
        background: white;
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
    }

    .sidebar-card h3 {
        color: var(--text);
        margin-bottom: 1rem;
        font-size: 1.1rem;
        font-weight: 600;
    }

    .sidebar-card ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .sidebar-card li {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        padding-left: 1rem;
        position: relative;
    }

    .sidebar-card li::before {
        content: "•";
        position: absolute;
        left: 0;
        color: var(--primary);
        font-weight: bold;
    }

    .error-message {
        background: var(--error-light);
        color: var(--error);
        padding: 1rem;
        border-radius: var(--radius-md);
        border: 1px solid #fecaca;
        margin-bottom: 1rem;
    }

    .success-message {
        background: var(--success-light);
        color: var(--success);
        padding: 1rem;
        border-radius: var(--radius-md);
        border: 1px solid #bbf7d0;
        margin-bottom: 1rem;
    }

    @media (max-width: 1024px) {
        .content-grid {
            grid-template-columns: 1fr;
        }

        .sidebar {
            order: -1;
        }
    }

    @media (max-width: 768px) {
        .page-container {
            padding: 1rem 0.5rem;
        }

        .page-header h1 {
            font-size: 2rem;
        }

        .form-row {
            grid-template-columns: 1fr;
        }

        .skills-grid {
            grid-template-columns: 1fr;
        }

        .form-actions {
            flex-direction: column;
            gap: 1rem;
        }

        .action-group {
            width: 100%;
            justify-content: space-between;
        }

        .btn {
            flex: 1;
            justify-content: center;
        }
    }
</style>
