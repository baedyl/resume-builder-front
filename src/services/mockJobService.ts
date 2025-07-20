import { 
  JobApplication, 
  JobStats, 
  JobFilters, 
  CreateJobRequest, 
  UpdateJobRequest,
  JobFollowUp,
  JobDeadline 
} from '../types/job';

// Mock data
const mockJobs: JobApplication[] = [
  {
    id: '1',
    company: 'Google',
    position: 'Senior Software Engineer',
    status: 'interviewing',
    appliedDate: '2024-03-01T00:00:00Z',
    deadline: '2024-03-31T00:00:00Z',
    salary: '$150,000 - $200,000',
    location: 'Mountain View, CA',
    jobUrl: 'https://careers.google.com/jobs/results/123',
    description: 'Full-stack development with React and Node.js',
    notes: 'First interview went well, waiting for next round',
    followUpDate: '2024-03-20T00:00:00Z',
    interviewDate: '2024-03-25T00:00:00Z',
    contactPerson: 'Sarah Johnson',
    contactEmail: 'sarah.johnson@google.com',
    contactPhone: '+1-555-0123',
    resumeVersion: 'v2.1',
    coverLetterVersion: 'v1.0',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: '2',
    company: 'Microsoft',
    position: 'Frontend Developer',
    status: 'applied',
    appliedDate: '2024-03-10T00:00:00Z',
    deadline: '2024-04-15T00:00:00Z',
    salary: '$120,000 - $160,000',
    location: 'Seattle, WA',
    jobUrl: 'https://careers.microsoft.com/jobs/456',
    description: 'React and TypeScript development',
    notes: 'Applied through LinkedIn, waiting for response',
    followUpDate: '2024-03-25T00:00:00Z',
    interviewDate: '',
    contactPerson: 'Mike Chen',
    contactEmail: 'mike.chen@microsoft.com',
    contactPhone: '+1-555-0456',
    resumeVersion: 'v2.0',
    coverLetterVersion: 'v1.2',
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: '3',
    company: 'Apple',
    position: 'iOS Developer',
    status: 'rejected',
    appliedDate: '2024-02-15T00:00:00Z',
    deadline: '2024-03-01T00:00:00Z',
    salary: '$130,000 - $180,000',
    location: 'Cupertino, CA',
    jobUrl: 'https://jobs.apple.com/en-us/details/789',
    description: 'Swift and iOS development',
    notes: 'Rejected after technical interview',
    followUpDate: '',
    interviewDate: '2024-02-28T00:00:00Z',
    contactPerson: 'Lisa Wang',
    contactEmail: 'lisa.wang@apple.com',
    contactPhone: '+1-555-0789',
    resumeVersion: 'v1.9',
    coverLetterVersion: 'v1.1',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
  },
  {
    id: '4',
    company: 'Netflix',
    position: 'Full Stack Engineer',
    status: 'offer',
    appliedDate: '2024-02-01T00:00:00Z',
    deadline: '2024-02-28T00:00:00Z',
    salary: '$180,000 - $250,000',
    location: 'Los Gatos, CA',
    jobUrl: 'https://jobs.netflix.com/jobs/101',
    description: 'Full-stack development with modern technologies',
    notes: 'Received offer! Negotiating salary and benefits',
    followUpDate: '',
    interviewDate: '2024-02-20T00:00:00Z',
    contactPerson: 'David Rodriguez',
    contactEmail: 'david.rodriguez@netflix.com',
    contactPhone: '+1-555-0101',
    resumeVersion: 'v2.2',
    coverLetterVersion: 'v1.3',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: '5',
    company: 'Amazon',
    position: 'Backend Engineer',
    status: 'pending',
    appliedDate: '2024-03-12T00:00:00Z',
    deadline: '2024-04-30T00:00:00Z',
    salary: '$140,000 - $190,000',
    location: 'Seattle, WA',
    jobUrl: 'https://amazon.jobs/en/jobs/202',
    description: 'AWS and serverless development',
    notes: 'Application under review',
    followUpDate: '2024-03-30T00:00:00Z',
    interviewDate: '',
    contactPerson: 'Alex Thompson',
    contactEmail: 'alex.thompson@amazon.com',
    contactPhone: '+1-555-0202',
    resumeVersion: 'v2.1',
    coverLetterVersion: 'v1.0',
    createdAt: '2024-03-12T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z',
  },
];

class MockJobService {
  private jobs: JobApplication[] = [...mockJobs];

  // Simulate API delay
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Create new job application
  async createJob(jobData: CreateJobRequest): Promise<JobApplication> {
    await this.delay();
    
    const newJob: JobApplication = {
      id: Date.now().toString(),
      ...jobData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.jobs.unshift(newJob);
    return newJob;
  }

  // Get all job applications
  async getJobs(filters?: JobFilters): Promise<JobApplication[]> {
    await this.delay();
    
    let filteredJobs = [...this.jobs];
    
    if (filters) {
      if (filters.status) {
        filteredJobs = filteredJobs.filter(job => job.status === filters.status);
      }
      if (filters.company) {
        filteredJobs = filteredJobs.filter(job => 
          job.company.toLowerCase().includes(filters.company!.toLowerCase())
        );
      }
      if (filters.position) {
        filteredJobs = filteredJobs.filter(job => 
          job.position.toLowerCase().includes(filters.position!.toLowerCase())
        );
      }
      if (filters.dateFrom) {
        filteredJobs = filteredJobs.filter(job => 
          new Date(job.appliedDate) >= new Date(filters.dateFrom!)
        );
      }
      if (filters.dateTo) {
        filteredJobs = filteredJobs.filter(job => 
          new Date(job.appliedDate) <= new Date(filters.dateTo!)
        );
      }
    }
    
    return filteredJobs.sort((a, b) => 
      new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
    );
  }

  // Get specific job application
  async getJob(id: string): Promise<JobApplication> {
    await this.delay();
    
    const job = this.jobs.find(j => j.id === id);
    if (!job) {
      throw new Error('Job application not found');
    }
    
    return job;
  }

  // Update job application
  async updateJob(id: string, jobData: UpdateJobRequest): Promise<JobApplication> {
    await this.delay();
    
    const index = this.jobs.findIndex(j => j.id === id);
    if (index === -1) {
      throw new Error('Job application not found');
    }
    
    this.jobs[index] = {
      ...this.jobs[index],
      ...jobData,
      updatedAt: new Date().toISOString(),
    };
    
    return this.jobs[index];
  }

  // Delete job application
  async deleteJob(id: string): Promise<void> {
    await this.delay();
    
    const index = this.jobs.findIndex(j => j.id === id);
    if (index === -1) {
      throw new Error('Job application not found');
    }
    
    this.jobs.splice(index, 1);
  }

  // Get application statistics
  async getStats(): Promise<JobStats> {
    await this.delay();
    
    const total = this.jobs.length;
    const applied = this.jobs.filter(j => j.status === 'applied').length;
    const interviewing = this.jobs.filter(j => j.status === 'interviewing').length;
    const offer = this.jobs.filter(j => j.status === 'offer').length;
    const rejected = this.jobs.filter(j => j.status === 'rejected').length;
    const withdrawn = this.jobs.filter(j => j.status === 'withdrawn').length;
    const pending = this.jobs.filter(j => j.status === 'pending').length;
    const followUp = this.jobs.filter(j => j.status === 'follow-up').length;
    
    const responseRate = total > 0 ? ((applied - pending) / applied) * 100 : 0;
    const interviewRate = total > 0 ? (interviewing / total) * 100 : 0;
    const offerRate = total > 0 ? (offer / total) * 100 : 0;
    
    return {
      total,
      applied,
      interviewing,
      offer,
      rejected,
      withdrawn,
      pending,
      followUp,
      responseRate,
      interviewRate,
      offerRate,
    };
  }

  // Filter by status
  async getJobsByStatus(status: string): Promise<JobApplication[]> {
    await this.delay();
    
    return this.jobs.filter(job => job.status === status);
  }

  // Get upcoming follow-ups
  async getFollowUps(): Promise<JobFollowUp[]> {
    await this.delay();
    
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return this.jobs
      .filter(job => job.followUpDate && new Date(job.followUpDate) <= sevenDaysFromNow)
      .map(job => {
        const followUpDate = new Date(job.followUpDate!);
        const daysUntil = Math.ceil((followUpDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          id: job.id,
          company: job.company,
          position: job.position,
          followUpDate: job.followUpDate!,
          daysUntil,
        };
      })
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }

  // Get upcoming deadlines
  async getDeadlines(): Promise<JobDeadline[]> {
    await this.delay();
    
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return this.jobs
      .filter(job => job.deadline && new Date(job.deadline) <= thirtyDaysFromNow)
      .map(job => {
        const deadline = new Date(job.deadline!);
        const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          id: job.id,
          company: job.company,
          position: job.position,
          deadline: job.deadline!,
          daysUntil,
        };
      })
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }
}

export const mockJobService = new MockJobService(); 