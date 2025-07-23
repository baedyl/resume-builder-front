import { useState, useEffect } from 'react';
import { JobApplication, CreateJobRequest, UpdateJobRequest, JobStatus } from '../types/job';

interface JobFormProps {
  job?: JobApplication;
  onSubmit: (data: CreateJobRequest | UpdateJobRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const JOB_STATUSES: { value: JobStatus; label: string; color: string }[] = [
  { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-800' },
  { value: 'follow-up', label: 'Follow Up', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'interviewing', label: 'Interviewing', color: 'bg-orange-100 text-orange-800' },
  { value: 'offer', label: 'Offer', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'bg-gray-100 text-gray-800' },
  { value: 'pending', label: 'Pending', color: 'bg-purple-100 text-purple-800' },
  // Removed unsupported statuses: phone-screen, technical-interview, final_interview
];

export const JobForm: React.FC<JobFormProps> = ({ job, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    location: '',
    maxSalary: '',
    status: 'applied' as JobStatus,
    dateApplied: '',
    followUp: '',
    comment: '',
    jobUrl: '',
    description: '',
    notes: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
  });

  useEffect(() => {
    if (job) {
      setFormData({
        position: job.position || '',
        company: job.company || '',
        location: job.location || '',
        maxSalary: job.salary ? String(job.salary) : '', // Map salary to maxSalary
        status: job.status || 'applied',
        dateApplied: job.dateApplied || '',
        followUp: job.followUpDate || '',
        comment: (job as any).comment || job.notes || '', // Use job.comment if present, else job.notes
        jobUrl: job.jobUrl || '',
        description: job.description || '',
        notes: job.notes || '',
        contactPerson: job.contactPerson || '',
        contactEmail: job.contactEmail || '',
        contactPhone: job.contactPhone || '',
      });
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const toISO = (date: string) => date ? new Date(date).toISOString() : undefined;
  const isValidEmail = (email: string) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidUrl = (url: string) => !url || /^(https?:\/\/)[^\s/$.?#].[^\s]*$/.test(url);
  const isValidDate = (date: string) => !date || !isNaN(Date.parse(date));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Required fields
    if (!formData.position.trim()) {
      alert('Position is required');
      return;
    }
    if (!formData.company.trim()) {
      alert('Company is required');
      return;
    }
    if (!formData.location.trim()) {
      alert('Location is required');
      return;
    }
    if (formData.contactEmail && !isValidEmail(formData.contactEmail)) {
      alert('Invalid email');
      return;
    }
    if (formData.jobUrl && !isValidUrl(formData.jobUrl)) {
      alert('Invalid URL');
      return;
    }
    if (formData.dateApplied && !isValidDate(formData.dateApplied)) {
      alert('Invalid date applied');
      return;
    }
    if (formData.followUp && !isValidDate(formData.followUp)) {
      alert('Invalid follow up date');
      return;
    }
    const submitData: any = {
      ...formData,
      maxSalary: formData.maxSalary ? Number(formData.maxSalary) : undefined,
      dateApplied: formData.dateApplied ? new Date(formData.dateApplied).toISOString() : undefined,
      followUp: formData.followUp ? new Date(formData.followUp).toISOString() : undefined,
    };
    // Remove empty string or undefined fields
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === '' || submitData[key] === undefined) {
        delete submitData[key];
      }
    });
    onSubmit(submitData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {job ? 'Edit Job Application' : 'Add New Job Application'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter company name"
            />
          </div>

          {/* Position */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Position *
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter job title"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {JOB_STATUSES.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Applied Date */}
          <div>
            <label htmlFor="dateApplied" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Applied Date *
            </label>
            <input
              type="date"
              id="dateApplied"
              name="dateApplied"
              value={formData.dateApplied}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="City, State or Remote"
            />
          </div>

          {/* Salary */}
          <div>
            <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Salary
            </label>
            <input
              type="number"
              id="maxSalary"
              name="maxSalary"
              value={formData.maxSalary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 80000"
            />
          </div>

          {/* Follow Up Date */}
          <div>
            <label htmlFor="followUp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Follow Up Date
            </label>
            <input
              type="date"
              id="followUp"
              name="followUp"
              value={formData.followUp}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter contact email"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Person
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter contact person"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Phone
            </label>
            <input
              type="text"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter contact phone"
            />
          </div>

          {/* Job URL */}
          <div>
            <label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job URL
            </label>
            <input
              type="url"
              id="jobUrl"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter job posting URL"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter job description"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Add any additional notes about this application..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : (job ? 'Update Application' : 'Add Application')}
          </button>
        </div>
      </form>
    </div>
  );
}; 