<script>
    import { gamificationStore } from "../stores/gamification.js";
    import { Flame, Calendar, Zap } from "lucide-svelte";

    function getStreakMessage(streak) {
        if (streak === 0) return "Start your streak today!";
        if (streak === 1) return "Great start! Keep it going!";
        if (streak < 7) return "Building momentum!";
        if (streak < 14) return "You're on fire! 🔥";
        if (streak < 30) return "Incredible dedication!";
        if (streak < 60) return "Unstoppable! 💪";
        if (streak < 100) return "Legendary streak! 🌟";
        return "You're a machine! 🤖";
    }

    function getStreakColor(streak) {
        if (streak === 0) return "#6b7280";
        if (streak < 3) return "#10b981";
        if (streak < 7) return "#f59e0b";
        if (streak < 14) return "#ef4444";
        if (streak < 30) return "#8b5cf6";
        return "#ec4899";
    }

    function getStreakIcon(streak) {
        if (streak === 0) return "⚪";
        if (streak < 3) return "🟢";
        if (streak < 7) return "🟡";
        if (streak < 14) return "🔴";
        if (streak < 30) return "🟣";
        return "🟣";
    }
</script>

<div class="streak-counter">
    <div class="streak-header">
        <div class="streak-icon">
            <Flame
                size={24}
                style="color: {getStreakColor($gamificationStore.streak)}"
            />
        </div>
        <div class="streak-info">
            <h3>Activity Streak</h3>
            <p class="streak-message">
                {getStreakMessage($gamificationStore.streak)}
            </p>
        </div>
    </div>

    <div class="streak-display">
        <div class="streak-number">
            <span class="number">{$gamificationStore.streak}</span>
            <span class="label">days</span>
        </div>

        <div class="streak-details">
            <div class="detail-item">
                <Calendar size={16} />
                <span
                    >Last active: {new Date(
                        $gamificationStore.lastActiveDate,
                    ).toLocaleDateString()}</span
                >
            </div>

            {#if $gamificationStore.streak > 0}
                <div class="streak-progress">
                    <div class="progress-dots">
                        {#each Array(Math.min($gamificationStore.streak, 7)) as _, i}
                            <div
                                class="progress-dot active"
                                style="background-color: {getStreakColor(
                                    $gamificationStore.streak,
                                )}"
                            ></div>
                        {/each}
                        {#if $gamificationStore.streak < 7}
                            {#each Array(7 - $gamificationStore.streak) as _, i}
                                <div class="progress-dot"></div>
                            {/each}
                        {/if}
                    </div>
                    <span class="progress-text">Week progress</span>
                </div>
            {/if}
        </div>
    </div>

    {#if $gamificationStore.streak > 0}
        <div class="streak-milestones">
            <h4>Next Milestones</h4>
            <div class="milestones-list">
                {#each [7, 14, 30, 60, 100] as milestone}
                    {#if $gamificationStore.streak < milestone}
                        <div class="milestone-item">
                            <div class="milestone-icon">
                                {#if milestone === 7}
                                    <span>🔥</span>
                                {:else if milestone === 14}
                                    <span>⚡</span>
                                {:else if milestone === 30}
                                    <span>💎</span>
                                {:else if milestone === 60}
                                    <span>👑</span>
                                {:else}
                                    <span>🏆</span>
                                {/if}
                            </div>
                            <div class="milestone-info">
                                <span class="milestone-days"
                                    >{milestone} days</span
                                >
                                <span class="milestone-reward"
                                    >+{milestone * 10} XP</span
                                >
                            </div>
                            <div class="milestone-progress">
                                <div class="progress-bar">
                                    <div
                                        class="progress-fill"
                                        style="width: {Math.min(
                                            ($gamificationStore.streak /
                                                milestone) *
                                                100,
                                            100,
                                        )}%"
                                    ></div>
                                </div>
                                <span class="progress-text"
                                    >{milestone - $gamificationStore.streak} days
                                    left</span
                                >
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    {:else}
        <div class="start-streak">
            <div class="start-message">
                <Zap size={20} />
                <span>Complete a task today to start your streak!</span>
            </div>
            <div class="first-day-reward">
                <span>First day reward: +50 XP</span>
            </div>
        </div>
    {/if}
</div>

<style>
    .streak-counter {
        background: white;
        border-radius: var(--radius-xl);
        padding: 1.5rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow-sm);
    }

    .streak-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .streak-icon {
        width: 3rem;
        height: 3rem;
        background: var(--surface);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .streak-info h3 {
        margin: 0 0 0.25rem 0;
        color: var(--text);
        font-size: 1.25rem;
    }

    .streak-message {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .streak-display {
        display: flex;
        align-items: center;
        gap: 2rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: var(--surface);
        border-radius: var(--radius-lg);
    }

    .streak-number {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
        flex-shrink: 0;
    }

    .streak-number .number {
        font-size: 3rem;
        font-weight: 700;
        color: var(--primary);
        line-height: 1;
    }

    .streak-number .label {
        font-size: 1rem;
        color: var(--text-secondary);
    }

    .streak-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .detail-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .streak-progress {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .progress-dots {
        display: flex;
        gap: 0.25rem;
    }

    .progress-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--border);
        transition: all var(--transition-normal);
    }

    .progress-dot.active {
        background: var(--primary);
        transform: scale(1.2);
    }

    .progress-text {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }

    .streak-milestones {
        border-top: 1px solid var(--border);
        padding-top: 1.5rem;
    }

    .streak-milestones h4 {
        margin: 0 0 1rem 0;
        color: var(--text);
        font-size: 1.1rem;
    }

    .milestones-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .milestone-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        background: var(--surface);
        border-radius: var(--radius-md);
        transition: all var(--transition-normal);
    }

    .milestone-item:hover {
        background: white;
        box-shadow: var(--shadow-sm);
    }

    .milestone-icon {
        width: 2rem;
        height: 2rem;
        background: var(--primary-light);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        flex-shrink: 0;
    }

    .milestone-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        min-width: 100px;
    }

    .milestone-days {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text);
    }

    .milestone-reward {
        font-size: 0.8rem;
        color: var(--accent);
        font-weight: 500;
    }

    .milestone-progress {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .milestone-progress .progress-bar {
        width: 100%;
        height: 4px;
        background: var(--border);
        border-radius: var(--radius-full);
        overflow: hidden;
    }

    .milestone-progress .progress-fill {
        height: 100%;
        background: linear-gradient(
            90deg,
            var(--primary) 0%,
            var(--primary-dark) 100%
        );
        border-radius: var(--radius-full);
        transition: width 0.3s ease;
    }

    .milestone-progress .progress-text {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    .start-streak {
        text-align: center;
        padding: 2rem;
        background: var(--surface);
        border-radius: var(--radius-lg);
        border: 2px dashed var(--border);
    }

    .start-message {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-size: 1rem;
        color: var(--text);
        margin-bottom: 0.75rem;
    }

    .first-day-reward {
        font-size: 0.9rem;
        color: var(--accent);
        font-weight: 600;
    }

    @media (max-width: 768px) {
        .streak-display {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }

        .streak-number {
            justify-content: center;
        }

        .milestone-item {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
        }

        .milestone-info {
            min-width: auto;
        }

        .milestone-progress {
            width: 100%;
        }
    }
</style>
