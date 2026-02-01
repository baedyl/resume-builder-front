import {
  JobOpportunity,
  JobSearchFilters,
  JobSearchResponse,
  JobApplicationRequest,
  JobApplicationResponse,
  JobSourceStats
} from '../types/job';

// Mock data for job opportunities
const mockJobOpportunities: JobOpportunity[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    description: 'We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for building responsive web applications using React, TypeScript, and modern frontend technologies.',
    requirements: '5+ years of experience with React, TypeScript, and CSS. Experience with state management (Redux/Zustand), testing frameworks, and CI/CD pipelines.',
    salary: {
      min: 120000,
      max: 160000,
      currency: 'USD'
    },
    jobType: 'full-time',
    experienceLevel: 'senior',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Redux', 'Jest'],
    postedDate: '2024-01-15T00:00:00Z',
    applicationDeadline: '2024-02-15T00:00:00Z',
    source: 'LinkedIn',
    isActive: true,
    matchScore: 95,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    description: 'Join our fast-growing startup as a Full Stack Engineer. You\'ll work on both frontend and backend systems, contributing to our mission of revolutionizing the industry.',
    requirements: '3+ years of full-stack development experience. Proficiency in Node.js, React, PostgreSQL, and cloud platforms (AWS/GCP).',
    salary: {
      min: 90000,
      max: 130000,
      currency: 'USD'
    },
    jobType: 'full-time',
    experienceLevel: 'mid',
    skills: ['Node.js', 'React', 'PostgreSQL', 'AWS', 'Docker', 'TypeScript'],
    postedDate: '2024-01-20T00:00:00Z',
    applicationDeadline: '2024-02-20T00:00:00Z',
    source: 'Indeed',
    isActive: true,
    matchScore: 88,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '3',
    title: 'Junior Software Developer',
    company: 'InnovateLabs',
    location: 'Austin, TX',
    description: 'Great opportunity for a Junior Software Developer to grow their career in a supportive environment. You\'ll work on exciting projects and receive mentorship from senior developers.',
    requirements: '1-2 years of software development experience. Knowledge of JavaScript, Python, or Java. Computer Science degree preferred.',
    salary: {
      min: 60000,
      max: 80000,
      currency: 'USD'
    },
    jobType: 'full-time',
    experienceLevel: 'entry',
    skills: ['JavaScript', 'Python', 'Git', 'SQL', 'HTML', 'CSS'],
    postedDate: '2024-01-25T00:00:00Z',
    applicationDeadline: '2024-02-25T00:00:00Z',
    source: 'Glassdoor',
    isActive: true,
    matchScore: 75,
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Seattle, WA',
    description: 'We\'re seeking a DevOps Engineer to help scale our infrastructure and improve our deployment processes. Experience with Kubernetes and cloud platforms is essential.',
    requirements: '4+ years of DevOps/Infrastructure experience. Strong knowledge of Kubernetes, Docker, AWS/GCP, and CI/CD pipelines.',
    salary: {
      min: 110000,
      max: 150000,
      currency: 'USD'
    },
    jobType: 'full-time',
    experienceLevel: 'senior',
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Jenkins', 'Python'],
    postedDate: '2024-01-18T00:00:00Z',
    applicationDeadline: '2024-02-18T00:00:00Z',
    source: 'LinkedIn',
    isActive: true,
    matchScore: 82,
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
  },
  {
    id: '5',
    title: 'UI/UX Designer',
    company: 'DesignStudio Pro',
    location: 'New York, NY',
    description: 'Creative UI/UX Designer needed to design beautiful and functional user interfaces. You\'ll work closely with our development team to bring designs to life.',
    requirements: '3+ years of UI/UX design experience. Proficiency in Figma, Sketch, or Adobe XD. Strong portfolio demonstrating design skills.',
    salary: {
      min: 80000,
      max: 110000,
      currency: 'USD'
    },
    jobType: 'full-time',
    experienceLevel: 'mid',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
    postedDate: '2024-01-22T00:00:00Z',
    applicationDeadline: '2024-02-22T00:00:00Z',
    source: 'Indeed',
    isActive: true,
    matchScore: 70,
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
  },
];

const mockApplications: JobApplicationResponse[] = [
  {
    id: 'app1',
    jobId: '1',
    userId: 'user123',
    status: 'applied',
    appliedAt: '2024-01-16T00:00:00Z',
    resumeId: 'resume1',
    coverLetterId: 'cl1',
    notes: 'Excited about this opportunity!',
    updatedAt: '2024-01-16T00:00:00Z',
  },
];

class MockJobOpportunitiesService {
  private jobs: JobOpportunity[] = [...mockJobOpportunities];
  private applications: JobApplicationResponse[] = [...mockApplications];

  // Simulate API delay
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Search jobs with filters
  async searchJobs(filters?: JobSearchFilters, page = 1, limit = 20): Promise<JobSearchResponse> {
    await this.delay();

    let filteredJobs = [...this.jobs];

    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredJobs = filteredJobs.filter(job =>
          job.title.toLowerCase().includes(search) ||
          job.company.toLowerCase().includes(search) ||
          job.description.toLowerCase().includes(search)
        );
      }

      if (filters.location) {
        const location = filters.location.toLowerCase();
        filteredJobs = filteredJobs.filter(job =>
          job.location.toLowerCase().includes(location)
        );
      }

      if (filters.jobType) {
        filteredJobs = filteredJobs.filter(job =>
          job.jobType === filters.jobType
        );
      }

      if (filters.experienceLevel) {
        filteredJobs = filteredJobs.filter(job =>
          job.experienceLevel === filters.experienceLevel
        );
      }

      if (filters.skills && filters.skills.length > 0) {
        filteredJobs = filteredJobs.filter(job =>
          filters.skills!.some(skill => job.skills.includes(skill))
        );
      }

      if (filters.salaryMin) {
        filteredJobs = filteredJobs.filter(job =>
          job.salary?.max && job.salary.max >= filters.salaryMin!
        );
      }

      if (filters.salaryMax) {
        filteredJobs = filteredJobs.filter(job =>
          job.salary?.min && job.salary.min <= filters.salaryMax!
        );
      }

      if (filters.company) {
        const company = filters.company.toLowerCase();
        filteredJobs = filteredJobs.filter(job =>
          job.company.toLowerCase().includes(company)
        );
      }

      if (filters.source && filters.source.length > 0) {
        filteredJobs = filteredJobs.filter(job =>
          filters.source!.includes(job.source)
        );
      }
    }

    // Sort by posted date (newest first)
    filteredJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    return {
      jobs: paginatedJobs,
      pagination: {
        total: filteredJobs.length,
        page,
        limit,
        hasMore: endIndex < filteredJobs.length,
      },
    };
  }

  // Get specific job
  async getJob(id: string): Promise<JobOpportunity> {
    await this.delay();

    const job = this.jobs.find(j => j.id === id);
    if (!job) {
      throw new Error('Job not found');
    }

    return job;
  }

  // Get source stats
  async getSourceStats(): Promise<JobSourceStats[]> {
    await this.delay();

    const sources = ['LinkedIn', 'Indeed', 'Glassdoor', 'Company Website'];
    return sources.map(source => ({
      source,
      totalJobs: this.jobs.filter(job => job.source === source).length,
      activeJobs: this.jobs.filter(job => job.source === source && job.isActive).length,
      lastSync: new Date().toISOString(),
    }));
  }

  // Get job matches (simulated personalized matches)
  async getJobMatches(page = 1, limit = 10): Promise<JobSearchResponse> {
    await this.delay();

    // Simulate personalized matches by sorting by matchScore
    const matchedJobs = [...this.jobs]
      .filter(job => job.matchScore && job.matchScore > 70)
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = matchedJobs.slice(startIndex, endIndex);

    return {
      jobs: paginatedJobs,
      pagination: {
        total: matchedJobs.length,
        page,
        limit,
        hasMore: endIndex < matchedJobs.length,
      },
    };
  }

  // Apply to job
  async applyToJob(applicationData: JobApplicationRequest): Promise<JobApplicationResponse> {
    await this.delay();

    const newApplication: JobApplicationResponse = {
      id: `app${Date.now()}`,
      jobId: applicationData.jobId,
      userId: 'user123', // Mock user ID
      status: 'applied',
      appliedAt: new Date().toISOString(),
      resumeId: applicationData.resumeId?.toString(),
      notes: applicationData.notes,
      updatedAt: new Date().toISOString(),
    };

    this.applications.push(newApplication);
    return newApplication;
  }

  // Get user's applications
  async getMyApplications(page = 1, limit = 20): Promise<JobApplicationResponse[]> {
    await this.delay();

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return this.applications.slice(startIndex, endIndex);
  }

  // Update application status
  async updateApplication(id: string, status: string): Promise<JobApplicationResponse> {
    await this.delay();

    const application = this.applications.find(app => app.id === id);
    if (!application) {
      throw new Error('Application not found');
    }

    application.status = status as any;
    application.updatedAt = new Date().toISOString();

    return application;
  }
}

export const mockJobOpportunitiesService = new MockJobOpportunitiesService();