<script>
    import {
        pendingTasks,
        completedTasks,
        completeTask,
    } from "../stores/gamification.js";
    import {
        CheckCircle,
        Circle,
        Clock,
        Zap,
        Flag,
        Calendar,
    } from "lucide-svelte";

    export let showCompleted = false;
    export let maxDisplay = 5;

    function getPriorityColor(priority) {
        const colors = {
            low: "#10b981",
            medium: "#f59e0b",
            high: "#ef4444",
        };
        return colors[priority] || "#6b7280";
    }

    function getPriorityIcon(priority) {
        const icons = {
            low: "🟢",
            medium: "🟡",
            high: "🔴",
        };
        return icons[priority] || "⚪";
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
        return icons[category] || "📋";
    }

    function handleCompleteTask(taskId) {
        completeTask(taskId);
    }

    function isOverdue(task) {
        if (!task.deadline) return false;
        return new Date(task.deadline) < new Date();
    }

    function getDaysUntilDeadline(task) {
        if (!task.deadline) return null;
        const deadline = new Date(task.deadline);
        const today = new Date();
        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
</script>

<div class="tasks-section">
    <div class="tasks-header">
        <div class="header-content">
            <h3>Tasks</h3>
            <div class="task-stats">
                <span class="completed-count"
                    >{$completedTasks.length} completed</span
                >
                <span class="pending-count">{$pendingTasks.length} pending</span
                >
            </div>
        </div>
        {#if $completedTasks.length > 0}
            <button
                class="btn btn-outline btn-sm"
                on:click={() => (showCompleted = !showCompleted)}
            >
                {showCompleted ? "Hide" : "Show"} Completed
            </button>
        {/if}
    </div>

    <div class="tasks-content">
        <!-- Pending Tasks -->
        <div class="task-group">
            <h4 class="group-title">To Do</h4>
            {#if $pendingTasks.length > 0}
                <div class="tasks-list">
                    {#each $pendingTasks.slice(0, maxDisplay) as task, index}
                        <div
                            class="task-item pending {isOverdue(task)
                                ? 'overdue'
                                : ''}"
                            class:animate-fade-in-up={true}
                            style="animation-delay: {index * 0.1}s"
                        >
                            <button
                                class="task-checkbox"
                                on:click={() => handleCompleteTask(task.id)}
                                aria-label="Complete task"
                            >
                                <Circle size={20} />
                            </button>

                            <div class="task-content">
                                <div class="task-header">
                                    <h5 class="task-title">{task.title}</h5>
                                    <div class="task-priority">
                                        <span class="priority-icon"
                                            >{getPriorityIcon(
                                                task.priority,
                                            )}</span
                                        >
                                        <span class="priority-text"
                                            >{task.priority}</span
                                        >
                                    </div>
                                </div>

                                <p class="task-description">
                                    {task.description}
                                </p>

                                <div class="task-meta">
                                    <div class="xp-reward">
                                        <Zap size={14} />
                                        <span>{task.xpReward} XP</span>
                                    </div>

                                    <div class="task-category">
                                        <span class="category-icon"
                                            >{getCategoryIcon(
                                                task.category,
                                            )}</span
                                        >
                                        <span class="category-text"
                                            >{task.category}</span
                                        >
                                    </div>

                                    {#if task.deadline}
                                        <div
                                            class="task-deadline {isOverdue(
                                                task,
                                            )
                                                ? 'overdue'
                                                : ''}"
                                        >
                                            <Calendar size={14} />
                                            <span>
                                                {#if isOverdue(task)}
                                                    Overdue by {Math.abs(
                                                        getDaysUntilDeadline(
                                                            task,
                                                        ),
                                                    )} days
                                                {:else}
                                                    Due in {getDaysUntilDeadline(
                                                        task,
                                                    )} days
                                                {/if}
                                            </span>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>

                {#if $pendingTasks.length > maxDisplay}
                    <div class="more-tasks">
                        <span
                            >+{$pendingTasks.length - maxDisplay} more tasks</span
                        >
                    </div>
                {/if}
            {:else}
                <div class="no-tasks">
                    <CheckCircle size={48} />
                    <h4>All caught up!</h4>
                    <p>No pending tasks. Great job!</p>
                </div>
            {/if}
        </div>

        <!-- Completed Tasks -->
        {#if showCompleted && $completedTasks.length > 0}
            <div class="task-group completed-group">
                <h4 class="group-title">Completed</h4>
                <div class="tasks-list">
                    {#each $completedTasks.slice(0, 3) as task, index}
                        <div
                            class="task-item completed"
                            class:animate-fade-in-up={true}
                            style="animation-delay: {index * 0.1}s"
                        >
                            <div class="task-checkbox completed">
                                <CheckCircle size={20} />
                            </div>

                            <div class="task-content">
                                <div class="task-header">
                                    <h5 class="task-title">{task.title}</h5>
                                    <div class="completion-date">
                                        {task.completedAt
                                            ? new Date(
                                                  task.completedAt,
                                              ).toLocaleDateString()
                                            : ""}
                                    </div>
                                </div>

                                <div class="task-meta">
                                    <div class="xp-earned">
                                        <Zap size={14} />
                                        <span>+{task.xpReward} XP earned</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>

                {#if $completedTasks.length > 3}
                    <div class="more-tasks">
                        <span>+{$completedTasks.length - 3} more completed</span
                        >
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .tasks-section {
        background: white;
        border-radius: var(--radius-xl);
        padding: 1.5rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow-sm);
    }

    .tasks-header {
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

    .task-stats {
        display: flex;
        gap: 1rem;
        font-size: 0.9rem;
    }

    .completed-count {
        color: var(--success);
        font-weight: 500;
    }

    .pending-count {
        color: var(--text-secondary);
    }

    .task-group {
        margin-bottom: 2rem;
    }

    .group-title {
        margin: 0 0 1rem 0;
        color: var(--text);
        font-size: 1.1rem;
        font-weight: 600;
    }

    .tasks-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .task-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        background: var(--surface);
        transition: all var(--transition-normal);
    }

    .task-item:hover {
        border-color: var(--primary);
        box-shadow: var(--shadow-sm);
    }

    .task-item.overdue {
        border-color: var(--error);
        background: var(--error-light);
    }

    .task-item.completed {
        opacity: 0.7;
        background: var(--success-light);
        border-color: var(--success);
    }

    .task-checkbox {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border: none;
        background: none;
        cursor: pointer;
        color: var(--text-secondary);
        transition: all var(--transition-normal);
        flex-shrink: 0;
    }

    .task-checkbox:hover {
        color: var(--primary);
        transform: scale(1.1);
    }

    .task-checkbox.completed {
        color: var(--success);
    }

    .task-content {
        flex: 1;
    }

    .task-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.5rem;
    }

    .task-title {
        margin: 0;
        color: var(--text);
        font-size: 1rem;
        font-weight: 600;
    }

    .task-priority {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .priority-icon {
        font-size: 0.9rem;
    }

    .priority-text {
        text-transform: capitalize;
    }

    .task-description {
        margin: 0 0 0.75rem 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .task-meta {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: center;
    }

    .xp-reward,
    .xp-earned {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .xp-reward {
        color: var(--primary);
    }

    .xp-earned {
        color: var(--success);
    }

    .task-category {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.8rem;
        color: var(--text-secondary);
    }

    .category-icon {
        font-size: 0.9rem;
    }

    .task-deadline {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.8rem;
        color: var(--text-secondary);
    }

    .task-deadline.overdue {
        color: var(--error);
        font-weight: 600;
    }

    .completion-date {
        font-size: 0.8rem;
        color: var(--text-secondary);
        font-style: italic;
    }

    .more-tasks {
        text-align: center;
        padding: 0.75rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
        border-top: 1px solid var(--border);
        margin-top: 0.75rem;
    }

    .no-tasks {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }

    .no-tasks h4 {
        margin: 1rem 0 0.5rem 0;
        color: var(--text);
    }

    .no-tasks p {
        margin: 0;
    }

    .completed-group {
        border-top: 1px solid var(--border);
        padding-top: 1.5rem;
    }

    @media (max-width: 768px) {
        .tasks-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
        }

        .task-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
        }

        .task-meta {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
        }
    }
</style>
