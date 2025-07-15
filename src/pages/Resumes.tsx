import React, { useState } from 'react';
import ResumeList from '../components/ResumeList';
import { ResumeFormData } from '../types/resume';
import { useNavigate } from 'react-router-dom';

const Resumes: React.FC = () => {
  const [selectedResume, setSelectedResume] = useState<ResumeFormData | null>(null);
  const navigate = useNavigate();

  const handleCreate = () => {
    // Navigate to the resume builder page for creating a new resume
    navigate('/resume-builder');
  };

  // Optionally, handle edit if you want to support inline editing here
  // const handleEdit = (resume: ResumeFormData) => {
  //   setSelectedResume(resume);
  //   // Or navigate to builder with resume data
  // };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Resumes</h1>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Resume
          </button>
        </div>
        <ResumeList onSelectResume={setSelectedResume} />
      </div>
    </div>
  );
};

export default Resumes; 