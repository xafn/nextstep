<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { CheckCircle, X, Zap, Trophy, Star } from "lucide-svelte";

    export let type = "success"; // success, achievement, levelup, xp
    export let title = "";
    export let message = "";
    export let duration = 5000;
    export let show = false;

    const dispatch = createEventDispatcher();

    let timeoutId;

    function close() {
        show = false;
        dispatch("close");
    }

    function getIcon() {
        switch (type) {
            case "achievement":
                return Trophy;
            case "levelup":
                return Star;
            case "xp":
                return Zap;
            default:
                return CheckCircle;
        }
    }

    function getTypeStyles() {
        switch (type) {
            case "achievement":
                return {
                    background:
                        "linear-gradient(135deg, #d14b4b 0%, #d14b33 100%)",
                    color: "white",
                    borderColor: "#d14b4b",
                };
            case "levelup":
                return {
                    background:
                        "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                    color: "white",
                    borderColor: "#8b5cf6",
                };
            case "xp":
                return {
                    background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    borderColor: "#10b981",
                };
            default:
                return {
                    background:
                        "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "white",
                    borderColor: "#3b82f6",
                };
        }
    }

    $: if (show) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(close, duration);
    }

    onMount(() => {
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    });
</script>

{#if show}
    <div
        class="notification-toast {type}"
        class:animate-fade-in-up={true}
        style="background: {getTypeStyles().background}; color: {getTypeStyles()
            .color}; border-color: {getTypeStyles().borderColor}"
    >
        <div class="notification-icon">
            <svelte:component this={getIcon()} size={20} />
        </div>

        <div class="notification-content">
            <h4 class="notification-title">{title}</h4>
            <p class="notification-message">{message}</p>
        </div>

        <button class="notification-close" on:click={close}>
            <X size={16} />
        </button>
    </div>
{/if}

<style>
    .notification-toast {
        position: fixed;
        top: 2rem;
        right: 2rem;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        border: 2px solid;
        box-shadow: var(--shadow-lg);
        min-width: 300px;
        max-width: 400px;
        backdrop-filter: blur(10px);
        animation: slideInRight 0.3s ease-out;
    }

    .notification-icon {
        flex-shrink: 0;
        width: 2.5rem;
        height: 2.5rem;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-content {
        flex: 1;
        min-width: 0;
    }

    .notification-title {
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
        font-weight: 600;
    }

    .notification-message {
        margin: 0;
        font-size: 0.9rem;
        color: var(--text-secondary-light);
        line-height: 1.4;
    }

    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: var(--radius-md);
        transition: all var(--transition-normal);
        opacity: 0.7;
        flex-shrink: 0;
    }

    .notification-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
    }

    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification-toast.closing {
        animation: slideOutRight 0.3s ease-in forwards;
    }

    @media (max-width: 768px) {
        .notification-toast {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            min-width: auto;
            max-width: none;
        }
    }
</style>
