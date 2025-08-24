<script lang="ts">
    import {
        User,
        Briefcase,
        GraduationCap,
        Star,
        Award,
        MapPin,
        Calendar,
        Mail,
        Phone,
        Globe,
        Linkedin,
        Github,
        Download,
        Edit,
    } from "lucide-svelte";
    import { generateResumePDF } from "$lib/utils/pdfGenerator";

    export let resumeData: any;
    export let showActions = true;
    export let compact = false;

    function formatDate(dateString: string) {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    }

    function getSkillLevelColor(level: string) {
        switch (level) {
            case "beginner":
                return "var(--warning)";
            case "intermediate":
                return "var(--info)";
            case "advanced":
                return "var(--primary)";
            case "expert":
                return "var(--success)";
            default:
                return "var(--text-secondary)";
        }
    }

    function getSkillLevelText(level: string) {
        switch (level) {
            case "beginner":
                return "Beginner";
            case "intermediate":
                return "Intermediate";
            case "advanced":
                return "Advanced";
            case "expert":
                return "Expert";
            default:
                return "Beginner";
        }
    }
</script>

<div class="resume-preview" class:compact>
    <!-- Header -->
    <div class="resume-header">
        <div class="header-main">
            <h1>
                {resumeData.personalInfo.firstName}
                {resumeData.personalInfo.lastName}
            </h1>
            {#if resumeData.personalInfo.summary}
                <p class="summary">{resumeData.personalInfo.summary}</p>
            {/if}
        </div>

        <div class="header-contact">
            {#if resumeData.personalInfo.email}
                <div class="contact-item">
                    <Mail size={16} />
                    <span>{resumeData.personalInfo.email}</span>
                </div>
            {/if}

            {#if resumeData.personalInfo.phone}
                <div class="contact-item">
                    <Phone size={16} />
                    <span>{resumeData.personalInfo.phone}</span>
                </div>
            {/if}

            {#if resumeData.personalInfo.location}
                <div class="contact-item">
                    <MapPin size={16} />
                    <span>{resumeData.personalInfo.location}</span>
                </div>
            {/if}

            {#if resumeData.personalInfo.linkedin}
                <div class="contact-item">
                    <Linkedin size={16} />
                    <span>{resumeData.personalInfo.linkedin}</span>
                </div>
            {/if}

            {#if resumeData.personalInfo.github}
                <div class="contact-item">
                    <Github size={16} />
                    <span>{resumeData.personalInfo.github}</span>
                </div>
            {/if}

            {#if resumeData.personalInfo.website}
                <div class="contact-item">
                    <Globe size={16} />
                    <span>{resumeData.personalInfo.website}</span>
                </div>
            {/if}
        </div>
    </div>

    <!-- Actions -->
    {#if showActions}
        <div class="resume-actions">
            <a href="/resume" class="btn btn-outline">
                <Edit size={16} />
                Edit Resume
            </a>
            <button
                class="btn btn-primary"
                on:click={() => generateResumePDF(resumeData)}
            >
                <Download size={16} />
                Download PDF
            </button>
        </div>
    {/if}

    <!-- Experience Section -->
    {#if resumeData.experience && resumeData.experience.length > 0}
        <div class="resume-section">
            <h2><Briefcase size={20} /> Work Experience</h2>
            {#each resumeData.experience as experience}
                <div class="experience-item">
                    <div class="experience-header">
                        <h3>{experience.title}</h3>
                        <div class="experience-meta">
                            {#if experience.company}
                                <span class="company">{experience.company}</span
                                >
                            {/if}
                            {#if experience.location}
                                <span class="location"
                                    ><MapPin size={14} />
                                    {experience.location}</span
                                >
                            {/if}
                            <span class="dates">
                                <Calendar size={14} />
                                {formatDate(experience.startDate)} - {experience.current
                                    ? "Present"
                                    : formatDate(experience.endDate)}
                            </span>
                        </div>
                    </div>

                    {#if experience.description && experience.description.length > 0}
                        <ul class="experience-description">
                            {#each experience.description as description}
                                {#if description.trim()}
                                    <li>{description}</li>
                                {/if}
                            {/each}
                        </ul>
                    {/if}

                    {#if experience.skills && experience.skills.length > 0}
                        <div class="experience-skills">
                            {#each experience.skills as skill}
                                <span class="skill-tag">{skill}</span>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}

    <!-- Education Section -->
    {#if resumeData.education && resumeData.education.length > 0}
        <div class="resume-section">
            <h2><GraduationCap size={20} /> Education</h2>
            {#each resumeData.education as education}
                <div class="education-item">
                    <div class="education-header">
                        <h3>{education.degree || "Education"}</h3>
                        <div class="education-meta">
                            {#if education.school}
                                <span class="school">{education.school}</span>
                            {/if}
                            {#if education.field}
                                <span class="field">{education.field}</span>
                            {/if}
                            <span class="dates">
                                <Calendar size={14} />
                                {formatDate(education.startDate)} - {formatDate(
                                    education.endDate,
                                )}
                            </span>
                        </div>
                    </div>

                    {#if education.gpa}
                        <p class="gpa">GPA: {education.gpa}</p>
                    {/if}

                    {#if education.achievements && education.achievements.length > 0}
                        <ul class="achievements-list">
                            {#each education.achievements as achievement}
                                {#if achievement.trim()}
                                    <li>{achievement}</li>
                                {/if}
                            {/each}
                        </ul>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}

    <!-- Skills Section -->
    {#if resumeData.skills && resumeData.skills.length > 0}
        <div class="resume-section">
            <h2><Star size={20} /> Skills</h2>
            <div class="skills-container">
                {#each ["technical", "soft", "languages", "tools"] as category}
                    {#if resumeData.skills.some((s: any) => s.category === category)}
                        <div class="skill-category">
                            <h4>
                                {category.charAt(0).toUpperCase() +
                                    category.slice(1)} Skills
                            </h4>
                            <div class="skills-grid">
                                {#each resumeData.skills.filter((s: any) => s.category === category) as skill}
                                    <div class="skill-item">
                                        <span class="skill-name"
                                            >{skill.name}</span
                                        >
                                        <span
                                            class="skill-level"
                                            style="color: {getSkillLevelColor(
                                                skill.level,
                                            )}"
                                        >
                                            {getSkillLevelText(skill.level)}
                                        </span>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    {/if}

    <!-- Projects Section -->
    {#if resumeData.projects && resumeData.projects.length > 0}
        <div class="resume-section">
            <h2><Award size={20} /> Projects</h2>
            <div class="projects-grid">
                {#each resumeData.projects as project}
                    <div class="project-item">
                        <h3>{project.title}</h3>
                        {#if project.description}
                            <p class="project-description">
                                {project.description}
                            </p>
                        {/if}

                        {#if project.technologies && project.technologies.length > 0}
                            <div class="project-technologies">
                                {#each project.technologies as tech}
                                    <span class="tech-tag">{tech}</span>
                                {/each}
                            </div>
                        {/if}

                        <div class="project-links">
                            {#if project.link}
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="project-link"
                                >
                                    <Globe size={14} />
                                    Live Demo
                                </a>
                            {/if}
                            {#if project.github}
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="project-link"
                                >
                                    <Github size={14} />
                                    GitHub
                                </a>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .resume-preview {
        background: white;
        border-radius: var(--radius-lg);
        border: 1px solid var(--border);
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
        box-shadow: var(--shadow-sm);
    }

    .resume-preview.compact {
        padding: 1.5rem;
        font-size: 0.9rem;
    }

    .resume-header {
        border-bottom: 2px solid var(--primary);
        padding-bottom: 1.5rem;
        margin-bottom: 2rem;
    }

    .header-main h1 {
        margin: 0 0 1rem 0;
        color: var(--primary);
        font-size: 2.5rem;
        font-weight: 700;
    }

    .compact .header-main h1 {
        font-size: 2rem;
    }

    .summary {
        margin: 0 0 1.5rem 0;
        color: var(--text-secondary);
        font-size: 1.1rem;
        line-height: 1.6;
    }

    .compact .summary {
        font-size: 1rem;
    }

    .header-contact {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.75rem;
    }

    .contact-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .contact-item svg {
        color: var(--primary);
        flex-shrink: 0;
    }

    .resume-actions {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        justify-content: center;
    }

    .resume-section {
        margin-bottom: 2rem;
    }

    .resume-section h2 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0 0 1.5rem 0;
        color: var(--primary);
        font-size: 1.5rem;
        border-bottom: 1px solid var(--border);
        padding-bottom: 0.5rem;
    }

    .compact .resume-section h2 {
        font-size: 1.25rem;
    }

    .experience-item,
    .education-item {
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--surface);
    }

    .experience-item:last-child,
    .education-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }

    .experience-header,
    .education-header {
        margin-bottom: 1rem;
    }

    .experience-header h3,
    .education-header h3 {
        margin: 0 0 0.5rem 0;
        color: var(--text);
        font-size: 1.2rem;
        font-weight: 600;
    }

    .compact .experience-header h3,
    .compact .education-header h3 {
        font-size: 1.1rem;
    }

    .experience-meta,
    .education-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .company,
    .school {
        font-weight: 500;
        color: var(--primary);
    }

    .location,
    .field,
    .dates {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .experience-description,
    .achievements-list {
        margin: 0 0 1rem 0;
        padding-left: 1.5rem;
    }

    .experience-description li,
    .achievements-list li {
        margin-bottom: 0.5rem;
        color: var(--text);
        line-height: 1.5;
    }

    .gpa {
        margin: 0 0 1rem 0;
        color: var(--text-secondary);
        font-weight: 500;
    }

    .experience-skills {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .skill-tag {
        background: var(--primary-light);
        color: var(--primary-dark);
        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-md);
        font-size: 0.8rem;
        font-weight: 500;
    }

    .skills-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .skill-category h4 {
        margin: 0 0 1rem 0;
        color: var(--text);
        font-size: 1.1rem;
        border-bottom: 1px solid var(--surface);
        padding-bottom: 0.5rem;
    }

    .skills-grid {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .skill-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: var(--surface);
        border-radius: var(--radius-md);
    }

    .skill-name {
        font-weight: 500;
        color: var(--text);
    }

    .skill-level {
        font-size: 0.8rem;
        font-weight: 500;
    }

    .projects-grid {
        display: grid;
        gap: 1.5rem;
    }

    .project-item {
        padding: 1.5rem;
        background: var(--surface);
        border-radius: var(--radius-lg);
        border: 1px solid var(--border);
    }

    .project-item h3 {
        margin: 0 0 1rem 0;
        color: var(--text);
        font-size: 1.2rem;
        font-weight: 600;
    }

    .project-description {
        margin: 0 0 1rem 0;
        color: var(--text-secondary);
        line-height: 1.6;
    }

    .project-technologies {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .tech-tag {
        background: var(--accent-light);
        color: var(--accent-dark);
        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-md);
        font-size: 0.8rem;
        font-weight: 500;
    }

    .project-links {
        display: flex;
        gap: 1rem;
    }

    .project-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--primary);
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        transition: color var(--transition-normal);
    }

    .project-link:hover {
        color: var(--primary-dark);
    }

    @media print {
        .resume-actions {
            display: none;
        }

        .resume-preview {
            box-shadow: none;
            border: none;
            padding: 0;
        }
    }

    @media (max-width: 768px) {
        .resume-preview {
            padding: 1.5rem;
        }

        .header-contact {
            grid-template-columns: 1fr;
        }

        .experience-meta,
        .education-meta {
            flex-direction: column;
            gap: 0.5rem;
        }

        .skills-container {
            grid-template-columns: 1fr;
        }

        .resume-actions {
            flex-direction: column;
            align-items: center;
        }
    }

    @media (max-width: 480px) {
        .resume-preview {
            padding: 1rem;
        }

        .header-main h1 {
            font-size: 2rem;
        }

        .compact .header-main h1 {
            font-size: 1.75rem;
        }
    }
</style>
