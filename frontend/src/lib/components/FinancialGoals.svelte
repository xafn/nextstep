<script lang="ts">
    import {
        gamificationStore,
        addFinancialGoal,
        updateFinancialGoalProgress,
        deleteFinancialGoal,
    } from "../stores/gamification.js";
    import {
        DollarSign,
        Target,
        Plus,
        TrendingUp,
        Calendar,
        CheckCircle,
        Trash2,
    } from "lucide-svelte";
    import { onMount } from "svelte";

    let showAddForm = false;
    let newGoal = {
        title: "",
        targetAmount: "",
        deadline: "",
    };

    function handleAddGoal() {
        if (newGoal.title && newGoal.targetAmount) {
            addFinancialGoal({
                title: newGoal.title,
                targetAmount: parseFloat(newGoal.targetAmount),
                currentAmount: 0,
                deadline: newGoal.deadline
                    ? new Date(newGoal.deadline)
                    : undefined,
                completed: false,
            });

            // Reset form
            newGoal = { title: "", targetAmount: "", deadline: "" };
            showAddForm = false;
        }
    }

    function handleUpdateProgress(goalId: string, amount: number) {
        updateFinancialGoalProgress(goalId, amount);
    }

    function handleDeleteGoal(goalId: string) {
        deleteFinancialGoal(goalId);
    }

    function getProgressPercentage(goal: any) {
        return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    }

    function isOverdue(goal: any) {
        if (!goal.deadline) return false;
        return new Date(goal.deadline) < new Date();
    }

    function getDaysUntilDeadline(goal: any) {
        if (!goal.deadline) return null;
        const deadline = new Date(goal.deadline);
        const today = new Date();
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    function formatCurrency(amount: number) {
        return new Intl.NumberFormat("en-CA", {
            style: "currency",
            currency: "CAD",
        }).format(amount);
    }

    $: totalEarned = $gamificationStore.financialGoals.reduce(
        (sum, goal) => sum + goal.currentAmount,
        0,
    );
    $: totalTarget = $gamificationStore.financialGoals.reduce(
        (sum, goal) => sum + goal.targetAmount,
        0,
    );
    $: overallProgress =
        totalTarget > 0 ? (totalEarned / totalTarget) * 100 : 0;
</script>

<div class="financial-goals-section">
    <div class="goals-header">
        <div class="header-content">
            <h3>Financial Goals</h3>
        </div>
        <button
            class="btn btn-primary btn-sm"
            on:click={() => (showAddForm = !showAddForm)}
        >
            <Plus size={16} />
            Add Goal
        </button>
    </div>

    <!-- Add Goal Form -->
    {#if showAddForm}
        <div class="add-goal-form animate-fade-in-up">
            <h4>Add New Financial Goal</h4>
            <div class="form-grid">
                <div class="form-group">
                    <label for="goal-title">Goal Title</label>
                    <input
                        id="goal-title"
                        type="text"
                        bind:value={newGoal.title}
                        placeholder="e.g., Save for college, Buy a car"
                        class="form-input"
                    />
                </div>

                <div class="form-group">
                    <label for="target-amount">Target Amount ($)</label>
                    <input
                        id="target-amount"
                        type="number"
                        bind:value={newGoal.targetAmount}
                        placeholder="1000"
                        min="0"
                        step="0.01"
                        class="form-input"
                    />
                </div>

                <div class="form-group">
                    <label for="deadline">Deadline (Optional)</label>
                    <input
                        id="deadline"
                        type="date"
                        bind:value={newGoal.deadline}
                        class="form-input"
                    />
                </div>
            </div>

            <div class="form-actions">
                <button
                    class="btn btn-primary"
                    on:click={handleAddGoal}
                    disabled={!newGoal.title || !newGoal.targetAmount}
                >
                    Add Goal
                </button>
                <button
                    class="btn btn-outline"
                    on:click={() => (showAddForm = false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    {/if}

    <!-- Goals List -->
    <div class="goals-content">
        {#if $gamificationStore.financialGoals.length > 0}
            <div class="goals-grid">
                {#each $gamificationStore.financialGoals as goal, index}
                    <div
                        class="goal-card {goal.completed
                            ? 'completed'
                            : ''} {isOverdue(goal) ? 'overdue' : ''}"
                        class:animate-fade-in-up={true}
                        style="animation-delay: {index * 0.1}s"
                    >
                        <div class="goal-header">
                            <div class="goal-title">
                                <h4>{goal.title}</h4>
                                {#if goal.completed}
                                    <CheckCircle
                                        size={16}
                                        class="completed-icon"
                                    />
                                {/if}
                            </div>
                            <div class="goal-header-actions">
                                <div class="goal-amount">
                                    <span class="current"
                                        >{formatCurrency(
                                            goal.currentAmount,
                                        )}</span
                                    >
                                    <span class="separator">/</span>
                                    <span class="target"
                                        >{formatCurrency(
                                            goal.targetAmount,
                                        )}</span
                                    >
                                </div>
                                <button
                                    class="btn btn-icon btn-sm btn-danger"
                                    on:click={() => handleDeleteGoal(goal.id)}
                                    title="Delete goal"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <div class="goal-progress">
                            <div class="progress-bar">
                                <div
                                    class="progress-fill {goal.completed
                                        ? 'completed'
                                        : ''}"
                                    style="width: {getProgressPercentage(
                                        goal,
                                    )}%"
                                ></div>
                            </div>
                            <span class="progress-text"
                                >{getProgressPercentage(goal).toFixed(1)}%</span
                            >
                        </div>

                        {#if goal.deadline}
                            <div
                                class="goal-deadline {isOverdue(goal)
                                    ? 'overdue'
                                    : ''}"
                            >
                                <Calendar size={14} />
                                <span>
                                    {#if goal.completed}
                                        Completed on {goal.completedAt
                                            ? new Date(
                                                  goal.completedAt,
                                              ).toLocaleDateString()
                                            : ""}
                                    {:else if isOverdue(goal)}
                                        Overdue by {Math.abs(
                                            getDaysUntilDeadline(goal) || 0,
                                        )} days
                                    {:else}
                                        Due in {getDaysUntilDeadline(goal) || 0}
                                        days
                                    {/if}
                                </span>
                            </div>
                        {/if}

                        {#if !goal.completed}
                            <div class="goal-actions">
                                <div class="quick-add">
                                    <span>Quick Add:</span>
                                    <div class="amount-buttons">
                                        <button
                                            class="btn btn-outline btn-sm"
                                            on:click={() =>
                                                handleUpdateProgress(
                                                    goal.id,
                                                    50,
                                                )}
                                        >
                                            +$50
                                        </button>
                                        <button
                                            class="btn btn-outline btn-sm"
                                            on:click={() =>
                                                handleUpdateProgress(
                                                    goal.id,
                                                    100,
                                                )}
                                        >
                                            +$100
                                        </button>
                                        <button
                                            class="btn btn-outline btn-sm"
                                            on:click={() =>
                                                handleUpdateProgress(
                                                    goal.id,
                                                    200,
                                                )}
                                        >
                                            +$200
                                        </button>
                                    </div>
                                </div>

                                <div class="custom-amount">
                                    <input
                                        type="number"
                                        placeholder="Custom amount"
                                        min="0"
                                        step="0.01"
                                        class="form-input-sm"
                                        on:keydown={(e) => {
                                            if (e.key === "Enter") {
                                                const target =
                                                    e.target as HTMLInputElement;
                                                const amount = parseFloat(
                                                    target.value,
                                                );
                                                if (amount > 0) {
                                                    handleUpdateProgress(
                                                        goal.id,
                                                        amount,
                                                    );
                                                    target.value = "";
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {:else}
            <div class="no-goals">
                <Target size={48} />
                <h4>No financial goals yet</h4>
                <p>
                    Set your first financial goal to start tracking your
                    progress!
                </p>
                <button
                    class="btn btn-primary"
                    on:click={() => (showAddForm = true)}
                >
                    <Plus size={16} />
                    Add Your First Goal
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    .financial-goals-section {
        background: white;
        border-radius: var(--radius-xl);
        padding: 1.5rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow-sm);
    }

    .goals-header {
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

    .overall-progress {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .progress-info {
        display: flex;
        align-items: baseline;
        gap: 0.25rem;
        font-size: 0.9rem;
    }

    .earned-amount {
        color: var(--success);
        font-weight: 600;
    }

    .target-amount {
        color: var(--text-secondary);
    }

    .progress-bar {
        width: 120px;
        height: 6px;
        background: var(--surface);
        border-radius: var(--radius-full);
        overflow: hidden;
        border: 1px solid var(--border);
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(
            90deg,
            var(--success) 0%,
            var(--success-dark) 100%
        );
        border-radius: var(--radius-full);
        transition: width 0.3s ease;
    }

    .add-goal-form {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .add-goal-form h4 {
        margin: 0 0 1rem 0;
        color: var(--text);
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-group label {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--text);
    }

    .form-input {
        padding: 0.75rem;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        font-size: 0.9rem;
        transition: border-color var(--transition-normal);
    }

    .form-input:focus {
        outline: none;
        border-color: var(--primary);
    }

    .form-input-sm {
        padding: 0.5rem;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        font-size: 0.8rem;
        width: 100px;
    }

    .form-actions {
        display: flex;
        gap: 0.75rem;
    }

    .goals-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 1.5rem;
    }

    .goal-card {
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        background: var(--surface);
        transition: all var(--transition-normal);
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .goal-card:hover {
        border-color: var(--primary);
        box-shadow: var(--shadow-sm);
    }

    .goal-card.completed {
        border-color: var(--success);
        background: var(--success-light);
    }

    .goal-card.overdue {
        border-color: var(--error);
        background: var(--error-light);
    }

    .goal-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
    }

    .goal-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .goal-title h4 {
        margin: 0;
        color: var(--text);
        font-size: 1.1rem;
    }

    .completed-icon {
        color: var(--success);
    }

    .goal-header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .btn-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        background: transparent;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all var(--transition-normal);
    }

    .btn-icon:hover {
        background: var(--surface);
        color: var(--text);
    }

    .btn-danger {
        color: var(--error);
        border-color: var(--error);
    }

    .btn-danger:hover {
        background: var(--error);
        color: white;
    }

    .btn-sm {
        padding: 0.375rem;
        font-size: 0.875rem;
    }

    .goal-amount {
        text-align: right;
        font-size: 0.9rem;
    }

    .goal-amount .current {
        color: var(--success);
        font-weight: 600;
    }

    .goal-amount .separator {
        color: var(--text-secondary);
        margin: 0 0.25rem;
    }

    .goal-amount .target {
        color: var(--text);
        font-weight: 500;
    }

    .goal-progress {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .goal-progress .progress-bar {
        flex: 1;
        height: 8px;
        background: var(--surface);
        border-radius: var(--radius-full);
        overflow: hidden;
    }

    .goal-progress .progress-fill {
        height: 100%;
        background: linear-gradient(
            90deg,
            var(--primary) 0%,
            var(--primary-dark) 100%
        );
        border-radius: var(--radius-full);
        transition: width 0.3s ease;
    }

    .goal-progress .progress-fill.completed {
        background: linear-gradient(
            90deg,
            var(--success) 0%,
            var(--success-dark) 100%
        );
    }

    .progress-text {
        font-size: 0.8rem;
        color: var(--text-secondary);
        font-weight: 500;
        min-width: 40px;
    }

    .goal-deadline {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8rem;
        color: var(--text-secondary);
    }

    .goal-deadline.overdue {
        color: var(--error);
        font-weight: 600;
    }

    .goal-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .quick-add {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9rem;
        flex-wrap: wrap;
    }

    .quick-add span {
        color: var(--text-secondary);
        font-weight: 500;
        white-space: nowrap;
    }

    .amount-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .amount-buttons button {
        height: 1rem;
        font-size: 0.8rem;
        padding: 0.75rem;
    }

    .custom-amount {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .custom-amount input {
        width: 100%;
    }

    .no-goals {
        text-align: center;
        padding: 3rem 2rem;
        color: var(--text-secondary);
    }

    .no-goals h4 {
        margin: 1rem 0 0.5rem 0;
        color: var(--text);
    }

    .no-goals p {
        margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
        .goals-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
        }

        .overall-progress {
            width: 100%;
            justify-content: space-between;
        }

        .form-grid {
            grid-template-columns: 1fr;
        }

        .goals-grid {
            grid-template-columns: 1fr;
        }

        .goal-header {
            flex-direction: column;
            gap: 0.75rem;
            align-items: flex-start;
        }

        .goal-header-actions {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
        }

        .goal-amount {
            text-align: left;
        }

        .quick-add {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
        }

        .amount-buttons {
            width: 100%;
            justify-content: space-between;
            gap: 0.25rem;
        }

        .custom-amount {
            width: 100%;
        }

        .form-input-sm {
            width: 100%;
            max-width: 200px;
        }
    }
</style>
