<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { auth } from "$lib/stores/auth";

    onMount(() => {
        // Logout the user
        auth.logout();

        // Redirect to home page
        goto("/");
    });
</script>

<svelte:head>
    <title>Logging Out - NextStep</title>
</svelte:head>

<div class="logout-container">
    <div class="logout-card">
        <h1>Logging Out...</h1>
        <p>You are being logged out and redirected to the home page.</p>
        <div class="loading-spinner"></div>
    </div>
</div>

<style>
    .logout-container {
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

    .logout-card {
        background: white;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        padding: 3rem 2rem;
        text-align: center;
        max-width: 400px;
        width: 100%;
        border: 1px solid var(--border);
    }

    .logout-card h1 {
        color: var(--text);
        margin-bottom: 1rem;
        font-size: 1.75rem;
        font-weight: 600;
    }

    .logout-card p {
        color: var(--text-secondary);
        margin-bottom: 2rem;
        font-size: 1rem;
    }

    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--border);
        border-top: 4px solid var(--primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
