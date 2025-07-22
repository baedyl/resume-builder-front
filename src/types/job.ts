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