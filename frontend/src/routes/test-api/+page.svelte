<script lang="ts">
    import { onMount } from "svelte";
    import { JobsAPI } from "$lib/api/jobs";
    import { config } from "$lib/config";

    let apiStatus = "Testing...";
    let jobsData: any = null;
    let error: string | null = null;

    onMount(async () => {
        try {
            console.log("Testing API connection...");
            console.log("Config API URL:", config.api.baseURL);

            apiStatus = "Making request...";
            const jobs = await JobsAPI.getJobs();

            apiStatus = "Success!";
            jobsData = jobs;
            console.log("Jobs loaded successfully:", jobs);
        } catch (err) {
            apiStatus = "Error!";
            error = err instanceof Error ? err.message : "Unknown error";
            console.error("API test failed:", err);
        }
    });
</script>

<svelte:head>
    <title>API Test - NextStep</title>
</svelte:head>

<div class="container">
    <h1>API Connection Test</h1>

    <div class="test-section">
        <h2>Status: {apiStatus}</h2>

        {#if error}
            <div class="error">
                <h3>Error:</h3>
                <p>{error}</p>
            </div>
        {/if}

        {#if jobsData}
            <div class="success">
                <h3>Success! Loaded {jobsData.length} jobs:</h3>
                <ul>
                    {#each jobsData.slice(0, 5) as job}
                        <li>{job.title} at {job.company}</li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>

    <div class="config-info">
        <h3>Configuration:</h3>
        <p>API Base URL: {config.api.baseURL}</p>
        <p>Environment: {import.meta.env.MODE}</p>
    </div>
</div>

<style>
    .container {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }

    .test-section {
        margin: 2rem 0;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
    }

    .error {
        color: red;
        background: #fee;
        padding: 1rem;
        border-radius: 4px;
    }

    .success {
        color: green;
        background: #efe;
        padding: 1rem;
        border-radius: 4px;
    }

    .config-info {
        background: #f5f5f5;
        padding: 1rem;
        border-radius: 4px;
    }
</style>
