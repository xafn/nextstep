import { writable } from 'svelte/store';

export interface ResumeData {
	personalInfo: {
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		location: string;
		linkedin: string;
		github: string;
		website: string;
		summary: string;
	};
	education: Education[];
	experience: Experience[];
	skills: Skill[];
	projects: Project[];
	achievements: Achievement[];
}

export interface Education {
	id: string;
	school: string;
	degree: string;
	field: string;
	startDate: string;
	endDate: string;
	gpa?: string;
	achievements: string[];
}

export interface Experience {
	id: string;
	title: string;
	company: string;
	location: string;
	startDate: string;
	endDate: string;
	current: boolean;
	description: string[];
	skills: string[];
}

export interface Skill {
	id: string;
	name: string;
	level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
	category: string;
}

export interface Project {
	id: string;
	title: string;
	description: string;
	technologies: string[];
	link?: string;
	github?: string;
	image?: string;
}

export interface Achievement {
	id: string;
	title: string;
	description: string;
	date: string;
	issuer: string;
}

// Default resume template for teenagers
const defaultResume: ResumeData = {
	personalInfo: {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		location: '',
		linkedin: '',
		github: '',
		website: '',
		summary: ''
	},
	education: [],
	experience: [],
	skills: [],
	projects: [],
	achievements: []
};

// Create the store
export const resumeStore = writable<ResumeData>(defaultResume);

// Load resume data from localStorage
export function loadResumeData(): void {
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem('nextstep-resume');
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				resumeStore.set({ ...defaultResume, ...parsed });
			} catch (error) {
				console.error('Error loading resume data:', error);
			}
		}
	}
}

// Save resume data to localStorage
export function saveResumeData(data: ResumeData): void {
	if (typeof window !== 'undefined') {
		localStorage.setItem('nextstep-resume', JSON.stringify(data));
		resumeStore.set(data);
	}
}

// Update specific section of resume
export function updateResumeSection(section: keyof ResumeData, data: any): void {
	resumeStore.update(current => {
		const updated = { ...current, [section]: data };
		saveResumeData(updated);
		return updated;
	});
}

// Add item to a section
export function addResumeItem(section: keyof ResumeData, item: any): void {
	resumeStore.update(current => {
		const updated = { 
			...current, 
			[section]: [...(current[section] as any[]), item] 
		};
		saveResumeData(updated);
		return updated;
	});
}

// Remove item from a section
export function removeResumeItem(section: keyof ResumeData, id: string): void {
	resumeStore.update(current => {
		const updated = { 
			...current, 
			[section]: (current[section] as any[]).filter((item: any) => item.id !== id) 
		};
		saveResumeData(updated);
		return updated;
	});
}

// Update specific item in a section
export function updateResumeItem(section: keyof ResumeData, id: string, updates: any): void {
	resumeStore.update(current => {
		const updated = { 
			...current, 
			[section]: (current[section] as any[]).map((item: any) => 
				item.id === id ? { ...item, ...updates } : item
			)
		};
		saveResumeData(updated);
		return updated;
	});
}

// Clear all resume data
export function clearResumeData(): void {
	resumeStore.set(defaultResume);
	if (typeof window !== 'undefined') {
		localStorage.removeItem('nextstep-resume');
	}
}

// Get resume completion percentage
export function getResumeCompletion(data: ResumeData): number {
	let completed = 0;
	let total = 0;

	// Personal info (weighted heavily)
	if (data.personalInfo.firstName) completed += 10;
	if (data.personalInfo.lastName) completed += 10;
	if (data.personalInfo.email) completed += 15;
	if (data.personalInfo.phone) completed += 5;
	if (data.personalInfo.location) completed += 5;
	if (data.personalInfo.summary) completed += 10;
	total += 55;

	// Education
	if (data.education.length > 0) {
		completed += 15;
		const education = data.education[0];
		if (education.school) completed += 5;
		if (education.degree || education.field) completed += 5;
	}
	total += 25;

	// Experience
	if (data.experience.length > 0) {
		completed += 20;
	}
	total += 20;

	return Math.round((completed / total) * 100);
}

// Sample resume data for demonstration
export function loadSampleResumeData(): void {
	const sampleResume: ResumeData = {
		personalInfo: {
			firstName: "Jake",
			lastName: "Smith",
			email: "jake.smith@email.com",
			phone: "(555) 123-4567",
			location: "Toronto, ON",
			linkedin: "linkedin.com/in/jakesmith",
			github: "github.com/jakesmith",
			website: "jakesmith.dev",
			summary: "Ambitious high school student with strong technical skills and a passion for problem-solving. Experienced in web development, customer service, and leadership roles. Seeking opportunities to apply my skills and gain real-world experience."
		},
		education: [
			{
				id: "1",
				school: "Toronto High School",
				degree: "High School Diploma",
				field: "Computer Science & Mathematics",
				startDate: "2020-09",
				endDate: "2024-06",
				gpa: "3.8",
				achievements: [
					"Honor Roll Student (Grade 10-12)",
					"Computer Science Club President",
					"Math Team Captain",
					"Completed AP Computer Science A with 5/5 score"
				]
			}
		],
		experience: [
			{
				id: "1",
				title: "Web Developer Intern",
				company: "TechStart Toronto",
				location: "Toronto, ON",
				startDate: "2023-06",
				endDate: "2023-08",
				current: false,
				description: [
					"Developed responsive websites using HTML, CSS, and JavaScript",
					"Collaborated with senior developers on client projects",
					"Implemented user interface improvements based on feedback",
					"Assisted with testing and debugging web applications"
				],
				skills: ["HTML", "CSS", "JavaScript", "Git", "Responsive Design"]
			},
			{
				id: "2",
				title: "Customer Service Representative",
				company: "Local Coffee Shop",
				location: "Toronto, ON",
				startDate: "2022-09",
				endDate: "",
				current: true,
				description: [
					"Provide excellent customer service to 50+ daily customers",
					"Handle cash transactions and maintain accurate records",
					"Train new employees on company policies and procedures",
					"Maintain cleanliness and organization of the shop"
				],
				skills: ["Customer Service", "Cash Handling", "Team Training", "Organization"]
			}
		],
		skills: [
			{
				id: "1",
				name: "JavaScript",
				level: "intermediate",
				category: "technical"
			},
			{
				id: "2",
				name: "HTML/CSS",
				level: "advanced",
				category: "technical"
			},
			{
				id: "3",
				name: "Python",
				level: "intermediate",
				category: "technical"
			},
			{
				id: "4",
				name: "Customer Service",
				level: "advanced",
				category: "soft"
			},
			{
				id: "5",
				name: "Leadership",
				level: "intermediate",
				category: "soft"
			},
			{
				id: "6",
				name: "Problem Solving",
				level: "advanced",
				category: "soft"
			},
			{
				id: "7",
				name: "Spanish",
				level: "intermediate",
				category: "languages"
			}
		],
		projects: [
			{
				id: "1",
				title: "Personal Portfolio Website",
				description: "Built a responsive portfolio website showcasing my projects and skills. Features include dark/light mode toggle, smooth animations, and mobile-first design.",
				technologies: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
				link: "https://jakesmith.dev",
				github: "https://github.com/jakesmith/portfolio"
			},
			{
				id: "2",
				title: "School Event Management App",
				description: "Developed a web application for managing school events, including registration, scheduling, and attendance tracking. Used by 200+ students and faculty.",
				technologies: ["React", "Node.js", "MongoDB", "Express"],
				github: "https://github.com/jakesmith/school-events"
			}
		],
		achievements: []
	};
	
	resumeStore.set(sampleResume);
	if (typeof window !== 'undefined') {
		localStorage.setItem('nextstep-resume', JSON.stringify(sampleResume));
	}
}

// Initialize the store when the module is imported
if (typeof window !== 'undefined') {
	loadResumeData();
} 