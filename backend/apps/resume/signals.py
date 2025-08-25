from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Achievement

@receiver([post_save, post_delete], sender=Achievement)
def achievement_saved(sender, instance, **kwargs):
    dash = instance.dashboard
    dash.recalc_from_achievements()
