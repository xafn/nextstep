# apps/resume/admin.py
from django import forms
from django.contrib import admin
from django.db import models

from .models import (
    Resume, Education, Experience, Skill,
    Dashboard, FinanceGoal, AppliedJob, Achievement
)

# ---------- shared widget sizing (no external CSS) ----------
BASE_OVERRIDES = {
    models.CharField:   {'widget': forms.TextInput(attrs={'style': 'width: 320px'})},
    models.DecimalField:{'widget': forms.NumberInput(attrs={'style': 'width: 140px'})},
    models.DateField:   {'widget': forms.DateInput(attrs={'type': 'date', 'style': 'width: 160px'})},
    models.TextField:   {'widget': forms.Textarea(attrs={'rows': 3, 'style': 'width: 520px'})},
}

class CompactFormMixin:
    formfield_overrides = BASE_OVERRIDES


# ===================== DASHBOARD =====================

class FinanceGoalInline(CompactFormMixin, admin.StackedInline):
    """
    Switched from TabularInline -> StackedInline to avoid the wide table.
    Grouped into compact rows.
    """
    model = FinanceGoal
    extra = 0
    fieldsets = (
        (None, {
            'fields': (
                ('title',),
                ('current_amount', 'goal_amount', 'due_date'),
            )
        }),
    )
    verbose_name = "Finance goal"
    verbose_name_plural = "Finance goals"


class AppliedJobInline(CompactFormMixin, admin.StackedInline):
    """
    Switched from TabularInline -> StackedInline and grouped fields,
    with narrower select for status.
    """
    model = AppliedJob
    extra = 0
    readonly_fields = ('applied_on',)
    fieldsets = (
        (None, {
            'fields': (
                ('title', 'company'),
                ('location', 'status', 'applied_on'),
            )
        }),
    )
    verbose_name = "Applied job"
    verbose_name_plural = "Applied jobs"

    # Make the status select narrower (CharField with choices uses Select)
    def formfield_for_choice_field(self, db_field, request, **kwargs):
        formfield = super().formfield_for_choice_field(db_field, request, **kwargs)
        if db_field.name == 'status':
            formfield.widget.attrs.update({'style': 'width: 160px'})
        return formfield


class AchievementInline(CompactFormMixin, admin.StackedInline):
    model = Achievement
    extra = 0
    fields = (('title', 'task_xp'), ('awarded_on', 'awarded_at'))
    readonly_fields = ('awarded_on', 'awarded_at')
    verbose_name = "Achievement"
    verbose_name_plural = "Achievements"


@admin.register(Dashboard)
class DashboardAdmin(CompactFormMixin, admin.ModelAdmin):
    list_display = ('user', 'total_xp', 'level')
    search_fields = ('user__username', 'user__first_name', 'user__last_name')
    fields = (('user',), ('total_xp', 'level'))
    inlines = [FinanceGoalInline, AppliedJobInline, AchievementInline]
    ordering = ('user__username',)


# ====================== RESUME =======================

class EducationInline(CompactFormMixin, admin.StackedInline):
    model = Education
    extra = 0
    fieldsets = (
        (None, {
            'fields': (
                ('school_name', 'degree'),
                ('field_of_study',),
                ('start', 'end', 'gpa'),
            )
        }),
    )
    verbose_name = "Education"
    verbose_name_plural = "Educations"


class ExperienceInline(CompactFormMixin, admin.StackedInline):
    model = Experience
    extra = 0
    fieldsets = (
        (None, {
            'fields': (
                ('job_name', 'company'),
                ('location',),
                ('start', 'end', 'is_working_currently'),
                ('description',),
            )
        }),
    )
    verbose_name = "Experience"
    verbose_name_plural = "Experiences"


class SkillInline(CompactFormMixin, admin.TabularInline):
    model = Skill
    extra = 0
    fields = ('name', 'proficiency')
    verbose_name = "Skill"
    verbose_name_plural = "Skills"


@admin.register(Resume)
class ResumeAdmin(CompactFormMixin, admin.ModelAdmin):
    list_display = ('user', 'phone', 'location', 'linkedin')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'phone', 'location')
    fields = (('user',), ('phone', 'location'), ('linkedin',))
    inlines = [EducationInline, ExperienceInline, SkillInline]
    ordering = ('user__username',)
