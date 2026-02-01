import axios from 'axios';
import { Auth0ContextInterface, User } from '@auth0/auth0-react';
import {
  JobOpportunity,
  JobSearchFilters,
  JobSearchResponse,
  JobApplicationRequest,
  JobApplicationResponse,
  JobSourceStats
} from '../types/job';
import { getApiUrl, getApiAudience } from '../utils/api';

// Helper to get the API URL
const API_URL = getApiUrl();
const API_AUDIENCE = getApiAudience();

// The consumer must provide getAccessTokenSilently (from useAuth0) for authenticated endpoints
export const createJobOpportunitiesService = (getAccessTokenSilently?: Auth0ContextInterface<User>['getAccessTokenSilently']) => {
  return {
    // Public endpoints
    async searchJobs(filters?: JobSearchFilters, page = 1, limit = 20): Promise<JobSearchResponse> {
      const params: any = {
        page,
        limit,
        ...filters,
      };

      if (filters?.skills && Array.isArray(filters.skills)) {
        params.skills = filters.skills.join(',');
      }

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null) {
          delete params[key];
        }
      });

      const response = await axios.get(`${API_URL}/api/job-opportunities`, { params });
      return response.data;
    },

    async getJob(id: string): Promise<JobOpportunity> {
      const response = await axios.get(`${API_URL}/api/job-opportunities/${id}`);
      return response.data;
    },

    async getSourceStats(): Promise<JobSourceStats[]> {
      const response = await axios.get(`${API_URL}/api/job-opportunities/sources/stats`);
      return response.data;
    },

    // Authenticated endpoints
    async getJobMatches(page = 1, limit = 10): Promise<JobSearchResponse> {
      const token = await getAccessTokenSilently({ audience: API_AUDIENCE } as any);
      const params = { page, limit };

      const response = await axios.get(`${API_URL}/api/job-opportunities/matches`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      return response.data;
    },

    async applyToJob(applicationData: JobApplicationRequest): Promise<JobApplicationResponse> {
      const token = await getAccessTokenSilently({ audience: API_AUDIENCE } as any);
      const response = await axios.post(`${API_URL}/api/job-opportunities/${applicationData.jobId}/apply`, applicationData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },

    async getMyApplications(page = 1, limit = 20): Promise<JobApplicationResponse[]> {
      const token = await getAccessTokenSilently({ audience: API_AUDIENCE } as any);
      const params = { page, limit };

      const response = await axios.get(`${API_URL}/api/job-opportunities/applications/my`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      return response.data;
    },

    async updateApplication(id: string, status: string): Promise<JobApplicationResponse> {
      const token = await getAccessTokenSilently({ audience: API_AUDIENCE } as any);
      const response = await axios.put(`${API_URL}/api/job-opportunities/applications/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  };
};