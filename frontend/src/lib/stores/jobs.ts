import { writable } from 'svelte/store';
import { JobsAPI, type Job, type JobApplication, type JobFilters } from '$lib/api/jobs';

interface JobsState {
  jobs: Job[];
  applications: JobApplication[];
  selectedJob: Job | null;
  isLoading: boolean;
  error: string | null;
  filters: JobFilters;
}

function createJobsStore() {
  const { subscribe, set, update } = writable<JobsState>({
    jobs: [],
    applications: [],
    selectedJob: null,
    isLoading: false,
    error: null,
    filters: {}
  });

  return {
    subscribe,
    
    // Load jobs with optional filters
    async loadJobs(filters?: JobFilters) {
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const jobs = await JobsAPI.getJobs(filters);
        update(state => ({ 
          ...state, 
          jobs, 
          isLoading: false,
          filters: filters || {}
        }));
      } catch (error) {
        console.error('Error loading jobs:', error);
        update(state => ({ 
          ...state, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to load jobs'
        }));
      }
    },

    // Load featured jobs
    async loadFeaturedJobs() {
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const jobs = await JobsAPI.getFeaturedJobs();
        update(state => ({ ...state, jobs, isLoading: false }));
      } catch (error) {
        update(state => ({ 
          ...state, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to load featured jobs'
        }));
      }
    },

    // Load user applications
    async loadApplications() {
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const applications = await JobsAPI.getUserApplications();
        update(state => ({ ...state, applications, isLoading: false }));
      } catch (error) {
        update(state => ({ 
          ...state, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to load applications'
        }));
      }
    },

    // Select a job
    selectJob(job: Job | null) {
      update(state => ({ ...state, selectedJob: job }));
    },

    // Apply to a job
    async applyToJob(jobId: number, application: any) {
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const result = await JobsAPI.applyToJob(jobId, application);
        
        // Reload applications to show the new one
        await this.loadApplications();
        
        update(state => ({ ...state, isLoading: false }));
        return result;
      } catch (error) {
        update(state => ({ 
          ...state, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to submit application'
        }));
        throw error;
      }
    },

    // Clear error
    clearError() {
      update(state => ({ ...state, error: null }));
    },

    // Reset store
    reset() {
      set({
        jobs: [],
        applications: [],
        selectedJob: null,
        isLoading: false,
        error: null,
        filters: {}
      });
    }
  };
}

export const jobsStore = createJobsStore(); 