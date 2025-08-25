# core/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def api_root(request):
    """Simple API root describing available endpoints."""
    return JsonResponse({
        "message": "Job Platform Backend API",
        "version": "1.0.0",
        "endpoints": {
            "admin": "/admin/",
            "accounts": {
                "register": "/api/accounts/register/",
                "login": "/api/accounts/login/",
                "me": "/api/accounts/me/",
                "token_refresh": "/api/accounts/token/refresh/",
            }
        }
    })


urlpatterns = [
    path("", api_root, name="api_root"),
    path("admin/", admin.site.urls),
    path("api/accounts/", include("apps.accounts.urls")),
    # If you re-enable these later, uncomment:
    # path("api/jobs/", include("apps.jobs.urls")),
    # path("api/checkins/", include("apps.checkins.urls")),
]

# Serve media in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
