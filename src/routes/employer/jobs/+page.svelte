<script lang="ts">
    import {
        Plus,
        Search,
        Filter,
        Eye,
        Edit,
        Trash2,
        Briefcase,
        MapPin,
        Calendar,
        Users,
        DollarSign,
        MoreVertical,
        CheckCircle,
        Clock,
        AlertCircle,
    } from "lucide-svelte";
    import { goto } from "$app/navigation";

    // Mock data - replace with actual API calls
    let jobs = [
        {
            id: "1",
            title: "Customer Service Representative",
            company: "TechStart Toronto",
            location: "Toronto, ON",
            type: "Part-time",
            salary: "$15-18/hour",
            applications: 12,
            status: "active",
            postedDate: "2024-01-15",
            startDate: "2024-02-01",
        },
        {
            id: "2",
            title: "Summer Camp Counselor",
            company: "TechStart Toronto",
            location: "Toronto, ON",
            type: "Seasonal",
            salary: "$16-20/hour",
            applications: 8,
            status: "draft",
            postedDate: "2024-01-10",
            startDate: "2024-06-01",
        },
        {
            id: "3",
            title: "Retail Sales Associate",
            company: "TechStart Toronto",
            location: "Toronto, ON",
            type: "Part-time",
            salary: "$14-16/hour",
            applications: 5,
            status: "active",
            postedDate: "2024-01-08",
            startDate: "2024-01-20",
        },
    ];

    let searchQuery = "";
    let statusFilter = "all";
    let sortBy = "postedDate";
    let showFilters = false;

    const statusOptions = [
        { value: "all", label: "All Jobs" },
        { value: "active", label: "Active" },
        { value: "draft", label: "Drafts" },
        { value: "expired", label: "Expired" },
        { value: "filled", label: "Filled" },
    ];

    const sortOptions = [
        { value: "postedDate", label: "Date Posted" },
        { value: "title", label: "Job Title" },
        { value: "applications", label: "Applications" },
        { value: "startDate", label: "Start Date" },
    ];

    function getFilteredJobs() {
        let filtered = jobs;

        // Search filter - search in title, company, location, and type
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (job) =>
                    job.title.toLowerCase().includes(searchLower) ||
                    job.company.toLowerCase().includes(searchLower) ||
                    job.location.toLowerCase().includes(searchLower) ||
                    job.type.toLowerCase().includes(searchLower) ||
                    job.salary.toLowerCase().includes(searchLower),
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((job) => job.status === statusFilter);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "postedDate":
                    return (
                        new Date(b.postedDate).getTime() -
                        new Date(a.postedDate).getTime()
                    );
                case "title":
                    return a.title.localeCompare(b.title);
                case "applications":
                    return b.applications - a.applications;
                case "startDate":
                    return (
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime()
                    );
                default:
                    return 0;
            }
        });

        return filtered;
    }

    function getStatusBadge(status: string) {
        switch (status) {
            case "active":
                return { text: "Active", class: "status-active" };
            case "draft":
                return { text: "Draft", class: "status-draft" };
            case "expired":
                return { text: "Expired", class: "status-expired" };
            case "filled":
                return { text: "Filled", class: "status-filled" };
            default:
                return { text: "Unknown", class: "status-unknown" };
        }
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    function viewJob(id: string) {
        goto(`/employer/jobs/${id}`);
    }

    function editJob(id: string) {
        goto(`/employer/jobs/${id}/edit`);
    }

    function deleteJob(id: string) {
        if (confirm("Are you sure you want to delete this job listing?")) {
            jobs = jobs.filter((job) => job.id !== id);
        }
    }

    const filteredJobs = getFilteredJobs();
</script>

<svelte:head>
    <title>Manage Job Listings - NextStep</title>
    <meta
        name="description"
        content="Manage your job listings and applications"
    />
</svelte:head>

<div class="page-container">
    <div class="page-header">
        <div class="header-content">
            <h1>Job Listings</h1>
            <p>Manage your job postings and view applications</p>
        </div>
        <button
            class="btn btn-primary"
            on:click={() => goto("/employer/jobs/create")}
        >
            <Plus size={16} />
            Create New Job
        </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon">
                <Briefcase size={24} />
            </div>
            <div class="stat-content">
                <h3>{jobs.length}</h3>
                <p>Total Jobs</p>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon active">
                <CheckCircle size={24} />
            </div>
            <div class="stat-content">
                <h3>{jobs.filter((job) => job.status === "active").length}</h3>
                <p>Active Jobs</p>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon applications">
                <Users size={24} />
            </div>
            <div class="stat-content">
                <h3>{jobs.reduce((sum, job) => sum + job.applications, 0)}</h3>
                <p>Total Applications</p>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon draft">
                <Clock size={24} />
            </div>
            <div class="stat-content">
                <h3>{jobs.filter((job) => job.status === "draft").length}</h3>
                <p>Draft Jobs</p>
            </div>
        </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
        <div class="search-box">
            <Search size={20} />
            <input
                type="text"
                placeholder="Search jobs..."
                bind:value={searchQuery}
            />
        </div>

        <div class="filter-controls">
            <select bind:value={statusFilter}>
                {#each statusOptions as option}
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>

            <select bind:value={sortBy}>
                {#each sortOptions as option}
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>

            <button
                class="btn btn-outline"
                on:click={() => (showFilters = !showFilters)}
            >
                <Filter size={16} />
                Filters
            </button>
        </div>
    </div>

    <!-- Jobs List -->
    <div class="jobs-container">
        {#if filteredJobs.length === 0}
            <div class="empty-state">
                <Briefcase size={48} />
                <h3>No jobs found</h3>
                <p>
                    {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "Create your first job listing to get started"}
                </p>
                {#if !searchQuery && statusFilter === "all"}
                    <button
                        class="btn btn-primary"
                        on:click={() => goto("/employer/jobs/create")}
                    >
                        <Plus size={16} />
                        Create Your First Job
                    </button>
                {/if}
            </div>
        {:else}
            <div class="jobs-grid">
                {#each filteredJobs as job}
                    <div class="job-card">
                        <div class="job-header">
                            <div class="job-title-section">
                                <h3>{job.title}</h3>
                                <span
                                    class="status-badge {getStatusBadge(
                                        job.status,
                                    ).class}"
                                >
                                    {getStatusBadge(job.status).text}
                                </span>
                            </div>
                            <div class="job-actions">
                                <button
                                    class="action-btn"
                                    on:click={() => viewJob(job.id)}
                                    title="View Job"
                                >
                                    <Eye size={16} />
                                </button>
                                <button
                                    class="action-btn"
                                    on:click={() => editJob(job.id)}
                                    title="Edit Job"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    class="action-btn danger"
                                    on:click={() => deleteJob(job.id)}
                                    title="Delete Job"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div class="job-details">
                            <div class="detail-item">
                                <MapPin size={16} />
                                <span>{job.location}</span>
                            </div>
                            <div class="detail-item">
                                <Briefcase size={16} />
                                <span>{job.type}</span>
                            </div>
                            <div class="detail-item">
                                <DollarSign size={16} />
                                <span>{job.salary}</span>
                            </div>
                            <div class="detail-item">
                                <Calendar size={16} />
                                <span>Starts {formatDate(job.startDate)}</span>
                            </div>
                        </div>

                        <div class="job-footer">
                            <div class="applications-info">
                                <Users size={16} />
                                <span>{job.applications} applications</span>
                            </div>
                            <div class="posted-date">
                                Posted {formatDate(job.postedDate)}
                            </div>
                        </div>

                        <div class="job-actions-mobile">
                            <button
                                class="btn btn-outline"
                                on:click={() => viewJob(job.id)}
                            >
                                View
                            </button>
                            <button
                                class="btn btn-outline"
                                on:click={() => editJob(job.id)}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .page-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
        gap: 2rem;
    }

    .header-content h1 {
        color: var(--text);
        margin-bottom: 0.5rem;
        font-size: 2.5rem;
        font-weight: 700;
    }

    .header-content p {
        color: var(--text-secondary);
        font-size: 1.1rem;
        margin: 0;
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

    .btn-primary:hover {
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

    /* Stats Grid */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background: white;
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: var(--shadow-sm);
    }

    .stat-icon {
        background: var(--primary-light);
        color: var(--primary);
        padding: 0.75rem;
        border-radius: var(--radius-md);
    }

    .stat-icon.active {
        background: var(--success-light);
        color: var(--success);
    }

    .stat-icon.applications {
        background: var(--info-light);
        color: var(--info);
    }

    .stat-icon.draft {
        background: var(--warning-light);
        color: var(--warning);
    }

    .stat-content h3 {
        color: var(--text);
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0 0 0.25rem 0;
    }

    .stat-content p {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin: 0;
    }

    /* Filters Section */
    .filters-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .search-box {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: white;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 0.75rem;
        flex: 1;
        max-width: 400px;
    }

    .search-box input {
        border: none;
        outline: none;
        width: 100%;
        font-size: 1rem;
    }

    .filter-controls {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .filter-controls select {
        padding: 0.75rem;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: white;
        font-size: 1rem;
    }

    /* Jobs Grid */
    .jobs-container {
        margin-top: 2rem;
    }

    .jobs-grid {
        display: grid;
        gap: 1.5rem;
    }

    .job-card {
        background: white;
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
        transition: all var(--transition-fast);
    }

    .job-card:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
    }

    .job-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }

    .job-title-section {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
    }

    .job-title-section h3 {
        color: var(--text);
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
    }

    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-full);
        font-size: 0.8rem;
        font-weight: 500;
    }

    .status-active {
        background: var(--success-light);
        color: var(--success);
    }

    .status-draft {
        background: var(--warning-light);
        color: var(--warning);
    }

    .status-expired {
        background: var(--error-light);
        color: var(--error);
    }

    .status-filled {
        background: var(--info-light);
        color: var(--info);
    }

    .job-actions {
        display: flex;
        gap: 0.5rem;
    }

    .action-btn {
        background: transparent;
        border: none;
        padding: 0.5rem;
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all var(--transition-fast);
        color: var(--text-secondary);
    }

    .action-btn:hover {
        background: var(--background-light);
        color: var(--text);
    }

    .action-btn.danger:hover {
        background: var(--error-light);
        color: var(--error);
    }

    .job-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .detail-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .job-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid var(--border);
    }

    .applications-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--primary);
        font-weight: 500;
        font-size: 0.9rem;
    }

    .posted-date {
        color: var(--text-secondary);
        font-size: 0.85rem;
    }

    .job-actions-mobile {
        display: none;
        gap: 0.5rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border);
    }

    .job-actions-mobile .btn {
        flex: 1;
        justify-content: center;
    }

    /* Empty State */
    .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-secondary);
    }

    .empty-state h3 {
        color: var(--text);
        margin: 1rem 0 0.5rem 0;
        font-size: 1.5rem;
    }

    .empty-state p {
        margin-bottom: 2rem;
        font-size: 1.1rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .page-container {
            padding: 1rem 0.5rem;
        }

        .page-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
        }

        .header-content h1 {
            font-size: 2rem;
        }

        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .filters-section {
            flex-direction: column;
            align-items: stretch;
        }

        .search-box {
            max-width: none;
        }

        .filter-controls {
            justify-content: space-between;
        }

        .job-header {
            flex-direction: column;
            gap: 1rem;
        }

        .job-actions {
            display: none;
        }

        .job-actions-mobile {
            display: flex;
        }

        .job-details {
            grid-template-columns: 1fr;
        }

        .job-footer {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
        }
    }

    @media (max-width: 480px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }

        .filter-controls {
            flex-direction: column;
        }
    }
</style>
