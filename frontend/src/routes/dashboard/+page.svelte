<script lang="ts">
    import {
        User,
        Briefcase,
        Clock,
        CheckCircle,
        XCircle,
        Eye,
        TrendingUp,
        Calendar,
        MapPin,
        DollarSign,
        Star,
        Award,
        Target,
        Zap,
        Trophy,
        Flame,
        Gift,
        Rocket,
    } from "lucide-svelte";
    import { onMount } from "svelte";
    import LevelProgress from "$lib/components/LevelProgress.svelte";
    import Achievements from "$lib/components/Achievements.svelte";
    import Tasks from "$lib/components/Tasks.svelte";
    import FinancialGoals from "$lib/components/FinancialGoals.svelte";
    import StreakCounter from "$lib/components/StreakCounter.svelte";
    import NotificationToast from "$lib/components/NotificationToast.svelte";
    import {
        gamificationStore,
        currentLevel,
        nextLevel,
        levelProgress,
        unlockedAchievements,
        pendingTasks,
        checkAchievements,
        updateStreak,
        addXP,
        unlockAchievement,
        completeTask,
        addFinancialGoal,
    } from "$lib/stores/gamification.js";
    import { resumeStore } from "$lib/stores/resume.js";

    // Sample user data - will come from Django backend
    let user = {
        firstName: "Alex",
        lastName: "Johnson",
        email: "alex.johnson@email.com",
        joinDate: "January 2024",
        applications: 5,
        interviews: 2,
        profileComplete: 85,
        lastActive: "2 hours ago",
        location: "Scarborough, ON",
        preferredPay: "$18-25/hour",
        skills: ["Customer Service", "Communication", "Organization"],
        goals: ["Save for college", "Build resume", "Learn new skills"],
    };

    // Sample application data
    let applications = [
        {
            id: 1,
            jobTitle: "Lawn Mowing & Yard Work",
            company: "Green Thumb Services",
            status: "Under Review",
            appliedDate: "2024-01-15",
            lastUpdated: "2024-01-18",
            location: "Scarborough, ON",
            pay: "$20-25/hour",
            type: "Gig",
        },
        {
            id: 2,
            jobTitle: "Private Math Tutor",
            company: "Toronto Math Academy",
            status: "Interview Scheduled",
            appliedDate: "2024-01-10",
            lastUpdated: "2024-01-16",
            location: "North York, ON",
            pay: "$25-35/hour",
            type: "Part-time",
        },
        {
            id: 3,
            jobTitle: "Lifeguard",
            company: "Toronto Community Centres",
            status: "Application Submitted",
            appliedDate: "2024-01-20",
            lastUpdated: "2024-01-20",
            location: "Etobicoke, ON",
            pay: "$18-22/hour",
            type: "Part-time",
        },
    ];

    let mounted = false;
    let notifications: Array<{
        id: number;
        type: string;
        title: string;
        message: string;
        show: boolean;
    }> = [];

    function getStatusColor(status: string) {
        switch (status) {
            case "Under Review":
                return "status-review";
            case "Interview Scheduled":
                return "status-interview";
            case "Application Submitted":
                return "status-submitted";
            case "Rejected":
                return "status-rejected";
            case "Hired":
                return "status-hired";
            default:
                return "status-default";
        }
    }

    function getStatusIcon(status: string) {
        switch (status) {
            case "Under Review":
                return Clock;
            case "Interview Scheduled":
                return CheckCircle;
            case "Application Submitted":
                return Briefcase;
            case "Rejected":
                return XCircle;
            case "Hired":
                return CheckCircle;
            default:
                return Briefcase;
        }
    }

    function showNotification(type: string, title: string, message: string) {
        const id = Date.now();
        notifications = [
            ...notifications,
            { id, type, title, message, show: true },
        ];

        setTimeout(() => {
            notifications = notifications.filter((n) => n.id !== id);
        }, 6000);
    }

    function handleNotificationClose(event: CustomEvent<{ id: number }>) {
        const { id } = event.detail;
        notifications = notifications.filter((n) => n.id !== id);
    }

    // Demo functions to showcase gamification
    function demoCompleteTask() {
        completeTask("complete-profile");
        showNotification(
            "success",
            "Task Completed!",
            "Profile completion task finished. +100 XP earned!",
        );
    }

    function demoUnlockAchievement() {
        unlockAchievement("first-resume");
        showNotification(
            "achievement",
            "Achievement Unlocked!",
            "First Steps - Create your first resume. +50 XP earned!",
        );
    }

    function demoAddXP() {
        addXP(200);
        showNotification("xp", "XP Gained!", "+200 XP added to your account!");
    }

    function demoAddFinancialGoal() {
        addFinancialGoal({
            title: "Save for College",
            targetAmount: 5000,
            currentAmount: 0,
            deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            completed: false,
        });
        showNotification(
            "success",
            "Financial Goal Added!",
            "New goal: Save $5,000 for college",
        );
    }

    onMount(() => {
        mounted = true;
        updateStreak();
        checkAchievements();

        // Add some demo data
        setTimeout(() => {
            // Add a financial goal for demo
            if ($gamificationStore.financialGoals.length === 0) {
                addFinancialGoal({
                    title: "Save for College",
                    targetAmount: 5000,
                    currentAmount: 1200,
                    deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                    completed: false,
                });
            }

            // Add some XP to make it more interesting
            if ($gamificationStore.xp < 100) {
                addXP(150);
            }
        }, 1000);
    });
</script>

<svelte:head>
    <title>Dashboard - NextStep</title>
    <meta
        name="description"
        content="Track your job applications and manage your NextStep profile"
    />
</svelte:head>

<!-- Notification Toasts -->
{#each notifications as notification (notification.id)}
    <NotificationToast
        type={notification.type}
        title={notification.title}
        message={notification.message}
        show={notification.show}
        on:close={() =>
            handleNotificationClose({
                detail: { id: notification.id },
            } as CustomEvent<{ id: number }>)}
    />
{/each}

<div class="dashboard">
    <div class="container">
        <!-- Welcome Header with Level Progress -->
        <div class="welcome-header" class:animate-fade-in-up={mounted}>
            <div class="welcome-content">
                <div class="welcome-text">
                    <div class="welcome-badge">
                        <Trophy size={16} />
                        <span
                            >Level {$currentLevel.level} - {$currentLevel.title}</span
                        >
                    </div>
                    <h1>Hello, {user.firstName}! 👋</h1>
                    <p>
                        You're on your way to becoming a {$nextLevel?.title ||
                            "career champion"}!
                    </p>
                    <div class="user-meta">
                        <div class="meta-item">
                            <MapPin size={16} />
                            <span>{user.location}</span>
                        </div>
                        <div class="meta-item">
                            <Calendar size={16} />
                            <span>Member since {user.joinDate}</span>
                        </div>
                        <div class="meta-item">
                            <Flame size={16} />
                            <span>{$gamificationStore.streak} day streak</span>
                        </div>
                    </div>
                </div>
                <div class="welcome-avatar">
                    <div class="level-badge">
                        <span class="level-number">{$currentLevel.level}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Level Progress Bar -->
        <div
            class="level-progress-section"
            class:animate-fade-in-up={mounted}
            style="animation-delay: 0.1s"
        >
            <LevelProgress showDetails={false} />
        </div>

        <!-- Demo Actions (for testing) -->
        <div
            class="demo-actions"
            class:animate-fade-in-up={mounted}
            style="animation-delay: 0.15s"
        >
            <h4>Demo Actions (Testing)</h4>
            <div class="demo-buttons">
                <button
                    class="btn btn-outline btn-sm"
                    on:click={demoCompleteTask}
                >
                    <CheckCircle size={16} />
                    Complete Task
                </button>
                <button
                    class="btn btn-outline btn-sm"
                    on:click={demoUnlockAchievement}
                >
                    <Trophy size={16} />
                    Unlock Achievement
                </button>
                <button class="btn btn-outline btn-sm" on:click={demoAddXP}>
                    <Zap size={16} />
                    Add XP
                </button>
                <button
                    class="btn btn-outline btn-sm"
                    on:click={demoAddFinancialGoal}
                >
                    <DollarSign size={16} />
                    Add Financial Goal
                </button>
            </div>
        </div>

        <!-- Main Dashboard Content -->
        <div
            class="dashboard-content"
            class:animate-fade-in-up={mounted}
            style="animation-delay: 0.2s"
        >
            <!-- Top Row: Stats and Streak -->
            <div class="dashboard-row">
                <!-- Stats Cards -->
                <div class="stats-section">
                    <h3>Your Progress</h3>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon applications">
                                <Briefcase size={24} />
                            </div>
                            <div class="stat-content">
                                <h3>{$gamificationStore.totalApplications}</h3>
                                <p>Applications</p>
                                <div class="stat-trend">
                                    <TrendingUp size={14} />
                                    <span>+2 this week</span>
                                </div>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon interviews">
                                <Clock size={24} />
                            </div>
                            <div class="stat-content">
                                <h3>{$gamificationStore.totalInterviews}</h3>
                                <p>Interviews</p>
                                <div class="stat-trend">
                                    <CheckCircle size={14} />
                                    <span>1 scheduled</span>
                                </div>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon member">
                                <User size={24} />
                            </div>
                            <div class="stat-content">
                                <h3>{user.profileComplete}%</h3>
                                <p>Profile Complete</p>
                                <div class="stat-trend">
                                    <Target size={14} />
                                    <span>Almost there!</span>
                                </div>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon pay">
                                <DollarSign size={24} />
                            </div>
                            <div class="stat-content">
                                <h3>{user.preferredPay}</h3>
                                <p>Target Pay</p>
                                <div class="stat-trend">
                                    <Star size={14} />
                                    <span>Competitive</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Streak Counter -->

                <StreakCounter />
            </div>

            <!-- Second Row: Tasks and Achievements -->

            <!-- Tasks Section -->
            <Tasks showCompleted={false} maxDisplay={5} />

            <!-- Achievements Section -->

            <Achievements showAll={false} maxDisplay={4} />

            <!-- Third Row: Financial Goals -->
            <div class="dashboard-row">
                <FinancialGoals />
            </div>

            <!-- Fourth Row: Applications -->
            <div class="dashboard-row">
                <div class="applications-section">
                    <div class="section-header">
                        <h3>Your Applications</h3>
                        <a href="/jobs" class="btn btn-primary">
                            Browse More Jobs
                            <Briefcase size={16} />
                        </a>
                    </div>

                    {#if applications.length > 0}
                        <div class="applications-grid">
                            {#each applications as application, index}
                                <div
                                    class="application-card"
                                    class:animate-fade-in-up={mounted}
                                    style="animation-delay: {0.3 +
                                        index * 0.1}s"
                                >
                                    <div class="application-header">
                                        <div class="application-title">
                                            <h3>{application.jobTitle}</h3>
                                            <p class="company-name">
                                                {application.company}
                                            </p>
                                        </div>
                                        <div
                                            class="status-badge {getStatusColor(
                                                application.status,
                                            )}"
                                        >
                                            {#if getStatusIcon(application.status)}
                                                <svelte:component
                                                    this={getStatusIcon(
                                                        application.status,
                                                    )}
                                                    size={16}
                                                />
                                            {/if}
                                            {application.status}
                                        </div>
                                    </div>

                                    <div class="application-details">
                                        <div class="detail-row">
                                            <div class="detail-item">
                                                <MapPin size={14} />
                                                <span
                                                    >{application.location}</span
                                                >
                                            </div>
                                            <div class="detail-item">
                                                <DollarSign size={14} />
                                                <span>{application.pay}</span>
                                            </div>
                                            <div class="detail-item">
                                                <Briefcase size={14} />
                                                <span>{application.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="application-meta">
                                        <div class="meta-item">
                                            <span class="meta-label"
                                                >Applied:</span
                                            >
                                            <span class="meta-value"
                                                >{new Date(
                                                    application.appliedDate,
                                                ).toLocaleDateString()}</span
                                            >
                                        </div>
                                        <div class="meta-item">
                                            <span class="meta-label"
                                                >Last Updated:</span
                                            >
                                            <span class="meta-value"
                                                >{new Date(
                                                    application.lastUpdated,
                                                ).toLocaleDateString()}</span
                                            >
                                        </div>
                                    </div>

                                    <div class="application-actions">
                                        <button class="btn btn-outline">
                                            <Eye size={16} />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div class="no-applications animate-fade-in-up">
                            <div class="no-applications-content">
                                <Briefcase size={48} />
                                <h3>No applications yet</h3>
                                <p>
                                    Start your journey by applying to your first
                                    job!
                                </p>
                                <a href="/jobs" class="btn btn-primary">
                                    Browse Jobs
                                    <Briefcase size={16} />
                                </a>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .dashboard {
        padding: 2rem 0;
        background: var(--surface);
        min-height: 100vh;
    }

    .welcome-header {
        background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--primary-dark) 100%
        );
        border-radius: var(--radius-xl);
        padding: 2.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid var(--border);
        color: white;
        position: relative;
        overflow: hidden;
    }

    .welcome-header::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        opacity: 0.3;
    }

    .welcome-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        z-index: 1;
    }

    .welcome-badge {
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

    .welcome-text h1 {
        margin-bottom: 0.5rem;
        color: white;
        font-size: clamp(2rem, 4vw, 2.5rem);
    }

    .welcome-text p {
        color: rgba(255, 255, 255, 0.9);
        margin: 0 0 1.5rem 0;
        font-size: 1.1rem;
    }

    .user-meta {
        display: flex;
        gap: 1.5rem;
        flex-wrap: wrap;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
    }

    .welcome-avatar {
        width: 5rem;
        height: 5rem;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        backdrop-filter: blur(10px);
    }

    .level-badge {
        width: 3rem;
        height: 3rem;
        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #1a1a1a;
        font-weight: 700;
        font-size: 1.5rem;
    }

    .level-progress-section {
        margin-bottom: 1rem;
    }

    .demo-actions {
        background: white;
        border-radius: var(--radius-lg);
        padding: 1rem;
        margin-bottom: 1.5rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow-sm);
    }

    .demo-actions h4 {
        margin: 0 0 0.75rem 0;
        color: var(--text);
        font-size: 1rem;
        opacity: 0.8;
    }

    h3 {
        margin: 0 0 0.5rem 0;
        color: var(--text);
        font-size: 1.25rem;
    }

    .demo-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .dashboard-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .dashboard-row {
        display: grid;
        gap: 2rem;
    }

    .dashboard-row:nth-child(1) {
        grid-template-columns: 2fr 1fr;
    }

    .dashboard-row:nth-child(2) {
        grid-template-columns: 1fr 1fr;
    }

    .dashboard-row:nth-child(3),
    .dashboard-row:nth-child(4) {
        grid-template-columns: 1fr;
    }

    .stats-section,
    .streak-section,
    .tasks-section,
    .achievements-section,
    .financial-goals-section,
    .applications-section {
        background: white;
        border-radius: var(--radius-xl);
        padding: 1.5rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow-sm);
    }

    .stats-section h3,
    .tasks-section h3,
    .achievements-section h3 {
        margin: 0 0 1.5rem 0;
        color: var(--text);
        font-size: 1.25rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }

    .stat-card {
        background: var(--surface);
        border-radius: var(--radius-lg);
        padding: 1.25rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border: 1px solid var(--border);
        transition: all var(--transition-normal);
    }

    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: var(--primary);
    }

    .stat-icon {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
    }

    .stat-icon.applications {
        background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--primary-dark) 100%
        );
    }

    .stat-icon.interviews {
        background: linear-gradient(
            135deg,
            var(--secondary) 0%,
            var(--secondary-dark) 100%
        );
    }

    .stat-icon.member {
        background: linear-gradient(
            135deg,
            var(--accent) 0%,
            var(--accent-dark) 100%
        );
    }

    .stat-icon.pay {
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    }

    .stat-content h3 {
        margin: 0 0 0.25rem 0;
        color: var(--text);
        font-size: 1.5rem;
    }

    .stat-content p {
        margin: 0 0 0.5rem 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .stat-trend {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.8rem;
        color: var(--primary);
        font-weight: 600;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .section-header h2 {
        margin: 0;
        color: var(--text);
        background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--primary-dark) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .applications-grid {
        display: grid;
        gap: 1rem;
    }

    .application-card {
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        transition: all var(--transition-normal);
        background: var(--surface);
    }

    .application-card:hover {
        border-color: var(--primary);
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
    }

    .application-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }

    .application-title h3 {
        margin: 0 0 0.25rem 0;
        color: var(--text);
    }

    .company-name {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .status-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        border-radius: var(--radius-md);
        font-size: 0.8rem;
        font-weight: 500;
        white-space: nowrap;
    }

    .status-review {
        background: var(--warning-light);
        color: var(--warning);
    }

    .status-interview {
        background: var(--info-light);
        color: var(--info);
    }

    .status-submitted {
        background: var(--success-light);
        color: var(--success);
    }

    .status-rejected {
        background: var(--error-light);
        color: var(--error);
    }

    .status-hired {
        background: var(--success-light);
        color: var(--success);
    }

    .application-details {
        margin-bottom: 1rem;
    }

    .detail-row {
        display: flex;
        gap: 1.5rem;
        flex-wrap: wrap;
    }

    .detail-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .application-meta {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .meta-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .meta-label {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .meta-value {
        font-size: 0.9rem;
        color: var(--text);
        font-weight: 500;
    }

    .application-actions {
        display: flex;
        justify-content: flex-end;
    }

    .no-applications {
        text-align: center;
        padding: 3rem 2rem;
    }

    .no-applications-content {
        color: var(--text-secondary);
    }

    .no-applications-content h3 {
        margin: 1rem 0 0.5rem 0;
        color: var(--text);
    }

    .no-applications-content p {
        margin-bottom: 1.5rem;
    }

    @media (max-width: 1200px) {
        .dashboard-row:nth-child(1) {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 1024px) {
        .dashboard-row:nth-child(2) {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .welcome-content {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
        }

        .user-meta {
            justify-content: center;
        }

        .demo-buttons {
            flex-direction: column;
        }

        .stats-grid {
            grid-template-columns: 1fr;
        }

        .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
        }

        .application-meta {
            grid-template-columns: 1fr;
        }

        .detail-row {
            flex-direction: column;
            gap: 0.75rem;
        }
    }

    @media (max-width: 480px) {
        .welcome-header {
            padding: 2rem 1.5rem;
        }

        .user-meta {
            flex-direction: column;
            gap: 0.75rem;
        }

        .stat-card {
            padding: 1rem;
        }

        .applications-section {
            padding: 1.5rem;
        }
    }
</style>
