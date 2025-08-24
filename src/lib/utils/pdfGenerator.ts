import { jsPDF } from 'jspdf';
import type { ResumeData } from '../stores/resume';

// Test function to verify jsPDF is working
export function testPDFGeneration(): void {
	try {
		const doc = new jsPDF();
		doc.text('Test PDF Generation', 20, 20);
		doc.save('test.pdf');
		console.log('PDF generation test successful');
	} catch (error) {
		console.error('PDF generation test failed:', error);
		alert('PDF generation is not working. Error: ' + error.message);
	}
}

export function generateResumePDF(resumeData: ResumeData): void {
	try {
		// Validate input
		if (!resumeData || !resumeData.personalInfo) {
			throw new Error('Invalid resume data');
		}

		// Create new PDF document
		const doc = new jsPDF();
		
		// Set margins and dimensions
		const leftMargin = 25;
		const rightMargin = 185;
		const topMargin = 25;
		const maxWidth = rightMargin - leftMargin;
		let yPosition = topMargin;
		
		// Helper function to add text with word wrapping
		function addWrappedText(text: string, x: number, y: number, maxWidth: number, fontSize: number = 10): number {
			doc.setFontSize(fontSize);
			const words = text.split(' ');
			let line = '';
			let currentY = y;
			const lineHeight = fontSize * 0.5;
			
			for (let i = 0; i < words.length; i++) {
				const testLine = line + words[i] + ' ';
				const testWidth = doc.getTextWidth(testLine);
				
				if (testWidth > maxWidth && i > 0) {
					doc.text(line.trim(), x, currentY);
					line = words[i] + ' ';
					currentY += lineHeight;
				} else {
					line = testLine;
				}
			}
			
			// Add the last line
			if (line.trim()) {
				doc.text(line.trim(), x, currentY);
				currentY += lineHeight;
			}
			
			return currentY;
		}
		
		// Helper function to format date
		function formatDate(dateString: string): string {
			if (!dateString) return '';
			const date = new Date(dateString);
			return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
		}
		
		// Helper function to add section divider
		function addSectionDivider(y: number): number {
			doc.setDrawColor(200, 200, 200);
			doc.line(leftMargin, y, rightMargin, y);
			return y + 8;
		}
		
		// ===== HEADER SECTION =====
		// Name - Large and prominent
		doc.setFontSize(28);
		doc.setFont('times', 'bold');
		doc.setTextColor(44, 62, 80);
		doc.text(`${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`, leftMargin, yPosition);
		yPosition += 12;
		
		// Contact information - clean layout
		doc.setFontSize(10);
		doc.setFont('times', 'normal');
		doc.setTextColor(52, 73, 94);
		
		const contactInfo = [];
		if (resumeData.personalInfo.email) contactInfo.push(resumeData.personalInfo.email);
		if (resumeData.personalInfo.phone) contactInfo.push(resumeData.personalInfo.phone);
		if (resumeData.personalInfo.location) contactInfo.push(resumeData.personalInfo.location);
		
		if (contactInfo.length > 0) {
			doc.text(contactInfo.join(' • '), leftMargin, yPosition);
			yPosition += 8;
		}
		
		// Social links
		const socialLinks = [];
		if (resumeData.personalInfo.linkedin) socialLinks.push(resumeData.personalInfo.linkedin);
		if (resumeData.personalInfo.github) socialLinks.push(resumeData.personalInfo.github);
		if (resumeData.personalInfo.website) socialLinks.push(resumeData.personalInfo.website);
		
		if (socialLinks.length > 0) {
			doc.setFont('times', 'normal');
			doc.text(socialLinks.join(' • '), leftMargin, yPosition);
			yPosition += 12;
		}
		
		// ===== SUMMARY SECTION =====
		if (resumeData.personalInfo.summary) {
			// Section header
			doc.setFontSize(14);
			doc.setFont('times', 'bold');
			doc.setTextColor(44, 62, 80);
			doc.text('SUMMARY', leftMargin, yPosition);
			yPosition += 8;
			
			// Summary text
			doc.setFontSize(10);
			doc.setFont('times', 'normal');
			doc.setTextColor(52, 73, 94);
			yPosition = addWrappedText(resumeData.personalInfo.summary, leftMargin, yPosition, maxWidth, 10);
			yPosition += 8;
		}
		
		// ===== EXPERIENCE SECTION =====
		if (resumeData.experience && resumeData.experience.length > 0) {
			// Section header
			doc.setFontSize(14);
			doc.setFont('times', 'bold');
			doc.setTextColor(44, 62, 80);
			doc.text('EXPERIENCE', leftMargin, yPosition);
			yPosition += 8;
			
			// Limit to 2 most recent experiences
			const recentExperience = resumeData.experience.slice(0, 2);
			
			recentExperience.forEach((experience, index) => {
				// Check if we have enough space
				if (yPosition > 220) return;
				
				// Job Title and Company on same line
				doc.setFontSize(12);
				doc.setFont('times', 'bold');
				doc.setTextColor(44, 62, 80);
				doc.text(experience.title, leftMargin, yPosition);
				
				// Company name - right aligned
				if (experience.company) {
					const companyX = rightMargin - 5;
					doc.setFont('times', 'normal');
					doc.setTextColor(52, 73, 94);
					doc.text(experience.company, companyX, yPosition, { align: 'right' });
				}
				yPosition += 6;
				
				// Location and Dates
				doc.setFontSize(9);
				doc.setFont('times', 'normal');
				doc.setTextColor(149, 165, 166);
				const metaInfo = [];
				if (experience.location) metaInfo.push(experience.location);
				if (experience.startDate) {
					const endDate = experience.current ? 'Present' : formatDate(experience.endDate);
					metaInfo.push(`${formatDate(experience.startDate)} - ${endDate}`);
				}
				
				if (metaInfo.length > 0) {
					doc.text(metaInfo.join(' • '), leftMargin, yPosition);
					yPosition += 6;
				}
				
				// Job Description - limit to 3 bullet points
				if (experience.description && experience.description.length > 0) {
					const limitedDesc = experience.description.slice(0, 3);
					limitedDesc.forEach(desc => {
						if (desc.trim() && yPosition < 220) {
							doc.setFontSize(9);
							doc.setFont('times', 'normal');
							doc.setTextColor(52, 73, 94);
							yPosition = addWrappedText(`• ${desc}`, leftMargin + 5, yPosition, maxWidth - 5, 9);
						}
					});
				}
				
				yPosition += 8;
				
				// Add divider between experiences (except after the last one)
				if (index < recentExperience.length - 1 && yPosition < 220) {
					yPosition = addSectionDivider(yPosition);
				}
			});
		}
		
		// ===== EDUCATION SECTION =====
		if (resumeData.education && resumeData.education.length > 0) {
			yPosition += 8;
			
			// Section header
			doc.setFontSize(14);
			doc.setFont('times', 'bold');
			doc.setTextColor(44, 62, 80);
			doc.text('EDUCATION', leftMargin, yPosition);
			yPosition += 8;
			
			// Show most recent education
			const education = resumeData.education[0];
			
			// Degree and School on same line
			doc.setFontSize(12);
			doc.setFont('times', 'bold');
			doc.setTextColor(44, 62, 80);
			const degreeText = education.degree || 'Education';
			doc.text(degreeText, leftMargin, yPosition);
			
			if (education.school) {
				const schoolX = rightMargin - 5;
				doc.setFont('times', 'normal');
				doc.setTextColor(52, 73, 94);
				doc.text(education.school, schoolX, yPosition, { align: 'right' });
			}
			yPosition += 6;
			
			// Field of study and dates
			doc.setFontSize(9);
			doc.setFont('times', 'normal');
			doc.setTextColor(149, 165, 166);
			const educationMeta = [];
			if (education.field) educationMeta.push(education.field);
			if (education.startDate) {
				const endDate = education.endDate ? formatDate(education.endDate) : 'Present';
				educationMeta.push(`${formatDate(education.startDate)} - ${endDate}`);
			}
			if (education.gpa) educationMeta.push(`GPA: ${education.gpa}`);
			
			if (educationMeta.length > 0) {
				doc.text(educationMeta.join(' • '), leftMargin, yPosition);
				yPosition += 6;
			}
			
			// Key achievements - limit to 2
			if (education.achievements && education.achievements.length > 0 && yPosition < 250) {
				const keyAchievements = education.achievements.slice(0, 2);
				keyAchievements.forEach(achievement => {
					if (achievement.trim() && yPosition < 250) {
						doc.setFontSize(9);
						doc.setFont('times', 'normal');
						doc.setTextColor(52, 73, 94);
						yPosition = addWrappedText(`• ${achievement}`, leftMargin + 5, yPosition, maxWidth - 5, 9);
					}
				});
			}
		}
		
		// ===== SKILLS SECTION =====
		if (resumeData.skills && resumeData.skills.length > 0) {
			yPosition += 8;
			
			// Section header
			doc.setFontSize(14);
			doc.setFont('times', 'bold');
			doc.setTextColor(44, 62, 80);
			doc.text('SKILLS', leftMargin, yPosition);
			yPosition += 8;
			
			// Group skills by category
			const skillsByCategory: { [key: string]: any[] } = {};
			resumeData.skills.forEach(skill => {
				if (!skillsByCategory[skill.category]) {
					skillsByCategory[skill.category] = [];
				}
				skillsByCategory[skill.category].push(skill);
			});
			
			// Display skills in a clean format
			const categories = Object.keys(skillsByCategory);
			let currentY = yPosition;
			
			categories.forEach(category => {
				if (currentY > 250) return;
				
				// Category header
				doc.setFontSize(10);
				doc.setFont('times', 'bold');
				doc.setTextColor(52, 73, 94);
				const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1) + ':';
				doc.text(categoryTitle, leftMargin, currentY);
				currentY += 5;
				
				// Skills in this category
				doc.setFontSize(9);
				doc.setFont('times', 'normal');
				doc.setTextColor(52, 73, 94);
				
				const skills = skillsByCategory[category];
				const skillTexts = skills.map(skill => skill.name).join(', ');
				currentY = addWrappedText(skillTexts, leftMargin + 5, currentY, maxWidth - 5, 9);
				currentY += 4;
			});
			
			yPosition = currentY;
		}
		
		// ===== PROJECTS SECTION =====
		if (resumeData.projects && resumeData.projects.length > 0 && yPosition < 250) {
			yPosition += 8;
			
			// Section header
			doc.setFontSize(14);
			doc.setFont('times', 'bold');
			doc.setTextColor(44, 62, 80);
			doc.text('PROJECTS', leftMargin, yPosition);
			yPosition += 8;
			
			// Show only the most recent project
			const project = resumeData.projects[0];
			
			// Project Title
			doc.setFontSize(12);
			doc.setFont('times', 'bold');
			doc.setTextColor(44, 62, 80);
			doc.text(project.title, leftMargin, yPosition);
			yPosition += 6;
			
			// Project Description - keep it brief
			if (project.description && yPosition < 250) {
				doc.setFontSize(9);
				doc.setFont('times', 'normal');
				doc.setTextColor(52, 73, 94);
				const shortDesc = project.description.length > 120 ? project.description.substring(0, 120) + '...' : project.description;
				yPosition = addWrappedText(shortDesc, leftMargin + 5, yPosition, maxWidth - 5, 9);
			}
			
			// Technologies - if space allows
			if (project.technologies && project.technologies.length > 0 && yPosition < 250) {
				yPosition += 3;
				doc.setFontSize(8);
				doc.setFont('times', 'normal');
				doc.setTextColor(149, 165, 166);
				const techText = `Technologies: ${project.technologies.join(', ')}`;
				yPosition = addWrappedText(techText, leftMargin + 5, yPosition, maxWidth - 5, 8);
			}
		}
		
		// ===== SAVE PDF =====
		const fileName = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`;
		
		// Try to save the PDF
		try {
			doc.save(fileName);
			console.log('PDF saved successfully:', fileName);
		} catch (saveError) {
			console.error('Error saving PDF:', saveError);
			// Fallback: try to open in new window
			const pdfDataUri = doc.output('datauristring');
			const newWindow = window.open();
			if (newWindow) {
				newWindow.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);
			} else {
				alert('PDF generated but could not be saved. Please check your browser settings.');
			}
		}
	} catch (error) {
		console.error('Error generating PDF:', error);
		alert('Error generating PDF. Please try again or check the console for details.');
	}
} 