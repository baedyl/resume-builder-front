export interface Skill {
  id: number;
  name: string;
}

export interface WorkExperience {
  company: string;
  jobTitle: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface Education {
  institution: string;
  degree: string;
  major?: string;
  graduationYear?: number;
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
} 