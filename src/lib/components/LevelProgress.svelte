<script>
    import {
        currentLevel,
        nextLevel,
        levelProgress,
    } from "../stores/gamification.js";
    import { Trophy, Star, Zap } from "lucide-svelte";

    export let showDetails = false;
</script>

<div class="level-progress">
    <div class="level-header">
        <div class="level-info">
            <div class="level-badge">
                <Trophy size={20} />
                <span>Level {$currentLevel.level}</span>
            </div>
            <h3>{$currentLevel.title}</h3>
            <p>{$currentLevel.description}</p>
        </div>

        <div class="xp-info">
            <div class="xp-display">
                <Zap size={16} />
                <span class="xp-amount">{$currentLevel.xpRequired} XP</span>
            </div>
            {#if $nextLevel}
                <div class="next-level">
                    <span>Next: {$nextLevel.title}</span>
                </div>
            {/if}
        </div>
    </div>

    {#if $nextLevel}
        <div class="progress-container">
            <div class="progress-bar">
                <div
                    class="progress-fill"
                    style="width: {$levelProgress}%"
                ></div>
            </div>
            <div class="progress-text">
                <span>{$levelProgress.toFixed(1)}% to next level</span>
            </div>
        </div>
    {:else}
        <div class="max-level">
            <Star size={20} />
            <span>Maximum level reached!</span>
        </div>
    {/if}

    {#if showDetails && $currentLevel.rewards.length > 0}
        <div class="rewards-section">
            <h4>Current Rewards:</h4>
            <ul class="rewards-list">
                {#each $currentLevel.rewards as reward}
                    <li>
                        <Star size={14} />
                        <span>{reward}</span>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>

<style>
    .level-progress {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: var(--radius-xl);
        padding: 1.5rem;
        color: white;
        position: relative;
        overflow: hidden;
    }

    .level-progress::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        opacity: 0.3;
    }

    .level-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
        position: relative;
        z-index: 1;
    }

    .level-info h3 {
        margin: 0.5rem 0 0.25rem 0;
        font-size: 1.5rem;
        font-weight: 700;
    }

    .level-info p {
        margin: 0;
        opacity: 0.9;
        font-size: 0.9rem;
    }

    .level-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: var(--radius-2xl);
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        font-weight: 600;
    }

    .xp-info {
        text-align: right;
    }

    .xp-display {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
    }

    .xp-amount {
        color: #ffd700;
    }

    .next-level {
        font-size: 0.8rem;
        opacity: 0.8;
    }

    .progress-container {
        margin-bottom: 1rem;
        position: relative;
        z-index: 1;
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: var(--radius-full);
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #ffd700 0%, #ffed4e 100%);
        border-radius: var(--radius-full);
        transition: width 0.3s ease;
        position: relative;
    }

    .progress-fill::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
        );
        animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }

    .progress-text {
        text-align: center;
        font-size: 0.9rem;
        color: var(--text-secondary-light);
    }

    p {
        color: var(--text-secondary-light);
    }

    .max-level {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-size: 1.1rem;
        font-weight: 600;
        color: #ffd700;
        margin: 1rem 0;
    }

    .rewards-section {
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        padding-top: 1rem;
        position: relative;
        z-index: 1;
    }

    .rewards-section h4 {
        margin: 0 0 0.75rem 0;
        font-size: 1rem;
        opacity: 0.9;
    }

    .rewards-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .rewards-list li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        opacity: 0.9;
    }

    .rewards-list li svg {
        color: #ffd700;
    }

    @media (max-width: 768px) {
        .level-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
        }

        .xp-info {
            text-align: left;
        }
    }
</style>
