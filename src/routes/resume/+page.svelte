<script lang="ts">
    import {
        FileText,
        User,
        Briefcase,
        GraduationCap,
        Award,
        Plus,
        Edit,
        Trash2,
        Download,
        Eye,
        Save,
        Lightbulb,
        CheckCircle,
        ArrowRight,
        Star,
        MapPin,
        Calendar,
        Mail,
        Phone,
        Globe,
        Linkedin,
        Github,
    } from "lucide-svelte";
    import { onMount } from "svelte";
    import {
        resumeStore,
        addResumeItem,
        removeResumeItem,
        updateResumeItem,
        getResumeCompletion,
        loadSampleResumeData,
    } from "$lib/stores/resume";
    import type {
        ResumeData,
        Education,
        Experience,
        Skill,
        Project,
    } from "$lib/stores/resume";
    import { generateResumePDF } from "$lib/utils/pdfGenerator";

    interface ResumeSection {
        id: string;
        title: string;
        content: any[];
        icon: any;
        description: string;
        tips: string[];
    }

    let resumeData: ResumeData;
    let activeSection = "personal";
    let showTips = false;
    let mounted = false;

    const resumeSections: ResumeSection[] = [
        {
            id: "personal",
            title: "Personal Information",
            icon: User,
            description: "Basic contact details and professional summary",
            tips: [
                "Use a professional email address",
                "Keep your summary concise (2-3 sentences)",
                "Include relevant social media profiles",
                "Make sure your phone number is current",
            ],
            content: [],
        },
        {
            id: "education",
            title: "Education",
            icon: GraduationCap,
            description: "Academic background and achievements",
            tips: [
                "List your most recent education first",
                "Include GPA if it's 3.0 or higher",
                "Add relevant coursework or projects",
                "Highlight academic achievements",
            ],
            content: [],
        },
        {
            id: "experience",
            title: "Work Experience",
            icon: Briefcase,
            description: "Professional work history and responsibilities",
            tips: [
                "Use action verbs to start bullet points",
                "Quantify achievements when possible",
                "Focus on relevant experience",
                "Keep descriptions concise but impactful",
            ],
            content: [],
        },
        {
            id: "skills",
            title: "Skills",
            icon: Star,
            description: "Technical and soft skills",
            tips: [
                "Group skills by category",
                "Be honest about your skill level",
                "Include both technical and soft skills",
                "Update skills based on job requirements",
            ],
            content: [],
        },
        {
            id: "projects",
            title: "Projects",
            icon: Award,
            description: "Personal and academic projects",
            tips: [
                "Choose projects that showcase relevant skills",
                "Include links to live demos or code",
                "Describe the problem you solved",
                "Highlight technologies used",
            ],
            content: [],
        },
    ];

    // Subscribe to the resume store
    resumeStore.subscribe((data) => {
        resumeData = data;
    });

    onMount(() => {
        mounted = true;
    });

    function addEducation() {
        const newEducation: Education = {
            id: Date.now().toString(),
            school: "",
            degree: "",
            field: "",
            startDate: "",
            endDate: "",
            achievements: [],
        };
        addResumeItem("education", newEducation);
    }

    function addExperience() {
        const newExperience: Experience = {
            id: Date.now().toString(),
            title: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            description: [],
            skills: [],
        };
        addResumeItem("experience", newExperience);
    }

    function addSkill() {
        const newSkill: Skill = {
            id: Date.now().toString(),
            name: "",
            level: "beginner",
            category: "",
        };
        addResumeItem("skills", newSkill);
    }

    function addProject() {
        const newProject: Project = {
            id: Date.now().toString(),
            title: "",
            description: "",
            technologies: [],
        };
        addResumeItem("projects", newProject);
    }

    function removeItem(section: string, id: string) {
        if (section === "education") {
            removeResumeItem("education", id);
        } else if (section === "experience") {
            removeResumeItem("experience", id);
        } else if (section === "skills") {
            removeResumeItem("skills", id);
        } else if (section === "projects") {
            removeResumeItem("projects", id);
        }
    }

    function downloadResume() {
        console.log("Download resume clicked");
        console.log("Resume data:", resumeData);

        if (resumeData && resumeData.personalInfo.firstName) {
            console.log(
                "Generating PDF for:",
                resumeData.personalInfo.firstName,
                resumeData.personalInfo.lastName,
            );
            generateResumePDF(resumeData);
        } else {
            alert(
                "Please fill in your personal information first, or load sample data to test the PDF generation.",
            );
        }
    }

    function updatePersonalInfo(field: string, value: string) {
        resumeStore.update((current) => ({
            ...current,
            personalInfo: {
                ...current.personalInfo,
                [field]: value,
            },
        }));
    }
</script>

<svelte:head>
    <title>Build Your Resume - NextStep</title>
    <meta
        name="description"
        content="Create a professional resume with our guided builder. Perfect for teenagers entering the workforce."
    />
</svelte:head>

<div class="resume-builder">
    <div class="container">
        <!-- Header -->
        <div class="builder-header" class:animate-fade-in-up={mounted}>
            <div class="header-content">
                <div class="header-text">
                    <div class="header-badge">
                        <FileText size={20} />
                        <span>Resume Builder</span>
                    </div>
                    <h1>Build Your Professional Resume</h1>
                    <p>
                        Create a standout resume that showcases your skills and
                        experience. Our guided builder helps you highlight what
                        matters most to employers.
                    </p>
                    <div class="header-actions">
                        <button
                            class="btn btn-secondary"
                            on:click={downloadResume}
                        >
                            <Download size={16} />
                            Download PDF
                        </button>
                    </div>
                </div>
                <div class="header-illustration">
                    <FileText size={80} />
                </div>
            </div>
        </div>

        <!-- Builder Content -->
        <div class="builder-content">
            <!-- Navigation Sidebar -->
            <aside
                class="builder-sidebar"
                class:animate-fade-in-up={mounted}
                style="animation-delay: 0.1s"
            >
                <nav class="section-nav">
                    <h3>Resume Sections</h3>
                    <ul>
                        {#each resumeSections as section}
                            <li>
                                <button
                                    class="nav-item"
                                    class:active={activeSection === section.id}
                                    on:click={() =>
                                        (activeSection = section.id)}
                                >
                                    <svelte:component
                                        this={section.icon}
                                        size={18}
                                    />
                                    <span>{section.title}</span>
                                </button>
                            </li>
                        {/each}
                    </ul>
                </nav>

                <div class="tips-toggle">
                    <button
                        class="btn btn-outline"
                        on:click={() => (showTips = !showTips)}
                    >
                        <Lightbulb size={16} />
                        {showTips ? "Hide" : "Show"} Tips
                    </button>
                </div>
            </aside>

            <!-- Main Content Area -->
            <main
                class="builder-main"
                class:animate-fade-in-up={mounted}
                style="animation-delay: 0.2s"
            >
                {#if activeSection === "personal"}
                    <div class="section-content">
                        <div class="section-header">
                            <User size={24} />
                            <h2>Personal Information</h2>
                        </div>

                        <div class="form-grid">
                            <div class="form-group">
                                <label for="firstName">First Name *</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={resumeData?.personalInfo
                                        ?.firstName || ""}
                                    placeholder="Enter your first name"
                                    on:input={(e) =>
                                        updatePersonalInfo(
                                            "firstName",
                                            e.target.value,
                                        )}
                                />
                            </div>

                            <div class="form-group">
                                <label for="lastName">Last Name *</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={resumeData?.personalInfo?.lastName ||
                                        ""}
                                    placeholder="Enter your last name"
                                    on:input={(e) =>
                                        updatePersonalInfo(
                                            "lastName",
                                            e.target.value,
                                        )}
                                />
                            </div>

                            <div class="form-group">
                                <label for="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={resumeData?.personalInfo?.email ||
                                        ""}
                                    placeholder="your.email@example.com"
                                    on:input={(e) =>
                                        updatePersonalInfo(
                                            "email",
                                            e.target.value,
                                        )}
                                />
                            </div>

                            <div class="form-group">
                                <label for="phone">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={resumeData?.personalInfo?.phone ||
                                        ""}
                                    placeholder="(555) 123-4567"
                                    on:input={(e) =>
                                        updatePersonalInfo(
                                            "phone",
                                            e.target.value,
                                        )}
                                />
                            </div>

                            <div class="form-group">
                                <label for="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    value={resumeData?.personalInfo?.location ||
                                        ""}
                                    placeholder="City, State"
                                    on:input={(e) =>
                                        updatePersonalInfo(
                                            "location",
                                            e.target.value,
                                        )}
                                />
                            </div>

                            <div class="form-group">
                                <label for="linkedin">LinkedIn</label>
                                <input
                                    type="url"
                                    id="linkedin"
                                    value={resumeData?.personalInfo?.linkedin ||
                                        ""}
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    on:input={(e) =>
                                        updatePersonalInfo(
                                            "linkedin",
                                            e.target.value,
                                        )}
                                />
                            </div>
                        </div>

                        <div class="form-group full-width">
                            <label for="summary">Professional Summary</label>
                            <textarea
                                id="summary"
                                value={resumeData?.personalInfo?.summary || ""}
                                placeholder="Write a brief summary of your background, skills, and career goals..."
                                rows="4"
                                on:input={(e) =>
                                    updatePersonalInfo(
                                        "summary",
                                        e.target.value,
                                    )}
                            ></textarea>
                            <small
                                >Keep this concise (2-3 sentences) and highlight
                                what makes you unique.</small
                            >
                        </div>
                    </div>
                {/if}

                {#if activeSection === "education"}
                    <div class="section-content">
                        <div class="section-header">
                            <GraduationCap size={24} />
                            <h2>Education</h2>
                            <button
                                class="btn btn-primary"
                                on:click={addEducation}
                            >
                                <Plus size={16} />
                                Add Education
                            </button>
                        </div>

                        {#if !resumeData?.education || resumeData.education.length === 0}
                            <div class="empty-state">
                                <GraduationCap size={48} />
                                <h3>No education entries yet</h3>
                                <p>
                                    Add your educational background to showcase
                                    your academic achievements.
                                </p>
                                <button
                                    class="btn btn-primary"
                                    on:click={addEducation}
                                >
                                    <Plus size={16} />
                                    Add Your First Education Entry
                                </button>
                            </div>
                        {:else}
                            {#each resumeData.education as education, index}
                                <div class="entry-card">
                                    <div class="entry-header">
                                        <h4>Education #{index + 1}</h4>
                                        <button
                                            class="btn btn-icon"
                                            on:click={() =>
                                                removeItem(
                                                    "education",
                                                    education.id,
                                                )}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div class="form-grid">
                                        <div class="form-group">
                                            <label>School/Institution *</label>
                                            <input
                                                type="text"
                                                value={education.school}
                                                placeholder="School name"
                                                on:input={(e) =>
                                                    updateResumeItem(
                                                        "education",
                                                        education.id,
                                                        {
                                                            school: e.target
                                                                .value,
                                                        },
                                                    )}
                                            />
                                        </div>

                                        <div class="form-group">
                                            <label>Degree/Diploma</label>
                                            <input
                                                type="text"
                                                value={education.degree}
                                                placeholder="e.g., High School Diploma"
                                                on:input={(e) =>
                                                    updateResumeItem(
                                                        "education",
                                                        education.id,
                                                        {
                                                            degree: e.target
                                                                .value,
                                                        },
                                                    )}
                                            />
                                        </div>

                                        <div class="form-group">
                                            <label>Field of Study</label>
                                            <input
                                                type="text"
                                                value={education.field}
                                                placeholder="e.g., General Studies"
                                                on:input={(e) =>
                                                    updateResumeItem(
                                                        "education",
                                                        education.id,
                                                        {
                                                            field: e.target
                                                                .value,
                                                        },
                                                    )}
                                            />
                                        </div>

                                        <div class="form-group">
                                            <label>Start Date</label>
                                            <input
                                                type="month"
                                                value={education.startDate}
                                                on:input={(e) =>
                                                    updateResumeItem(
                                                        "education",
                                                        education.id,
                                                        {
                                                            startDate:
                                                                e.target.value,
                                                        },
                                                    )}
                                            />
                                        </div>

                                        <div class="form-group">
                                            <label>End Date</label>
                                            <input
                                                type="month"
                                                value={education.endDate}
                                                on:input={(e) =>
                                                    updateResumeItem(
                                                        "education",
                                                        education.id,
                                                        {
                                                            endDate:
                                                                e.target.value,
                                                        },
                                                    )}
                                            />
                                        </div>

                                        <div class="form-group">
                                            <label>GPA (if applicable)</label>
                                            <input
                                                type="text"
                                                value={education.gpa || ""}
                                                placeholder="e.g., 3.8"
                                                on:input={(e) =>
                                                    updateResumeItem(
                                                        "education",
                                                        education.id,
                                                        { gpa: e.target.value },
                                                    )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>
                {/if}

                {#if activeSection === "experience"}
                    <div class="section-content">
                        <div class="section-header">
                            <Briefcase size={24} />
                            <h2>Work Experience</h2>
                            <button
                                class="btn btn-primary"
                                on:click={addExperience}
                            >
                                <Plus size={16} />
                                Add Experience
                            </button>
                        </div>

                        {#if !resumeData?.experience || resumeData.experience.length === 0}
                            <div class="empty-state">
                                <Briefcase size={48} />
                                <h3>No work experience yet</h3>
                                <p>
                                    Add your work experience, internships, or
                                    volunteer work to showcase your skills.
                                </p>
                                <button
                                    class="btn btn-primary"
                                    on:click={addExperience}
                                >
                                    <Plus size={16} />
                                    Add Your First Experience
                                </button>
                            </div>
                        {:else}
                            {#each resumeData.experience as experience, index}
                                <div class="entry-card">
                                    <div class="entry-header">
                                        <h4>Experience #{index + 1}</h4>
                                        <button
                                            class="btn btn-icon"
                                            on:click={() =>
                                                removeItem(
                                                    "experience",
                                                    experience.id,
                                                )}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div class="form-grid">
                                        <div class="form-group">
                                            <label>Job Title *</label>
                                            <input
                                                type="text"
                                                value={experience.title}
                                                placeholder="e.g., Cashier, Tutor, Babysitter"
                                                on:input={(e) =>
                                                    updateResumeItem(
                                                        "experience",
                                                        experience.id,
                                                        {
                                                            title: e.target
                                                                .value,
                                                        },
                                                    )}
                                            />
                                        </div>

                                        <div class="form-group">
                                            <label>Company/Organization</label>
                                            <input
                                                type="text"
                                                value={experience.company}
                                                placeholder="Company name"
                                                on:input={(e) =>
                                                    updateResumeItem(
                                                        "experience",
                                                        experience.id,
                                                        {
                                                            company:
                                                                e.target.value,
                                                        },
                                                    )}
                                            />
                                        </div>

                                        <div class="form-group">
                                            <label>Location</label>
                                            <input
                                                type="text"
                                                value={experience.location}
                                                placeholder="City, State"
                                                on:input={(e) =>
                                                    updateResumeItem(
                                                        "experience",
                                                        experience.id,
                                                        {
                                                            location:
                                                                e.target.value,
                                                        },
                                                    )}
                                            />
                                        </div>

                                        <div class="form-group">
                                            <label>Start Date</label>
                                            <input
                                                type="month"
                                                value={experience.startDate}
                                                on:input={(e) =>
                                                    updateResumeItem(
                                                        "experience",
                                                        experience.id,
                                                        {
                                                            startDate:
                                                                e.target.value,
                                                        },
                                                    )}
                                            />
                                        </div>

                                        <div class="form-group">
                                            <label>End Date</label>
                                            <input
                                                type="month"
                                                value={experience.endDate}
                                                disabled={experience.current}
                                                on:input={(e) =>
                                                    updateResumeItem(
                                                        "experience",
                                                        experience.id,
                                                        {
                                                            endDate:
                                                                e.target.value,
                                                        },
                                                    )}
                                            />
                                        </div>

                                        <div class="form-group checkbox-group">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={experience.current}
                                                    on:change={(e) =>
                                                        updateResumeItem(
                                                            "experience",
                                                            experience.id,
                                                            {
                                                                current:
                                                                    e.target
                                                                        .checked,
                                                            },
                                                        )}
                                                />
                                                Current Position
                                            </label>
                                        </div>
                                    </div>

                                    <div class="form-group full-width">
                                        <label>Job Description</label>
                                        <textarea
                                            value={experience.description.join(
                                                "\n",
                                            )}
                                            placeholder="Describe your responsibilities and achievements..."
                                            rows="4"
                                            on:input={(e) => {
                                                const descriptions =
                                                    e.target.value
                                                        .split("\n")
                                                        .filter((d) =>
                                                            d.trim(),
                                                        );
                                                updateResumeItem(
                                                    "experience",
                                                    experience.id,
                                                    {
                                                        description:
                                                            descriptions,
                                                    },
                                                );
                                            }}
                                        ></textarea>
                                        <small
                                            >Use bullet points and action verbs.
                                            Focus on achievements and impact.</small
                                        >
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>
                {/if}

                {#if activeSection === "skills"}
                    <div class="section-content">
                        <div class="section-header">
                            <Star size={24} />
                            <h2>Skills</h2>
                            <button class="btn btn-primary" on:click={addSkill}>
                                <Plus size={16} />
                                Add Skill
                            </button>
                        </div>

                        {#if !resumeData?.skills || resumeData.skills.length === 0}
                            <div class="empty-state">
                                <Star size={48} />
                                <h3>No skills added yet</h3>
                                <p>
                                    Add your technical and soft skills to
                                    showcase your capabilities.
                                </p>
                                <button
                                    class="btn btn-primary"
                                    on:click={addSkill}
                                >
                                    <Plus size={16} />
                                    Add Your First Skill
                                </button>
                            </div>
                        {:else}
                            <div class="skills-grid">
                                {#each resumeData.skills as skill, index}
                                    <div class="skill-card">
                                        <div class="skill-header">
                                            <h4>Skill #{index + 1}</h4>
                                            <button
                                                class="btn btn-icon"
                                                on:click={() =>
                                                    removeItem(
                                                        "skills",
                                                        skill.id,
                                                    )}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div class="form-group">
                                            <label>Skill Name *</label>
                                            <input
                                                type="text"
                                                value={skill.name}
                                                placeholder="e.g., Customer Service, JavaScript"
                                                on:input={(e) =>
                                                    updateResumeItem(
                                                        "skills",
                                                        skill.id,
                                                        {
                                                            name: e.target
                                                                .value,
                                                        },
                                                    )}
                                            />
                                        </div>

                                        <div class="form-group">
                                            <label>Category</label>
                                            <select
                                                value={skill.category}
                                                on:change={(e) =>
                                                    updateResumeItem(
                                                        "skills",
                                                        skill.id,
                                                        {
                                                            category:
                                                                e.target.value,
                                                        },
                                                    )}
                                            >
                                                <option value=""
                                                    >Select category</option
                                                >
                                                <option value="technical"
                                                    >Technical Skills</option
                                                >
                                                <option value="soft"
                                                    >Soft Skills</option
                                                >
                                                <option value="languages"
                                                    >Languages</option
                                                >
                                                <option value="tools"
                                                    >Tools & Software</option
                                                >
                                            </select>
                                        </div>

                                        <div class="form-group">
                                            <label>Proficiency Level</label>
                                            <select
                                                value={skill.level}
                                                on:change={(e) =>
                                                    updateResumeItem(
                                                        "skills",
                                                        skill.id,
                                                        {
                                                            level: e.target
                                                                .value,
                                                        },
                                                    )}
                                            >
                                                <option value="beginner"
                                                    >Beginner</option
                                                >
                                                <option value="intermediate"
                                                    >Intermediate</option
                                                >
                                                <option value="advanced"
                                                    >Advanced</option
                                                >
                                                <option value="expert"
                                                    >Expert</option
                                                >
                                            </select>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/if}

                {#if activeSection === "projects"}
                    <div class="section-content">
                        <div class="section-header">
                            <Award size={24} />
                            <h2>Projects</h2>
                            <button
                                class="btn btn-primary"
                                on:click={addProject}
                            >
                                <Plus size={16} />
                                Add Project
                            </button>
                        </div>

                        {#if !resumeData?.projects || resumeData.projects.length === 0}
                            <div class="empty-state">
                                <Award size={48} />
                                <h3>No projects added yet</h3>
                                <p>
                                    Add personal or academic projects to
                                    showcase your skills and creativity.
                                </p>
                                <button
                                    class="btn btn-primary"
                                    on:click={addProject}
                                >
                                    <Plus size={16} />
                                    Add Your First Project
                                </button>
                            </div>
                        {:else}
                            {#each resumeData.projects as project, index}
                                <div class="entry-card">
                                    <div class="entry-header">
                                        <h4>Project #{index + 1}</h4>
                                        <button
                                            class="btn btn-icon"
                                            on:click={() =>
                                                removeItem(
                                                    "projects",
                                                    project.id,
                                                )}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div class="form-group">
                                        <label>Project Title *</label>
                                        <input
                                            type="text"
                                            value={project.title}
                                            placeholder="e.g., Personal Website, School Project"
                                            on:input={(e) =>
                                                updateResumeItem(
                                                    "projects",
                                                    project.id,
                                                    { title: e.target.value },
                                                )}
                                        />
                                    </div>

                                    <div class="form-group full-width">
                                        <label>Description</label>
                                        <textarea
                                            value={project.description}
                                            placeholder="Describe what the project does and what you learned..."
                                            rows="4"
                                            on:input={(e) =>
                                                updateResumeItem(
                                                    "projects",
                                                    project.id,
                                                    {
                                                        description:
                                                            e.target.value,
                                                    },
                                                )}
                                        ></textarea>
                                    </div>

                                    <div class="form-group">
                                        <label>Technologies Used</label>
                                        <input
                                            type="text"
                                            value={project.technologies.join(
                                                ", ",
                                            )}
                                            placeholder="e.g., HTML, CSS, JavaScript"
                                            on:input={(e) => {
                                                const technologies =
                                                    e.target.value
                                                        .split(",")
                                                        .map((t) => t.trim())
                                                        .filter((t) => t);
                                                updateResumeItem(
                                                    "projects",
                                                    project.id,
                                                    { technologies },
                                                );
                                            }}
                                        />
                                    </div>

                                    <div class="form-group">
                                        <label>Live Demo Link</label>
                                        <input
                                            type="url"
                                            value={project.link || ""}
                                            placeholder="https://yourproject.com"
                                            on:input={(e) =>
                                                updateResumeItem(
                                                    "projects",
                                                    project.id,
                                                    { link: e.target.value },
                                                )}
                                        />
                                    </div>

                                    <div class="form-group">
                                        <label>GitHub Repository</label>
                                        <input
                                            type="url"
                                            value={project.github || ""}
                                            placeholder="https://github.com/username/project"
                                            on:input={(e) =>
                                                updateResumeItem(
                                                    "projects",
                                                    project.id,
                                                    { github: e.target.value },
                                                )}
                                        />
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>
                {/if}
            </main>
        </div>

        <!-- Tips Panel -->
        {#if showTips}
            <div
                class="tips-panel"
                class:animate-fade-in-up={mounted}
                style="animation-delay: 0.3s"
            >
                <div class="tips-header">
                    <Lightbulb size={20} />
                    <h3>Pro Tips</h3>
                </div>
                {#if activeSection === "personal"}
                    <ul class="tips-list">
                        {#each resumeSections.find((s) => s.id === activeSection)?.tips || [] as tip}
                            <li><CheckCircle size={16} />{tip}</li>
                        {/each}
                    </ul>
                {:else if activeSection === "education"}
                    <ul class="tips-list">
                        {#each resumeSections.find((s) => s.id === activeSection)?.tips || [] as tip}
                            <li><CheckCircle size={16} />{tip}</li>
                        {/each}
                    </ul>
                {:else if activeSection === "experience"}
                    <ul class="tips-list">
                        {#each resumeSections.find((s) => s.id === activeSection)?.tips || [] as tip}
                            <li><CheckCircle size={16} />{tip}</li>
                        {/each}
                    </ul>
                {:else if activeSection === "skills"}
                    <ul class="tips-list">
                        {#each resumeSections.find((s) => s.id === activeSection)?.tips || [] as tip}
                            <li><CheckCircle size={16} />{tip}</li>
                        {/each}
                    </ul>
                {:else if activeSection === "projects"}
                    <ul class="tips-list">
                        {#each resumeSections.find((s) => s.id === activeSection)?.tips || [] as tip}
                            <li><CheckCircle size={16} />{tip}</li>
                        {/each}
                    </ul>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .resume-builder {
        padding: 2rem 0;
        background: var(--surface);
        min-height: 100vh;
    }

    .builder-header {
        background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--primary-dark) 100%
        );
        border-radius: var(--radius-xl);
        padding: 2.5rem;
        margin-bottom: 2rem;
        border: 1px solid var(--border);
        color: white;
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    p {
        color: var(--text-secondary-light);
    }

    .header-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: var(--radius-2xl);
        padding: 0.5rem 1rem;
        margin-bottom: 1rem;
        backdrop-filter: blur(10px);
        font-size: 0.9rem;
    }

    .header-text h1 {
        margin-bottom: 0.5rem;
        font-size: clamp(2rem, 4vw, 2.5rem);
    }

    .header-text p {
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
        opacity: 0.9;
    }

    .header-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .header-illustration {
        width: 128px;
        height: 128px;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        backdrop-filter: blur(10px);
    }

    .builder-content {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 2rem;
        align-items: start;
    }

    .builder-sidebar {
        position: sticky;
        top: 2rem;
    }

    .section-nav {
        background: white;
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow-sm);
        margin-bottom: 1rem;
    }

    .section-nav h3 {
        margin: 0 0 1rem 0;
        color: var(--text);
        font-size: 1.1rem;
    }

    .section-nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .section-nav li {
        margin-bottom: 0.5rem;
    }

    .nav-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.75rem 1rem;
        border: none;
        background: none;
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        font-size: 0.9rem;
        cursor: pointer;
        transition: all var(--transition-normal);
        text-align: left;
    }

    .nav-item:hover {
        background: var(--surface);
        color: var(--text);
    }

    .nav-item.active {
        background: var(--primary);
        color: white;
    }

    .tips-toggle {
        text-align: center;
    }

    .builder-main {
        background: white;
        border-radius: var(--radius-xl);
        border: 1px solid var(--border);
        box-shadow: var(--shadow-sm);
        overflow: hidden;
    }

    .section-content {
        padding: 2rem;
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .section-header h2 {
        margin: 0;
        color: var(--text);
        flex: 1;
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    .form-group.full-width {
        grid-column: 1 / -1;
    }

    .form-group label {
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text);
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        padding: 0.75rem;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        font-size: 0.9rem;
        transition: border-color var(--transition-normal);
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--primary);
    }

    .form-group small {
        margin-top: 0.25rem;
        color: var(--text-secondary);
        font-size: 0.8rem;
    }

    .checkbox-group label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    }

    .checkbox-group input[type="checkbox"] {
        width: auto;
        margin: 0;
    }

    .entry-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .entry-header h4 {
        margin: 0;
        color: var(--text);
    }

    .btn-icon {
        padding: 0.5rem;
        border: 1px solid var(--border);
        background: white;
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all var(--transition-normal);
    }

    .btn-icon:hover {
        border-color: var(--error);
        color: var(--error);
    }

    .empty-state {
        text-align: center;
        padding: 3rem 2rem;
        color: var(--text-secondary);
    }

    .empty-state h3 {
        margin: 1rem 0 0.5rem 0;
        color: var(--text);
    }

    .empty-state p {
        margin-bottom: 1.5rem;
    }

    .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .skill-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
    }

    .skill-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .skill-header h4 {
        margin: 0;
        color: var(--text);
    }

    .tips-panel {
        position: fixed;
        right: 2rem;
        bottom: 2rem;
        background: white;
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow-lg);
        max-width: 300px;
        z-index: 1000;
    }

    .tips-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .tips-header h3 {
        margin: 0;
        color: var(--text);
        font-size: 1.1rem;
    }

    .tips-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .tips-list li {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
        line-height: 1.4;
    }

    .tips-list li svg {
        color: var(--accent);
        flex-shrink: 0;
        margin-top: 0.125rem;
    }

    @media (max-width: 1024px) {
        .builder-content {
            grid-template-columns: 1fr;
        }

        .builder-sidebar {
            position: static;
            order: 2;
        }

        .tips-panel {
            position: static;
            margin-top: 2rem;
            max-width: none;
        }
    }

    @media (max-width: 768px) {
        .header-content {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
        }

        .header-actions {
            justify-content: center;
        }

        .form-grid {
            grid-template-columns: 1fr;
        }

        .skills-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 480px) {
        .builder-header {
            padding: 2rem 1.5rem;
        }

        .section-content {
            padding: 1.5rem;
        }

        .header-actions {
            flex-direction: column;
            align-items: center;
        }
    }
</style>
