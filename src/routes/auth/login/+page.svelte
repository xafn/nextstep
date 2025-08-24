<script>
    import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import { auth } from "$lib/stores/auth";

    let email = "";
    let password = "";
    let showPassword = false;
    let isLoading = false;
    let error = "";

    async function handleLogin() {
        if (!email || !password) {
            error = "Please fill in all fields";
            return;
        }

        isLoading = true;
        error = "";

        try {
            // TODO: Connect to Django backend
            // For now, simulate login
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Create mock user data
            const user = {
                id: "1",
                email: email,
                name: email.split("@")[0], // Use email prefix as name for demo
            };

            // Login user
            auth.login(user);

            // Redirect to dashboard
            goto("/dashboard");
        } catch (err) {
            error = "Login failed. Please try again.";
        } finally {
            isLoading = false;
        }
    }
</script>

<svelte:head>
    <title>Login - NextStep</title>
    <meta
        name="description"
        content="Login to your NextStep account and start your journey to independence"
    />
</svelte:head>

<div class="auth-container">
    <div class="auth-card">
        <div class="auth-header">
            <a href="/" class="back-link">
                <ArrowLeft size={20} />
                Back to Home
            </a>
            <h1>Welcome Back!</h1>
            <p>Login to continue your journey toward independence</p>
        </div>

        <form on:submit|preventDefault={handleLogin} class="auth-form">
            {#if error}
                <div class="error-message">
                    {error}
                </div>
            {/if}

            <div class="form-group">
                <label for="email">Email Address</label>
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

            <div class="form-group">
                <label for="password">Password</label>
                <div class="input-wrapper">
                    <Lock size={20} class="input-icon" />
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        bind:value={password}
                        placeholder="Enter your password"
                        required
                    />
                    <button
                        type="button"
                        class="password-toggle"
                        on:click={() => (showPassword = !showPassword)}
                    >
                        {#if showPassword}
                            <EyeOff size={20} />
                        {:else}
                            <Eye size={20} />
                        {/if}
                    </button>
                </div>
            </div>

            <div class="form-options">
                <label class="checkbox-label">
                    <input type="checkbox" />
                    <span class="checkmark"></span>
                    Remember me
                </label>
                <a href="/auth/forgot-password" class="forgot-link"
                    >Forgot password?</a
                >
            </div>

            <button
                type="submit"
                class="btn btn-primary full-width"
                disabled={isLoading}
            >
                {#if isLoading}
                    Logging in...
                {:else}
                    Login
                {/if}
            </button>
        </form>

        <div class="auth-footer">
            <p>
                Don't have an account? <a href="/auth/signup">Sign up here</a>
            </p>
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

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
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
    }

    .input-wrapper input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.75rem;
        border: 2px solid var(--border);
        border-radius: var(--radius-md);
        font-size: 1rem;
        transition: all var(--transition-fast);
        background: white;
        color: var(--text);
    }

    .input-wrapper input:focus {
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

    .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
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

    .forgot-link {
        color: var(--primary);
        font-size: 0.9rem;
        text-decoration: none;
        transition: color var(--transition-fast);
    }

    .forgot-link:hover {
        color: var(--primary-dark);
    }

    .full-width {
        width: 100%;
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

    @media (max-width: 600px) {
        .auth-container {
            padding: 1rem 0.5rem;
        }

        .auth-card {
            padding: 2rem 1.5rem;
            margin: 1rem;
        }

        .form-options {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
        }

        .auth-header h1 {
            font-size: 1.75rem;
        }
    }

    @media (max-width: 480px) {
        .auth-card {
            padding: 1.5rem 1rem;
        }

        .auth-header h1 {
            font-size: 1.5rem;
        }
    }
</style>
