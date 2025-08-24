<script>
    import { page } from "$app/stores";
    import { Briefcase, User, LogOut } from "lucide-svelte";

    // Simple auth state - will be replaced with Django backend
    let isAuthenticated = false;
    let currentUser = null;

    // Check if user is on auth pages
    $: isAuthPage = $page.url.pathname.startsWith("/auth/");
    $: isJobPage = $page.url.pathname.startsWith("/jobs/");

    function logout() {
        isAuthenticated = false;
        currentUser = null;
        // TODO: Clear Django session
    }
</script>

<svelte:head>
    <title>NextStep - Your Path to Independence</title>
    <meta
        name="description"
        content="Find your first job, build skills, and gain independence. NextStep connects teenagers with opportunities that fit their schedule and goals."
    />
</svelte:head>

{#if !isAuthPage}
    <nav class="navbar">
        <div class="container">
            <div class="navbar-content">
                <a href="/" class="logo">NextStep</a>

                <div class="nav-links">
                    <a
                        href="/jobs"
                        class="nav-link {isJobPage ? 'active' : ''}"
                    >
                        <Briefcase size={16} />
                        Browse Jobs
                    </a>

                    {#if isAuthenticated}
                        <a href="/dashboard" class="nav-link">
                            <User size={16} />
                            Dashboard
                        </a>
                        <button class="btn btn-outline" on:click={logout}>
                            <LogOut size={16} />
                            Logout
                        </button>
                    {:else}
                        <a href="/auth/login" class="btn btn-outline">Login</a>
                        <a href="/auth/signup" class="btn btn-primary"
                            >Sign Up</a
                        >
                    {/if}
                </div>
            </div>
        </div>
    </nav>
{/if}

<main>
    <slot />
</main>

<style>
    .navbar {
        background: white;
        border-bottom: 1px solid var(--border);
        padding: 1rem 0;
        position: sticky;
        top: 0;
        z-index: 100;
    }

    .navbar-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .logo {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary);
        text-decoration: none;
    }

    .nav-links {
        display: flex;
        gap: 1.5rem;
        align-items: center;
    }

    .nav-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text);
        font-weight: 500;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        transition: all 0.2s ease;
    }

    .nav-link:hover,
    .nav-link.active {
        color: var(--primary);
        background: var(--surface);
    }

    main {
        min-height: calc(100vh - 80px);
    }

    @media (max-width: 768px) {
        .nav-links {
            gap: 1rem;
        }

        .nav-link span {
            display: none;
        }
    }
</style>
