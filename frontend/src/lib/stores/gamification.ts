import { writable, derived, get } from 'svelte/store';
import { resumeStore, getResumeCompletion } from './resume.js';

export interface Achievement {
	id: string;
	title: string;
	description: string;
	icon: string;
	xpReward: number;
	unlocked: boolean;
	unlockedAt?: Date;
	category: 'resume' | 'application' | 'interview' | 'skill' | 'social' | 'financial';
}

export interface Task {
	id: string;
	title: string;
	description: string;
	xpReward: number;
	completed: boolean;
	completedAt?: Date;
	category: 'resume' | 'application' | 'interview' | 'skill' | 'social' | 'financial';
	deadline?: Date;
	priority: 'low' | 'medium' | 'high';
}

export interface Level {
	level: number;
	xpRequired: number;
	title: string;
	description: string;
	rewards: string[];
}

export interface FinancialGoal {
	id: string;
	title: string;
	targetAmount: number;
	currentAmount: number;
	deadline?: Date;
	completed: boolean;
	completedAt?: Date;
}

export interface GamificationData {
	xp: number;
	level: number;
	achievements: Achievement[];
	tasks: Task[];
	financialGoals: FinancialGoal[];
	streak: number;
	lastActiveDate: string;
	totalApplications: number;
	totalInterviews: number;
	totalJobs: number;
}

// Level definitions
const LEVELS: Level[] = [
	{ level: 1, xpRequired: 0, title: "Job Seeker", description: "Just getting started!", rewards: ["Basic profile access"] },
	{ level: 2, xpRequired: 100, title: "Resume Builder", description: "Building your foundation", rewards: ["Resume templates", "+10% profile visibility"] },
	{ level: 3, xpRequired: 250, title: "Application Master", description: "Getting the hang of it", rewards: ["Application tracking", "Job recommendations"] },
	{ level: 4, xpRequired: 500, title: "Interview Pro", description: "Confidence is growing", rewards: ["Interview prep tools", "+25% profile visibility"] },
	{ level: 5, xpRequired: 1000, title: "Career Explorer", description: "Discovering your path", rewards: ["Skill assessments", "Mentorship access"] },
	{ level: 6, xpRequired: 2000, title: "Job Hunter", description: "You're getting noticed", rewards: ["Priority job alerts", "+50% profile visibility"] },
	{ level: 7, xpRequired: 3500, title: "Professional", description: "Building your brand", rewards: ["LinkedIn integration", "Portfolio builder"] },
	{ level: 8, xpRequired: 5500, title: "Career Champion", description: "Leading the way", rewards: ["Resume review service", "Mock interviews"] },
	{ level: 9, xpRequired: 8000, title: "Employment Expert", description: "You've got this!", rewards: ["Career coaching", "Networking events"] },
	{ level: 10, xpRequired: 12000, title: "Future Leader", description: "The sky's the limit!", rewards: ["All premium features", "Featured profile"] }
];

// Achievement definitions
const ACHIEVEMENTS: Achievement[] = [
	// Resume achievements
	{ id: 'first-resume', title: 'First Steps', description: 'Create your first resume', icon: '📝', xpReward: 50, unlocked: false, category: 'resume' },
	{ id: 'resume-complete', title: 'Resume Master', description: 'Complete your resume to 100%', icon: '🏆', xpReward: 200, unlocked: false, category: 'resume' },
	{ id: 'skills-added', title: 'Skill Builder', description: 'Add 5 skills to your profile', icon: '⚡', xpReward: 75, unlocked: false, category: 'resume' },
	{ id: 'experience-added', title: 'Experience Collector', description: 'Add your first work experience', icon: '💼', xpReward: 100, unlocked: false, category: 'resume' },
	
	// Application achievements
	{ id: 'first-application', title: 'First Application', description: 'Submit your first job application', icon: '📤', xpReward: 75, unlocked: false, category: 'application' },
	{ id: 'application-streak', title: 'Application Warrior', description: 'Submit 5 applications in a week', icon: '🔥', xpReward: 150, unlocked: false, category: 'application' },
	{ id: 'application-master', title: 'Application Master', description: 'Submit 20 applications total', icon: '🎯', xpReward: 300, unlocked: false, category: 'application' },
	
	// Interview achievements
	{ id: 'first-interview', title: 'Interview Debut', description: 'Complete your first interview', icon: '🎭', xpReward: 200, unlocked: false, category: 'interview' },
	{ id: 'interview-success', title: 'Interview Pro', description: 'Complete 3 interviews', icon: '🎪', xpReward: 400, unlocked: false, category: 'interview' },
	
	// Skill achievements
	{ id: 'skill-learner', title: 'Lifelong Learner', description: 'Learn a new skill', icon: '📚', xpReward: 100, unlocked: false, category: 'skill' },
	{ id: 'skill-master', title: 'Skill Master', description: 'Master 3 different skills', icon: '🧠', xpReward: 250, unlocked: false, category: 'skill' },
	
	// Social achievements
	{ id: 'network-builder', title: 'Network Builder', description: 'Connect with 5 professionals', icon: '🤝', xpReward: 150, unlocked: false, category: 'social' },
	{ id: 'profile-views', title: 'Profile Popular', description: 'Get 10 profile views', icon: '👀', xpReward: 100, unlocked: false, category: 'social' },
	
	// Financial achievements
	{ id: 'first-paycheck', title: 'First Paycheck', description: 'Earn your first $100', icon: '💰', xpReward: 200, unlocked: false, category: 'financial' },
	{ id: 'savings-goal', title: 'Saver', description: 'Reach your first savings goal', icon: '🏦', xpReward: 300, unlocked: false, category: 'financial' },
	{ id: 'financial-freedom', title: 'Financial Freedom', description: 'Earn $1000 total', icon: '💎', xpReward: 500, unlocked: false, category: 'financial' }
];

// Default tasks
const DEFAULT_TASKS: Task[] = [
	{ id: 'complete-profile', title: 'Complete Your Profile', description: 'Fill out all sections of your profile to increase your chances', xpReward: 100, completed: false, category: 'resume', priority: 'high' },
	{ id: 'create-resume', title: 'Create Your Resume', description: 'Build a professional resume to showcase your skills', xpReward: 150, completed: false, category: 'resume', priority: 'high' },
	{ id: 'add-skills', title: 'Add Your Skills', description: 'List at least 5 skills you have', xpReward: 75, completed: false, category: 'resume', priority: 'medium' },
	{ id: 'first-application', title: 'Submit First Application', description: 'Apply to your first job', xpReward: 100, completed: false, category: 'application', priority: 'high' },
	{ id: 'set-financial-goal', title: 'Set Financial Goal', description: 'Set a target amount you want to earn', xpReward: 50, completed: false, category: 'financial', priority: 'medium' },
	{ id: 'research-companies', title: 'Research Companies', description: 'Research 3 companies you\'d like to work for', xpReward: 75, completed: false, category: 'application', priority: 'low' }
];

// Default gamification data
const defaultGamificationData: GamificationData = {
	xp: 0,
	level: 1,
	achievements: ACHIEVEMENTS,
	tasks: DEFAULT_TASKS,
	financialGoals: [],
	streak: 0,
	lastActiveDate: new Date().toISOString().split('T')[0],
	totalApplications: 0,
	totalInterviews: 0,
	totalJobs: 0
};

// Create the store
export const gamificationStore = writable<GamificationData>(defaultGamificationData);

// Derived stores
export const currentLevel = derived(gamificationStore, ($gamification) => {
	return LEVELS.find(level => level.level === $gamification.level) || LEVELS[0];
});

export const nextLevel = derived(gamificationStore, ($gamification) => {
	return LEVELS.find(level => level.level === $gamification.level + 1);
});

export const levelProgress = derived([gamificationStore, currentLevel, nextLevel], ([$gamification, $currentLevel, $nextLevel]) => {
	if (!$nextLevel) return 100;
	const currentLevelXP = $currentLevel.xpRequired;
	const nextLevelXP = $nextLevel.xpRequired;
	const userXP = $gamification.xp;
	const progress = ((userXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
	return Math.min(Math.max(progress, 0), 100);
});

export const unlockedAchievements = derived(gamificationStore, ($gamification) => {
	return $gamification.achievements.filter(achievement => achievement.unlocked);
});

export const completedTasks = derived(gamificationStore, ($gamification) => {
	return $gamification.tasks.filter(task => task.completed);
});

export const pendingTasks = derived(gamificationStore, ($gamification) => {
	return $gamification.tasks.filter(task => !task.completed);
});

// Load gamification data from localStorage (deprecated - use loadGamificationDataForUser instead)
export function loadGamificationData(): void {
	console.warn('loadGamificationData is deprecated. Use loadGamificationDataForUser instead.');
}

// Save gamification data to localStorage
export function saveGamificationData(data: GamificationData, userEmail?: string): void {
	if (typeof window !== 'undefined') {
		const key = userEmail ? `nextstep-gamification-${userEmail}` : 'nextstep-gamification';
		localStorage.setItem(key, JSON.stringify(data));
		gamificationStore.set(data);
	}
}

// Reset gamification data for a specific user
export function resetGamificationDataForUser(userEmail: string): void {
	if (typeof window !== 'undefined') {
		// Create a user-specific key
		const userKey = `nextstep-gamification-${userEmail}`;
		localStorage.setItem(userKey, JSON.stringify(defaultGamificationData));
		gamificationStore.set(defaultGamificationData);
	}
}

// Load gamification data for a specific user
export function loadGamificationDataForUser(userEmail: string): void {
	if (typeof window !== 'undefined') {
		const userKey = `nextstep-gamification-${userEmail}`;
		const saved = localStorage.getItem(userKey);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				// Merge with default to ensure all new achievements/tasks are included
				const merged = {
					...defaultGamificationData,
					...parsed,
					achievements: [...defaultGamificationData.achievements.map(achievement => {
						const savedAchievement = parsed.achievements?.find((a: Achievement) => a.id === achievement.id);
						return savedAchievement ? { ...achievement, ...savedAchievement } : achievement;
					})],
					tasks: [...defaultGamificationData.tasks.map(task => {
						const savedTask = parsed.tasks?.find((t: Task) => t.id === task.id);
						return savedTask ? { ...task, ...savedTask } : task;
					})]
				};
				gamificationStore.set(merged);
			} catch (error) {
				console.error('Error loading gamification data:', error);
				// If there's an error, reset to default
				resetGamificationDataForUser(userEmail);
			}
		} else {
			// No saved data for this user, use default
			resetGamificationDataForUser(userEmail);
		}
	}
}

// Add XP and check for level ups
export function addXP(amount: number, userEmail?: string): void {
	gamificationStore.update(current => {
		const newXP = current.xp + amount;
		let newLevel = current.level;
		
		// Check for level up
		const nextLevelData = LEVELS.find(level => level.level === current.level + 1);
		if (nextLevelData && newXP >= nextLevelData.xpRequired) {
			newLevel = nextLevelData.level;
		}
		
		const updated = { ...current, xp: newXP, level: newLevel };
		saveGamificationData(updated, userEmail);
		return updated;
	});
}

// Unlock achievement
export function unlockAchievement(achievementId: string, userEmail?: string): void {
	gamificationStore.update(current => {
		const achievement = current.achievements.find(a => a.id === achievementId);
		if (achievement && !achievement.unlocked) {
			const updatedAchievements = current.achievements.map(a => 
				a.id === achievementId 
					? { ...a, unlocked: true, unlockedAt: new Date() }
					: a
			);
			const updated = { 
				...current, 
				achievements: updatedAchievements 
			};
			saveGamificationData(updated, userEmail);
			
			// Add XP reward
			addXP(achievement.xpReward, userEmail);
			
			return updated;
		}
		return current;
	});
}

// Complete task
export function completeTask(taskId: string, userEmail?: string): void {
	gamificationStore.update(current => {
		const task = current.tasks.find(t => t.id === taskId);
		if (task && !task.completed) {
			const updatedTasks = current.tasks.map(t => 
				t.id === taskId 
					? { ...t, completed: true, completedAt: new Date() }
					: t
			);
			const updated = { 
				...current, 
				tasks: updatedTasks 
			};
			saveGamificationData(updated, userEmail);
			
			// Add XP reward
			addXP(task.xpReward, userEmail);
			
			return updated;
		}
		return current;
	});
}

// Add financial goal
export function addFinancialGoal(goal: Omit<FinancialGoal, 'id'>, userEmail?: string): void {
	gamificationStore.update(current => {
		const newGoal: FinancialGoal = {
			...goal,
			id: Date.now().toString()
		};
		const updated = {
			...current,
			financialGoals: [...current.financialGoals, newGoal]
		};
		saveGamificationData(updated, userEmail);
		return updated;
	});
}

// Update financial goal progress
export function updateFinancialGoalProgress(goalId: string, amount: number, userEmail?: string): void {
	gamificationStore.update(current => {
		const updatedGoals = current.financialGoals.map(goal => {
			if (goal.id === goalId) {
				const newAmount = goal.currentAmount + amount;
				const completed = newAmount >= goal.targetAmount;
				return {
					...goal,
					currentAmount: newAmount,
					completed,
					completedAt: completed && !goal.completed ? new Date() : goal.completedAt
				};
			}
			return goal;
		});
		
		const updated = { ...current, financialGoals: updatedGoals };
		saveGamificationData(updated, userEmail);
		return updated;
	});
}

// Delete financial goal
export function deleteFinancialGoal(goalId: string, userEmail?: string): void {
	gamificationStore.update(current => {
		const updatedGoals = current.financialGoals.filter(goal => goal.id !== goalId);
		const updated = { ...current, financialGoals: updatedGoals };
		saveGamificationData(updated, userEmail);
		return updated;
	});
}

// Update streak
export function updateStreak(): void {
	gamificationStore.update(current => {
		const today = new Date().toISOString().split('T')[0];
		const lastActive = current.lastActiveDate;
		
		let newStreak = current.streak;
		if (lastActive === today) {
			// Already updated today
			return current;
		} else if (lastActive === new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]) {
			// Yesterday, increment streak
			newStreak += 1;
		} else {
			// Break in streak, reset to 1
			newStreak = 1;
		}
		
		const updated = {
			...current,
			streak: newStreak,
			lastActiveDate: today
		};
		saveGamificationData(updated);
		return updated;
	});
}

// Update application count
export function incrementApplications(userEmail?: string): void {
	gamificationStore.update(current => {
		const updated = { ...current, totalApplications: current.totalApplications + 1 };
		saveGamificationData(updated, userEmail);
		return updated;
	});
}

// Update interview count
export function incrementInterviews(userEmail?: string): void {
	gamificationStore.update(current => {
		const updated = { ...current, totalInterviews: current.totalInterviews + 1 };
		saveGamificationData(updated, userEmail);
		return updated;
	});
}

// Update jobs count
export function incrementJobs(userEmail?: string): void {
	gamificationStore.update(current => {
		const updated = { ...current, totalJobs: current.totalJobs + 1 };
		saveGamificationData(updated, userEmail);
		return updated;
	});
}

// Check and award achievements based on current state
export function checkAchievements(): void {
	gamificationStore.update(current => {
		const resumeData = get(resumeStore);
		const resumeCompletion = getResumeCompletion(resumeData);
		
		// Check resume achievements
		if (resumeData.personalInfo.firstName && resumeData.personalInfo.lastName) {
			unlockAchievement('first-resume');
		}
		
		if (resumeCompletion >= 100) {
			unlockAchievement('resume-complete');
		}
		
		if (resumeData.skills.length >= 5) {
			unlockAchievement('skills-added');
		}
		
		if (resumeData.experience.length > 0) {
			unlockAchievement('experience-added');
		}
		
		// Check application achievements
		if (current.totalApplications >= 1) {
			unlockAchievement('first-application');
		}
		
		if (current.totalApplications >= 20) {
			unlockAchievement('application-master');
		}
		
		// Check interview achievements
		if (current.totalInterviews >= 1) {
			unlockAchievement('first-interview');
		}
		
		if (current.totalInterviews >= 3) {
			unlockAchievement('interview-success');
		}
		
		// Check financial achievements
		const totalEarned = current.financialGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
		if (totalEarned >= 100) {
			unlockAchievement('first-paycheck');
		}
		
		if (totalEarned >= 1000) {
			unlockAchievement('financial-freedom');
		}
		
		return current;
	});
}

// Initialize the store when the module is imported
if (typeof window !== 'undefined') {
	loadGamificationData();
	updateStreak();
} 