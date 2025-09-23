import axios from 'axios';
import { JobApplication, JobStats, JobFilters, CreateJobRequest, UpdateJobRequest, JobFollowUp, JobDeadline } from '../types/job';
import { Auth0ContextInterface, User } from '@auth0/auth0-react';

import { getApiUrl, getApiAudience } from '../utils/api';

// Helper to get the API URL
const API_URL = getApiUrl();
const API_AUDIENCE = getApiAudience();

// The consumer must provide getAccessTokenSilently (from useAuth0)
export const createJobService = (getAccessTokenSilently: Auth0ContextInterface<User>['getAccessTokenSilently']) => {
  return {
    async createJob(jobData: CreateJobRequest): Promise<JobApplication> {
      const token = await getAccessTokenSilently({ audience: API_AUDIENCE } as any);
      const response = await axios.post(`${API_URL}/api/jobs`, jobData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    async getJobs(filters?: JobFilters): Promise<JobApplication[]> {
      const token = await getAccessTokenSilently({ audience: API_AUDIENCE } as any);
      const params = filters ? { ...filters } : undefined;
      const response = await axios.get(`${API_URL}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      return response.data;
    },
    async getJob(id: string): Promise<JobApplication> {
      const token = await getAccessTokenSilently({ audience: API_AUDIENCE } as any);
      const response = await axios.get(`${API_URL}/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    async updateJob(id: string, jobData: UpdateJobRequest): Promise<JobApplication> {
      const token = await getAccessTokenSilently({ audience: API_AUDIENCE } as any);
      const response = await axios.put(`${API_URL}/api/jobs/${id}`, jobData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    async deleteJob(id: string): Promise<void> {
      const token = await getAccessTokenSilently({ audience: API_AUDIENCE } as any);
      await axios.delete(`${API_URL}/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    async getStats(): Promise<JobStats> {
      const token = await getAccessTokenSilently({ audience: API_AUDIENCE } as any);
      const response = await axios.get(`${API_URL}/api/jobs/stats/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    async getJobsByStatus(status: string): Promise<JobApplication[]> {
      const token = await getAccessTokenSilently({ audience: API_AUDIENCE } as any);
      const response = await axios.get(`${API_URL}/api/jobs/status/${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    async getFollowUps(userId?: string): Promise<JobFollowUp[]> {
      const token = await getAccessTokenSilently({ audience: API_AUDIENCE } as any);
      const response = await axios.get(`${API_URL}/api/jobs/follow-ups`, {
        headers: { Authorization: `Bearer ${token}` },
        params: userId ? { userId } : undefined,
      });
      return response.data;
    },
    async getDeadlines(userId?: string): Promise<JobDeadline[]> {
      const token = await getAccessTokenSilently({ audience: API_AUDIENCE } as any);
      const response = await axios.get(`${API_URL}/api/jobs/deadlines`, {
        headers: { Authorization: `Bearer ${token}` },
        params: userId ? { userId } : undefined,
      });
      return response.data;
    },
  };
}; 