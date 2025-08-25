<script lang="ts">
    import { Settings, User, Building, Eye, EyeOff } from "lucide-svelte";
    import { auth } from "$lib/stores/auth";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    // Props
    export let show = false;
    export let onClose: () => void = () => {};

    let selectedUserType = "teen"; // "teen" or "employer"
    let testUser = {
        id: "test-1",
        email: "test@example.com",
        name: "Test User",
    };

    function setUserType(type: string) {
        selectedUserType = type;

        // Update test user based on type
        if (type === "employer") {
            testUser = {
                id: "test-employer-1",
                email: "employer@example.com",
                name: "Test Employer",
            };
        } else {
            testUser = {
                id: "test-teen-1",
                email: "teen@example.com",
                name: "Test Teen",
            };
        }
    }

    function loginAsTestUser() {
        auth.login(testUser);
        dispatch("userTypeChanged", { type: selectedUserType });
    }

    function logoutTestUser() {
        auth.logout();
        dispatch("userTypeChanged", { type: null });
    }

    function getCurrentUserType() {
        if (!$auth.isAuthenticated) return "Not logged in";
        return selectedUserType === "employer" ? "Employer" : "Teenager";
    }
</script>

<div class="testing-ui">
    {#if show}
        <div class="testing-panel">
            <div class="testing-header">
                <h3>🧪 Testing UI</h3>
                <button class="close-btn" on:click={onClose}> × </button>
            </div>

            <div class="testing-content">
                <!-- Current Status -->
                <div class="status-section">
                    <h4>Current Status</h4>
                    <div class="status-grid">
                        <div class="status-item">
                            <span class="label">Authentication:</span>
                            <span
                                class="value"
                                class:authenticated={$auth.isAuthenticated}
                            >
                                {$auth.isAuthenticated
                                    ? "Logged In"
                                    : "Not Logged In"}
                            </span>
                        </div>
                        <div class="status-item">
                            <span class="label">User Type:</span>
                            <span class="value">{getCurrentUserType()}</span>
                        </div>
                        {#if $auth.isAuthenticated}
                            <div class="status-item">
                                <span class="label">User ID:</span>
                                <span class="value">{$auth.user?.id}</span>
                            </div>
                            <div class="status-item">
                                <span class="label">Email:</span>
                                <span class="value">{$auth.user?.email}</span>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- User Type Selection -->
                <div class="user-type-section">
                    <h4>Switch User Type</h4>
                    <div class="user-type-buttons">
                        <button
                            class="user-type-btn"
                            class:active={selectedUserType === "teen"}
                            on:click={() => setUserType("teen")}
                        >
                            <User size={16} />
                            Teenager
                        </button>
                        <button
                            class="user-type-btn"
                            class:active={selectedUserType === "employer"}
                            on:click={() => setUserType("employer")}
                        >
                            <Building size={16} />
                            Employer
                        </button>
                    </div>
                </div>

                <!-- Authentication Actions -->
                <div class="auth-actions">
                    <h4>Authentication</h4>
                    {#if $auth.isAuthenticated}
                        <button
                            class="btn btn-outline full-width"
                            on:click={logoutTestUser}
                        >
                            Logout Test User
                        </button>
                    {:else}
                        <button
                            class="btn btn-primary full-width"
                            on:click={loginAsTestUser}
                        >
                            Login as {selectedUserType === "employer"
                                ? "Employer"
                                : "Teenager"}
                        </button>
                    {/if}
                </div>

                <!-- Quick Actions -->
                <div class="quick-actions">
                    <h4>Quick Actions</h4>
                    <div class="action-buttons">
                        <a href="/jobs" class="btn btn-outline">
                            Browse Jobs
                        </a>
                        <a href="/employer/jobs/create" class="btn btn-outline">
                            Create Job
                        </a>
                        <a href="/dashboard" class="btn btn-outline">
                            Dashboard
                        </a>
                    </div>
                </div>

                <!-- Info -->
                <div class="info-section">
                    <p class="info-text">
                        <strong>Note:</strong> This testing UI allows you to quickly
                        switch between user types and authentication states for development
                        and testing purposes.
                    </p>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .testing-ui {
        position: relative;
        z-index: 1000;
    }

    .testing-toggle {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        padding: 0.5rem 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: var(--shadow-md);
        transition: all var(--transition-fast);
        z-index: 1001;
    }

    .testing-toggle:hover {
        background: var(--primary-dark);
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
    }

    .testing-panel {
        position: fixed;
        top: 80px;
        right: 20px;
        width: 350px;
        max-height: 80vh;
        background: white;
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        overflow: hidden;
        z-index: 1000;
    }

    .testing-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background: var(--surface);
        border-bottom: 1px solid var(--border);
    }

    .testing-header h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text);
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);
    }

    .close-btn:hover {
        background: var(--surface-hover);
        color: var(--text);
    }

    .testing-content {
        padding: 1.5rem;
        max-height: calc(80vh - 80px);
        overflow-y: auto;
    }

    .status-section,
    .user-type-section,
    .auth-actions,
    .quick-actions,
    .info-section {
        margin-bottom: 1.5rem;
    }

    .status-section h4,
    .user-type-section h4,
    .auth-actions h4,
    .quick-actions h4 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text);
    }

    .status-grid {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .status-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: var(--surface);
        border-radius: var(--radius-sm);
        font-size: 0.9rem;
    }

    .status-item .label {
        color: var(--text-secondary);
        font-weight: 500;
    }

    .status-item .value {
        color: var(--text);
        font-weight: 600;
    }

    .status-item .value.authenticated {
        color: var(--success);
    }

    .user-type-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
    }

    .user-type-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        border: 2px solid var(--border);
        border-radius: var(--radius-md);
        background: white;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all var(--transition-fast);
        font-size: 0.9rem;
        font-weight: 500;
    }

    .user-type-btn:hover {
        border-color: var(--primary);
        color: var(--primary);
        transform: translateY(-2px);
    }

    .user-type-btn.active {
        border-color: var(--primary);
        background: var(--primary-light);
        color: var(--primary);
    }

    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border-radius: var(--radius-md);
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
        transition: all var(--transition-fast);
        border: none;
        font-size: 0.9rem;
        width: 100%;
    }

    .btn-primary {
        background: var(--primary);
        color: white;
    }

    .btn-primary:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
    }

    .btn-outline {
        background: transparent;
        color: var(--text);
        border: 1px solid var(--border);
    }

    .btn-outline:hover {
        background: var(--surface-hover);
        border-color: var(--primary);
        color: var(--primary);
    }

    .full-width {
        width: 100%;
    }

    .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .info-text {
        font-size: 0.8rem;
        color: var(--text-secondary);
        line-height: 1.4;
        margin: 0;
        padding: 1rem;
        background: var(--surface);
        border-radius: var(--radius-md);
        border-left: 3px solid var(--primary);
    }

    @media (max-width: 768px) {
        .testing-toggle {
            top: 10px;
            right: 10px;
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
        }

        .testing-panel {
            top: 70px;
            right: 10px;
            left: 10px;
            width: auto;
        }

        .user-type-buttons {
            grid-template-columns: 1fr;
        }
    }
</style>
