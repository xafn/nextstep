from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Job, JobApplication
from .serializers import (
    JobSerializer, 
    JobApplicationSerializer, 
    JobApplicationCreateSerializer
)

class JobViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for job listings
    """
    queryset = Job.objects.filter(is_active=True)
    serializer_class = JobSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['job_type', 'schedule', 'location', 'featured']
    search_fields = ['title', 'company', 'description', 'tags']
    ordering_fields = ['posted_date', 'hourly_rate_min', 'rating']
    ordering = ['-posted_date']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by pay range if provided
        pay_range = self.request.query_params.get('pay_range', None)
        if pay_range:
            if pay_range == 'under_10':
                queryset = queryset.filter(hourly_rate_min__lt=10)
            elif pay_range == '10_15':
                queryset = queryset.filter(hourly_rate_min__gte=10, hourly_rate_min__lte=15)
            elif pay_range == '15_20':
                queryset = queryset.filter(hourly_rate_min__gte=15, hourly_rate_min__lte=20)
            elif pay_range == '20_plus':
                queryset = queryset.filter(hourly_rate_min__gte=20)
        
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def apply(self, request, pk=None):
        """
        Apply to a job
        """
        job = self.get_object()
        serializer = JobApplicationCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            # Check if user has already applied
            if JobApplication.objects.filter(job=job, applicant=request.user).exists():
                return Response(
                    {'error': 'You have already applied to this job.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create the application
            application = serializer.save(job=job)
            
            return Response({
                'message': 'Application submitted successfully!',
                'application_id': application.id
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Get featured jobs
        """
        featured_jobs = self.get_queryset().filter(featured=True)[:5]
        serializer = self.get_serializer(featured_jobs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """
        Get recently posted jobs
        """
        recent_jobs = self.get_queryset()[:10]
        serializer = self.get_serializer(recent_jobs, many=True)
        return Response(serializer.data)

class JobApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for job applications
    """
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'job']
    ordering_fields = ['applied_date', 'last_updated']
    ordering = ['-applied_date']
    
    def get_queryset(self):
        # Users can only see their own applications
        return JobApplication.objects.filter(applicant=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return JobApplicationCreateSerializer
        return JobApplicationSerializer
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """
        Update application status (for employers)
        """
        application = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(JobApplication.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.status = new_status
        application.save()
        
        return Response({
            'message': 'Status updated successfully',
            'status': new_status
        }) 