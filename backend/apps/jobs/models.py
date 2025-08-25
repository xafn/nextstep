from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()

class Job(models.Model):
    JOB_TYPE_CHOICES = [
        ('part-time', 'Part-time'),
        ('full-time', 'Full-time'),
        ('seasonal', 'Seasonal'),
        ('gig', 'Gig'),
        ('internship', 'Internship'),
    ]
    
    SCHEDULE_CHOICES = [
        ('part-time', 'Part-time'),
        ('full-time', 'Full-time'),
        ('flexible', 'Flexible'),
        ('weekends', 'Weekends'),
        ('evenings', 'Evenings'),
        ('summer', 'Summer'),
    ]
    
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    hourly_rate_min = models.DecimalField(max_digits=6, decimal_places=2)
    hourly_rate_max = models.DecimalField(max_digits=6, decimal_places=2)
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)
    schedule = models.CharField(max_length=20, choices=SCHEDULE_CHOICES)
    description = models.TextField()
    requirements = models.JSONField(default=list)  # Store as list of strings
    tags = models.JSONField(default=list)  # Store as list of strings
    rating = models.DecimalField(
        max_digits=3, 
        decimal_places=1, 
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        default=4.0
    )
    review_count = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    posted_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_jobs')
    
    class Meta:
        ordering = ['-posted_date']
        verbose_name = 'Job'
        verbose_name_plural = 'Jobs'
    
    def __str__(self):
        return f"{self.title} at {self.company}"
    
    @property
    def hourly_rate_display(self):
        if self.hourly_rate_min == self.hourly_rate_max:
            return f"${self.hourly_rate_min}"
        return f"${self.hourly_rate_min}-{self.hourly_rate_max}"
    
    @property
    def posted_date_display(self):
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        diff = now - self.posted_date
        
        if diff.days == 0:
            if diff.seconds < 3600:
                return f"{diff.seconds // 60} minutes ago"
            else:
                return f"{diff.seconds // 3600} hours ago"
        elif diff.days == 1:
            return "1 day ago"
        elif diff.days < 7:
            return f"{diff.days} days ago"
        elif diff.days < 30:
            weeks = diff.days // 7
            return f"{weeks} week{'s' if weeks > 1 else ''} ago"
        else:
            months = diff.days // 30
            return f"{months} month{'s' if months > 1 else ''} ago"

class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Application Submitted'),
        ('under_review', 'Under Review'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('interviewed', 'Interviewed'),
        ('hired', 'Hired'),
        ('rejected', 'Rejected'),
    ]
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_applications')
    cover_letter = models.TextField()
    availability = models.JSONField(default=list)  # Store as list of strings
    why_interested = models.TextField()
    relevant_experience = models.TextField()
    questions = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    applied_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-applied_date']
        unique_together = ['job', 'applicant']  # Prevent duplicate applications
    
    def __str__(self):
        return f"{self.applicant.email} - {self.job.title}" 