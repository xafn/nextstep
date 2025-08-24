<script>
    import {
        gamificationStore,
        unlockedAchievements,
    } from "../stores/gamification.js";
    import { Award, Lock, CheckCircle, Zap } from "lucide-svelte";

    export let showAll = false;
    export let maxDisplay = 6;

    $: displayedAchievements = showAll
        ? $gamificationStore.achievements
        : $gamificationStore.achievements.slice(0, maxDisplay);

    $: unlockedCount = $unlockedAchievements.length;
    $: totalCount = $gamificationStore.achievements.length;
    $: completionPercentage = Math.round((unlockedCount / totalCount) * 100);

    function getCategoryColor(category) {
        const colors = {
            resume: "#3b82f6",
            application: "#10b981",
            interview: "#f59e0b",
            skill: "#8b5cf6",
            social: "#ec4899",
            financial: "#ef4444",
        };
        return colors[category] || "#6b7280";
    }

    function getCategoryIcon(category) {
        const icons = {
            resume: "📝",
            application: "📤",
            interview: "🎭",
            skill: "⚡",
            social: "🤝",
            financial: "💰",
        };
        return icons[category] || "🏆";
    }
</script>

<div class="achievements-section">
    <div class="achievements-header">
        <div class="header-content">
            <h3>Achievements</h3>
            <div class="completion-stats">
                <span class="completion-text">{unlockedCount}/{totalCount}</span
                >
                <div class="completion-bar">
                    <div
                        class="completion-fill"
                        style="width: {completionPercentage}%"
                    ></div>
                </div>
            </div>
        </div>
        {#if !showAll && totalCount > maxDisplay}
            <button
                class="btn btn-outline btn-sm"
                on:click={() => (showAll = true)}
            >
                View All
            </button>
        {/if}
    </div>

    <div class="achievements-grid">
        {#each displayedAchievements as achievement, index}
            <div
                class="achievement-card {achievement.unlocked
                    ? 'unlocked'
                    : 'locked'}"
                class:animate-fade-in-up={true}
                style="animation-delay: {index * 0.1}s"
            >
                <div class="achievement-icon">
                    {#if achievement.unlocked}
                        <div class="icon-unlocked">
                            <span class="emoji-icon">{achievement.icon}</span>
                            <CheckCircle size={16} class="unlock-badge" />
                        </div>
                    {:else}
                        <div class="icon-locked">
                            <span class="emoji-icon">{achievement.icon}</span>
                            <Lock size={16} class="lock-badge" />
                        </div>
                    {/if}
                </div>

                <div class="achievement-content">
                    <h4 class="achievement-title">{achievement.title}</h4>
                    <p class="achievement-description">
                        {achievement.description}
                    </p>

                    <div class="achievement-meta">
                        <div class="xp-reward">
                            <Zap size={14} />
                            <span>{achievement.xpReward} XP</span>
                        </div>
                        <div
                            class="category-badge"
                            style="background-color: {getCategoryColor(
                                achievement.category,
                            )}20; color: {getCategoryColor(
                                achievement.category,
                            )}"
                        >
                            <span class="category-icon"
                                >{getCategoryIcon(achievement.category)}</span
                            >
                            <span class="category-text"
                                >{achievement.category}</span
                            >
                        </div>
                    </div>

                    {#if achievement.unlocked && achievement.unlockedAt}
                        <div class="unlock-date">
                            Unlocked {new Date(
                                achievement.unlockedAt,
                            ).toLocaleDateString()}
                        </div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>

    {#if showAll}
        <div class="achievements-footer">
            <button class="btn btn-outline" on:click={() => (showAll = false)}>
                Show Less
            </button>
        </div>
    {/if}
</div>

<style>
    .achievements-section {
        background: white;
        border-radius: var(--radius-xl);
        padding: 1.5rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow-sm);
    }

    .achievements-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .header-content h3 {
        margin: 0 0 0.5rem 0;
        color: var(--text);
        font-size: 1.25rem;
    }

    .completion-stats {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .completion-text {
        font-size: 0.9rem;
        color: var(--text-secondary);
        font-weight: 500;
    }

    .completion-bar {
        width: 100px;
        height: 6px;
        background: var(--surface);
        border-radius: var(--radius-full);
        overflow: hidden;
    }

    .completion-fill {
        height: 100%;
        background: linear-gradient(
            90deg,
            var(--primary) 0%,
            var(--primary-dark) 100%
        );
        border-radius: var(--radius-full);
        transition: width 0.3s ease;
    }

    .achievements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
    }

    .achievement-card {
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 1rem;
        transition: all var(--transition-normal);
        background: var(--surface);
        position: relative;
        overflow: hidden;
    }

    .achievement-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    .achievement-card.unlocked {
        border-color: var(--success);
        background: linear-gradient(
            135deg,
            var(--success-light) 0%,
            white 100%
        );
    }

    .achievement-card.locked {
        opacity: 0.7;
        filter: grayscale(0.3);
    }

    .achievement-icon {
        margin-bottom: 0.75rem;
    }

    .icon-unlocked,
    .icon-locked {
        position: relative;
        display: inline-block;
    }

    .emoji-icon {
        font-size: 2rem;
        display: block;
    }

    .unlock-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: var(--success);
        color: white;
        border-radius: 50%;
        padding: 2px;
    }

    .lock-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: var(--text-secondary);
        color: white;
        border-radius: 50%;
        padding: 2px;
    }

    .achievement-content h4 {
        margin: 0 0 0.5rem 0;
        color: var(--text);
        font-size: 1rem;
        font-weight: 600;
    }

    .achievement-description {
        margin: 0 0 0.75rem 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .achievement-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .xp-reward {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.8rem;
        color: var(--primary);
        font-weight: 600;
    }

    .category-badge {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-md);
        font-size: 0.75rem;
        font-weight: 500;
    }

    .category-icon {
        font-size: 0.8rem;
    }

    .unlock-date {
        font-size: 0.75rem;
        color: var(--text-secondary);
        font-style: italic;
    }

    .achievements-footer {
        display: flex;
        justify-content: center;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border);
    }

    @media (max-width: 768px) {
        .achievements-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
        }

        .achievements-grid {
            grid-template-columns: 1fr;
        }

        .achievement-meta {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
        }
    }
</style>
