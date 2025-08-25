# apps/accounts/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count
from django.contrib.auth import get_user_model

from .models import Profile, Rating

User = get_user_model()

def _recalc_profile_averages(user: User):
    profile = getattr(user, "profile", None)
    if not profile:
        return

    # employer side
    emp_qs = Rating.objects.filter(ratee=user, for_role="employer")
    emp_agg = emp_qs.aggregate(avg=Avg("score"), cnt=Count("id"))
    profile.employer_rating_avg = round(emp_agg["avg"], 1) if emp_agg["avg"] else None
    profile.employer_rating_count = emp_agg["cnt"] or 0

    # worker side
    worker_qs = Rating.objects.filter(ratee=user, for_role="worker")
    worker_agg = worker_qs.aggregate(avg=Avg("score"), cnt=Count("id"))
    profile.worker_rating_avg = round(worker_agg["avg"], 1) if worker_agg["avg"] else None
    profile.worker_rating_count = worker_agg["cnt"] or 0

    profile.save(update_fields=[
        "employer_rating_avg", "employer_rating_count",
        "worker_rating_avg", "worker_rating_count"
    ])

@receiver(post_save, sender=Rating)
def update_ratings_on_save(sender, instance, **kwargs):
    _recalc_profile_averages(instance.ratee)

@receiver(post_delete, sender=Rating)
def update_ratings_on_delete(sender, instance, **kwargs):
    _recalc_profile_averages(instance.ratee)
