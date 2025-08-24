<script>
  import "../app.css";
  import { page } from "$app/stores";
  import { Briefcase, User, LogOut, Menu, X, File } from "lucide-svelte";
  import { onMount } from "svelte";
  import { auth } from "$lib/stores/auth";

  let isScrolled = false;
  let isMobileMenuOpen = false;

  // Check if user is on auth pages
  $: isAuthPage = $page.url.pathname.startsWith("/auth/");
  $: isJobPage = $page.url.pathname.startsWith("/jobs/");

  function logout() {
    auth.logout();
  }

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }

  onMount(() => {
    // Initialize auth store
    auth.initialize();

    function handleScroll() {
      isScrolled = window.scrollY > 20;
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
</script>

<svelte:head>
  <title>NextStep - Your Path to Independence</title>
  <meta
    name="description"
    content="Find your first job, build skills, and gain independence. NextStep connects teenagers with opportunities that fit their schedule and goals."
  />
</svelte:head>

{#if !isAuthPage}
  <nav class="navbar" class:scrolled={isScrolled}>
    <div class="container">
      <div class="navbar-content">
        <a href="/" class="logo">NextStep</a>

        <!-- Desktop Navigation -->
        <div class="nav-links desktop-nav">
          <a href="/jobs" class="nav-link {isJobPage ? 'active' : ''}">
            <Briefcase size={16} />
            Browse Jobs
          </a>

          {#if $auth.isAuthenticated}
            <a href="/dashboard" class="nav-link">
              <User size={16} />
              Dashboard
            </a>
            <a href="/resume" class="nav-link">
              <File size={16} />
              Resume Builder
            </a>
            <button class="btn btn-outline" on:click={logout}>
              <LogOut size={16} />
              Logout
            </button>
          {:else}
            <a href="/auth/login" class="btn btn-outline">Login</a>
            <a href="/auth/signup" class="btn btn-primary">Sign Up</a>
          {/if}
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="mobile-menu-btn"
          on:click={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {#if isMobileMenuOpen}
            <X size={24} />
          {:else}
            <Menu size={24} />
          {/if}
        </button>
      </div>

      <!-- Mobile Navigation -->
      {#if isMobileMenuOpen}
        <div class="mobile-nav">
          <a
            href="/jobs"
            class="mobile-nav-link {isJobPage ? 'active' : ''}"
            on:click={closeMobileMenu}
          >
            <Briefcase size={20} />
            Browse Jobs
          </a>

          {#if $auth.isAuthenticated}
            <a
              href="/dashboard"
              class="mobile-nav-link"
              on:click={closeMobileMenu}
            >
              <User size={20} />
              Dashboard
            </a>
            <button
              class="btn btn-outline full-width"
              on:click={() => {
                logout();
                closeMobileMenu();
              }}
            >
              <LogOut size={20} />
              Logout
            </button>
          {:else}
            <a
              href="/auth/login"
              class="btn btn-outline full-width"
              on:click={closeMobileMenu}>Login</a
            >
            <a
              href="/auth/signup"
              class="btn btn-primary full-width"
              on:click={closeMobileMenu}>Sign Up</a
            >
          {/if}
        </div>
      {/if}
    </div>
  </nav>
{/if}

<main>
  <slot />
</main>

<style>
  .navbar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
    transition: all var(--transition-normal);
  }

  .navbar.scrolled {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: var(--shadow-md);
    padding: 0.75rem 0;
  }

  .navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--primary);
    background: linear-gradient(
      135deg,
      var(--primary) 0%,
      var(--primary-dark) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
    transition: all var(--transition-fast);
  }

  .logo:hover {
    transform: scale(1.05);
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
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    position: relative;
  }

  .nav-link::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--primary);
    transition: all var(--transition-normal);
    transform: translateX(-50%);
  }

  .nav-link:hover,
  .nav-link.active {
    color: var(--primary);
    background: var(--primary-light);
  }

  .nav-link:hover::before,
  .nav-link.active::before {
    width: 80%;
  }

  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    color: var(--text);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }

  .mobile-menu-btn:hover {
    background: var(--surface);
    color: var(--primary);
  }

  .mobile-nav {
    display: none;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem 0;
    border-top: 1px solid var(--border);
    margin-top: 1rem;
  }

  .mobile-nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text);
    font-weight: 500;
    text-decoration: none;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }

  .mobile-nav-link:hover,
  .mobile-nav-link.active {
    color: var(--primary);
    background: var(--primary-light);
  }

  .full-width {
    width: 100%;
    justify-content: center;
  }

  main {
    min-height: calc(100vh - 80px);
  }

  @media (max-width: 768px) {
    .desktop-nav {
      display: none;
    }

    .mobile-menu-btn {
      display: block;
    }

    .mobile-nav {
      display: flex;
    }

    .navbar.scrolled {
      padding: 0.5rem 0;
    }
  }

  @media (max-width: 480px) {
    .logo {
      font-size: 1.5rem;
    }

    .mobile-nav {
      padding: 1rem 0;
    }
  }
</style>
