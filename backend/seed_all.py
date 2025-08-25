from decimal import Decimal
from django.contrib.auth import get_user_model
from django.utils import timezone

from apps.resume.models import (
    Resume, Education, Experience, Skill,
    Dashboard, FinanceGoal, AppliedJob, Achievement,
    STATUS_APPLIED, STATUS_INTERVIEW,
)

User = get_user_model()

# Create user
u, _ = User.objects.get_or_create(
    username="testuser",
    defaults={"email": "testuser@example.com", "first_name": "Test", "last_name": "User"},
)
u.set_password("password123")
u.save()

# Resume + details
res, _ = Resume.objects.get_or_create(
    user=u,
    defaults={
        "phone": "416-555-0123",
        "location": "Brampton, ON",
        "linkedin": "https://www.linkedin.com/in/testuser",
    },
)

Education.objects.get_or_create(
    resume=res,
    school_name="Chinguacousy Secondary School",
    defaults={
        "degree": "High School Diploma",
        "field_of_study": "SciTech",
        "start": "2021-09-01",
        "end": "2025-06-30",
        "gpa": Decimal("3.80"),
    },
)

Education.objects.get_or_create(
    resume=res,
    school_name="University of Waterloo",
    defaults={
        "degree": "CFM",
        "field_of_study": "Computing and Financial Management",
        "start": "2025-09-01",
    },
)

Experience.objects.get_or_create(
    resume=res,
    job_name="Programming Instructor",
    defaults={
        "company": "Ultimate Coders",
        "location": "Oakville, ON",
        "start": "2025-03-01",
        "is_working_currently": True,
        "description": "Taught HTML, CSS, and JS basics to kids aged 7–14.",
    },
)

Experience.objects.get_or_create(
    resume=res,
    job_name="Pharmacy Assistant",
    defaults={
        "company": "Brampton Compounding Pharmacy",
        "location": "Brampton, ON",
        "start": "2024-10-01",
        "end": "2025-03-01",
        "description": "Directed patients using the EHR system and prepared blister packs.",
    },
)

Skill.objects.get_or_create(resume=res, name="Python", defaults={"proficiency": "Intermediate"})
Skill.objects.get_or_create(resume=res, name="HTML/CSS", defaults={"proficiency": "Intermediate"})
Skill.objects.get_or_create(resume=res, name="JavaScript", defaults={"proficiency": "Beginner"})

# Dashboard + sub-items
dash, _ = Dashboard.objects.get_or_create(user=u)

FinanceGoal.objects.get_or_create(
    dashboard=dash,
    title="Laptop fund",
    defaults={
        "current_amount": Decimal("250.00"),
        "goal_amount": Decimal("1200.00"),
    },
)

AppliedJob.objects.update_or_create(
    dashboard=dash,
    title="Software Engineering Intern",
    company="PointClickCare",
    defaults={
        "location": "Mississauga, ON",
        "status": STATUS_APPLIED,
        "applied_on": timezone.now().date(),
    },
)

AppliedJob.objects.update_or_create(
    dashboard=dash,
    title="Innovation Developer",
    company="RBC",
    defaults={
        "location": "Toronto, ON",
        "status": STATUS_INTERVIEW,
        "applied_on": timezone.now().date(),
    },
)

# Two achievements @ 50 XP each -> total 100 XP -> Level 2
Achievement.objects.update_or_create(
    dashboard=dash,
    title="Completed resume",
    defaults={"task_xp": 50, "awarded_on": timezone.now().date(), "awarded_at": timezone.now()},
)

Achievement.objects.update_or_create(
    dashboard=dash,
    title="Joined a club",
    defaults={"task_xp": 50, "awarded_on": timezone.now().date(), "awarded_at": timezone.now()},
)

# Force recompute (safe even if signals already did it)
dash.recalc_from_achievements()

print(f"Seeded: user={u.username}, resume+details, dashboard with XP={dash.total_xp}, level={dash.level}")
