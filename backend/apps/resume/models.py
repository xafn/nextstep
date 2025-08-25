from django.db import models
from django.conf import settings
from django.db.models import Sum
from django.db.models.functions import Coalesce
from django.utils import timezone

# -------------------------------------------------------------------
# XP curve helpers
#   L1->2:100, L2->3:125, L3->4:175, L4->5:225, ... (up to L10)
# -------------------------------------------------------------------
XP_INCREMENTS = [100, 125, 175, 225, 275, 325, 375, 425, 475]


def _build_thresholds():
    # cumulative thresholds, index 0 => L1 (0 xp), index 1 => L2 (100), etc.
    cum = [0]
    for inc in XP_INCREMENTS:
        cum.append(cum[-1] + inc)
    return cum


LEVEL_THRESHOLDS = _build_thresholds()


def level_from_xp(xp: int) -> int:
    if xp < 0:
        xp = 0
    level = 1
    for i, threshold in enumerate(LEVEL_THRESHOLDS[1:], start=2):
        if xp >= threshold:
            level = i
        else:
            break
    return level


def min_xp_for_level(level: int) -> int:
    if level <= 1:
        return 0
    idx = min(level - 1, len(LEVEL_THRESHOLDS) - 1)
    return LEVEL_THRESHOLDS[idx]


# -------------------------------------------------------------------
# Resume side (renamed from Profile)
# -------------------------------------------------------------------
class Resume(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resume",
    )
    phone = models.CharField(max_length=30, blank=True)
    location = models.CharField(max_length=120, blank=True)
    linkedin = models.URLField(blank=True)

    class Meta:
        verbose_name = "Resume"
        verbose_name_plural = "Resumes"

    def __str__(self):
        return f"{self.user.username} resume"


class Education(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="educations")
    school_name = models.CharField(max_length=120)
    degree = models.CharField(max_length=120, blank=True)
    field_of_study = models.CharField(max_length=120, blank=True)
    start = models.DateField(null=True, blank=True)
    end = models.DateField(null=True, blank=True)
    gpa = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)

    class Meta:
        ordering = ["start", "school_name"]

    def __str__(self):
        return self.school_name


class Experience(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="experiences")
    job_name = models.CharField(max_length=120)
    company = models.CharField(max_length=120, blank=True)
    location = models.CharField(max_length=120, blank=True)
    start = models.DateField(null=True, blank=True)
    end = models.DateField(null=True, blank=True)
    is_working_currently = models.BooleanField(default=False)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["-start", "company"]

    def __str__(self):
        return self.job_name


class Skill(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="skills")
    name = models.CharField(max_length=120)
    proficiency = models.CharField(max_length=120, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


# -------------------------------------------------------------------
# Dashboard side
# -------------------------------------------------------------------
class Dashboard(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="dashboard",
    )
    total_xp = models.PositiveIntegerField(default=0)
    level = models.PositiveIntegerField(default=1)

    class Meta:
        verbose_name = "Dashboard"
        verbose_name_plural = "Dashboards"

    def __str__(self):
        return f"{self.user.username} dashboard"

    # Single source of truth: sum achievements, recompute XP/Level
    def recalc_from_achievements(self, save=True):
        total = self.achievements.aggregate(
            s=Coalesce(Sum("task_xp"), 0)
        )["s"]
        self.total_xp = int(total or 0)
        self.level = level_from_xp(self.total_xp)
        if save:
            super().save(update_fields=["total_xp", "level"])

    # Keep XP and Level in sync when edited in admin
    def save(self, *args, **kwargs):
        if self.pk:
            old = Dashboard.objects.get(pk=self.pk)
            xp_changed = (self.total_xp != old.total_xp)
            level_changed = (self.level != old.level)

            if xp_changed and not level_changed:
                self.level = level_from_xp(self.total_xp)
            elif level_changed and not xp_changed:
                self.total_xp = min_xp_for_level(self.level)
        else:
            self.level = level_from_xp(self.total_xp or 0)

        super().save(*args, **kwargs)


class Achievement(models.Model):
    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE, related_name="achievements")
    title = models.CharField(max_length=200)
    task_xp = models.PositiveIntegerField(default=50)
    awarded_on = models.DateField(default=timezone.now, editable=False)
    awarded_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-awarded_at", "-id"]

    def __str__(self):
        return f"{self.title} (+{self.task_xp} XP)"


class FinanceGoal(models.Model):
    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE, related_name="finance_goals")
    title = models.CharField(max_length=200)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["due_date", "title"]

    def __str__(self):
        return self.title


# -------------------------------------------------------------------
# Applied jobs (module-level constants to avoid NameError)
# -------------------------------------------------------------------
STATUS_APPLIED = "applied"
STATUS_INTERVIEW = "interview"
STATUS_OFFER = "offer"
STATUS_REJECTED = "rejected"

STATUS_CHOICES = [
    (STATUS_APPLIED, "Applied"),
    (STATUS_INTERVIEW, "Interview"),
    (STATUS_OFFER, "Offer"),
    (STATUS_REJECTED, "Rejected"),
]


class AppliedJob(models.Model):
    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE, related_name="applied_jobs")
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_APPLIED)
    applied_on = models.DateField(default=timezone.now)  # avoids migration prompts

    class Meta:
        ordering = ["-applied_on", "company"]

    def __str__(self):
        return f"{self.title} @ {self.company}"
