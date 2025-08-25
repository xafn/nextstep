from rest_framework import serializers
from .models import Job, JobApplication

class JobSerializer(serializers.ModelSerializer):
    hourly_rate_display = serializers.ReadOnlyField()
    posted_date_display = serializers.ReadOnlyField()
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company', 'location', 'hourly_rate_min', 
            'hourly_rate_max', 'hourly_rate_display', 'job_type', 'schedule',
            'description', 'requirements', 'tags', 'rating', 'review_count',
            'featured', 'posted_date', 'posted_date_display', 'is_active'
        ]
        read_only_fields = ['posted_date', 'rating', 'review_count', 'featured']

class JobApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    applicant_name = serializers.SerializerMethodField()
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'cover_letter', 'availability', 'why_interested',
            'relevant_experience', 'questions', 'status', 'applied_date',
            'last_updated', 'applicant_name'
        ]
        read_only_fields = ['applied_date', 'last_updated', 'applicant_name']
    
    def get_applicant_name(self, obj):
        return f"{obj.applicant.first_name} {obj.applicant.last_name}".strip() or obj.applicant.email
    
    def create(self, validated_data):
        # Set the applicant to the current user
        validated_data['applicant'] = self.context['request'].user
        return super().create(validated_data)

class JobApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            'cover_letter', 'availability', 'why_interested',
            'relevant_experience', 'questions'
        ]
    
    def create(self, validated_data):
        # Set the applicant to the current user
        validated_data['applicant'] = self.context['request'].user
        return super().create(validated_data) 