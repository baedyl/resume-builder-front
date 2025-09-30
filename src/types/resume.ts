export interface Skill {
  id: number;
  name: string;
}

export interface WorkExperience {
  jobTitle: string;
  company: string;
  location?: string | null;
  startDate: string;
  endDate?: string;
  description?: string;
  isCurrent?: boolean;
  // New optional fields aligned with API
  companyDescription?: string;
  // Accept either array (API shape) or string (form raw input); form will convert to array on submit
  techStack?: string[] | string;
}

export interface Education {
  degree: string;
  major?: string | null;
  institution: string;
  graduationYear?: number | null;
  startYear?: number | null;
  gpa?: number | null;
  description?: string | null;
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate?: string;
}

export interface ResumeFormData {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  linkedIn?: string;
  website?: string;
  summary?: string;
  skills: Skill[];
  workExperience: WorkExperience[];
  education: Education[];
  languages: Language[];
  certifications: Certification[];
  template?: string;
  language?: string; // Language code for resume generation (e.g., 'en', 'fr', 'es')
} 