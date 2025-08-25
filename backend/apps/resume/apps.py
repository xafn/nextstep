from django.apps import AppConfig

class ResumeConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.resume"
    verbose_name = "RESUME & DASHBOARD"

    def ready(self):
        from . import signals  # noqa
