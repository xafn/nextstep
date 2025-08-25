// Configuration file for NextStep frontend
export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    timeout: 10000, // 10 seconds
  },
  
  // App Configuration
  app: {
    name: 'NextStep',
    version: '1.0.0',
    description: 'Job platform for teenagers and employers',
  },
  
  // Feature Flags
  features: {
    idVerification: true,
    resumeBuilder: true,
    jobApplications: true,
    employerPortal: true,
  },
  
  // UI Configuration
  ui: {
    theme: 'light', // or 'dark'
    language: 'en',
    currency: 'USD',
  },
} as const;

export default config; 