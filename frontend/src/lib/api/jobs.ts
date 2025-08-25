import apiClient from './client';

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  hourly_rate_min: number;
  hourly_rate_max: number;
  hourly_rate_display: string;
  job_type: string;
  schedule: string;
  description: string;
  requirements: string[];
  tags: string[];
  rating: number;
  review_count: number;
  featured: boolean;
  posted_date: string;
  posted_date_display: string;
  is_active: boolean;
}

export interface JobApplication {
  id: number;
  job: Job;
  cover_letter: string;
  availability: string[];
  why_interested: string;
  relevant_experience: string;
  questions: string;
  status: string;
  applied_date: string;
  last_updated: string;
  applicant_name: string;
}

export interface JobApplicationCreate {
  job: number;
  cover_letter: string;
  availability: string[];
  why_interested: string;
  relevant_experience: string;
  questions?: string;
}

export interface JobFilters {
  job_type?: string;
  schedule?: string;
  location?: string;
  pay_range?: string;
  search?: string;
}

export class JobsAPI {
  // Get all jobs with optional filters
  static async getJobs(filters?: JobFilters): Promise<Job[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.job_type && filters.job_type !== 'All') {
        params.append('job_type', filters.job_type.toLowerCase());
      }
      if (filters.schedule && filters.schedule !== 'All') {
        params.append('schedule', filters.schedule.toLowerCase());
      }
      if (filters.location && filters.location !== 'All') {
        params.append('location', filters.location);
      }
      if (filters.pay_range && filters.pay_range !== 'All') {
        // Convert frontend pay range to backend format
        const payRangeMap: { [key: string]: string } = {
          'Under $10': 'under_10',
          '$10-15': '10_15',
          '$15-20': '15_20',
          '$20+': '20_plus'
        };
        params.append('pay_range', payRangeMap[filters.pay_range] || '');
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
    }
    
    const url = `/api/jobs/jobs/?${params.toString()}`;
    
    const response = await apiClient.get<{count: number, results: Job[]}>(url);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    // Handle paginated response from Django REST Framework
    if (response.data && response.data.results) {
      return response.data.results;
    }
    
    return response.data || [];
  }

  // Get a specific job by ID
  static async getJob(id: number): Promise<Job> {
    const response = await apiClient.get<Job>(`/api/jobs/jobs/${id}/`);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (!response.data) {
      throw new Error('Job not found');
    }
    
    return response.data;
  }

  // Get featured jobs
  static async getFeaturedJobs(): Promise<Job[]> {
    const response = await apiClient.get<{count: number, results: Job[]}>('/api/jobs/jobs/featured/');
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    // Handle paginated response from Django REST Framework
    if (response.data && response.data.results) {
      return response.data.results;
    }
    
    return response.data || [];
  }

  // Get recent jobs
  static async getRecentJobs(): Promise<Job[]> {
    const response = await apiClient.get<{count: number, results: Job[]}>('/api/jobs/jobs/recent/');
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    // Handle paginated response from Django REST Framework
    if (response.data && response.data.results) {
      return response.data.results;
    }
    
    return response.data || [];
  }

  // Apply to a job
  static async applyToJob(jobId: number, application: Omit<JobApplicationCreate, 'job'>): Promise<{ message: string; application_id: number }> {
    const response = await apiClient.post<{ message: string; application_id: number }>(
      `/api/jobs/jobs/${jobId}/apply/`,
      application
    );
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (!response.data) {
      throw new Error('Failed to submit application');
    }
    
    return response.data;
  }

  // Get user's job applications
  static async getUserApplications(): Promise<JobApplication[]> {
    const response = await apiClient.get<{count: number, results: JobApplication[]}>('/api/jobs/applications/');
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    // Handle paginated response from Django REST Framework
    if (response.data && response.data.results) {
      return response.data.results;
    }
    
    return response.data || [];
  }

  // Get a specific application
  static async getApplication(id: number): Promise<JobApplication> {
    const response = await apiClient.get<JobApplication>(`/api/jobs/applications/${id}/`);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (!response.data) {
      throw new Error('Application not found');
    }
    
    return response.data;
  }

  // Update application status (for employers)
  static async updateApplicationStatus(id: number, status: string): Promise<{ message: string; status: string }> {
    const response = await apiClient.patch<{ message: string; status: string }>(
      `/api/jobs/applications/${id}/update_status/`,
      { status }
    );
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (!response.data) {
      throw new Error('Failed to update status');
    }
    
    return response.data;
  }
} 