export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  dateApplied: string;
  deadline?: string;
  salary?: string;
  location?: string;
  jobUrl?: string;
  description?: string;
  notes?: string;
  followUpDate?: string;
  interviewDate?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  resumeVersion?: string;
  coverLetterVersion?: string;
  createdAt: string;
  updatedAt: string;
}

export type JobStatus = 
  | 'applied'
  | 'interviewing'
  | 'offer'
  | 'rejected'
  | 'withdrawn'
  | 'pending'
  | 'follow-up';

export interface JobStats {
  total: number;
  applied: number;
  interviewing: number;
  offer: number;
  rejected: number;
  withdrawn: number;
  pending: number;
  followUp: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
}

export interface JobFilters {
  status?: JobStatus;
  company?: string;
  position?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateJobRequest {
  company: string;
  position: string;
  status: JobStatus;
  dateApplied: string;
  deadline?: string;
  salary?: string;
  location?: string;
  jobUrl?: string;
  description?: string;
  notes?: string;
  followUpDate?: string;
  interviewDate?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  resumeVersion?: string;
  coverLetterVersion?: string;
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {}

export interface JobFollowUp {
  id: string;
  company: string;
  position: string;
  followUpDate: string;
  daysUntil: number;
}

export interface JobDeadline {
  id: string;
  company: string;
  position: string;
  deadline: string;
  daysUntil: number;
}

// Job Opportunities Types
export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  jobType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  skills: string[];
  postedDate: string;
  applicationDeadline?: string;
  applicationUrl?: string;
  source: string;
  isActive: boolean;
  matchScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobSearchFilters {
  search?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  postedWithin?: number; // days
  company?: string;
  source?: string[];
  sortBy?: 'date' | 'relevance' | 'salary';
  sortOrder?: 'asc' | 'desc';
}

export interface JobSearchResponse {
  jobs: JobOpportunity[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface JobApplicationRequest {
  jobId: string;
  resumeId?: number;
  coverLetter?: string;
  notes?: string;
}

export interface JobApplicationResponse {
  id: string;
  jobId: string;
  userId: string;
  status: 'applied' | 'viewed' | 'shortlisted' | 'interview' | 'offer' | 'rejected';
  appliedAt: string;
  resumeId?: string;
  coverLetterId?: string;
  notes?: string;
  updatedAt: string;
}

export interface JobSourceStats {
  source: string;
  totalJobs: number;
  activeJobs: number;
  lastSync: string;
}