import { useState } from 'react';
import ResumeList from '../components/ResumeList';
import { ResumeFormData } from '../types/resume';
import { useNavigate } from 'react-router-dom';

const Resumes: React.FC = () => {
  const [selectedResume, setSelectedResume] = useState<ResumeFormData | null>(null);
  const navigate = useNavigate();

  const handleCreate = () => {
    // Navigate to the main resume builder page for creating a new resume
    navigate('/my-resumes');
  };

  // Handle edit by navigating to the main resume builder
  const handleEdit = (resume: ResumeFormData) => {
    // Navigate to the main resume builder with the selected resume
    navigate('/my-resumes', { state: { selectedResume: resume } });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">My Resumes</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and manage all your resume documents
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Resume
          </button>
        </div>
        <ResumeList onSelectResume={handleEdit} />
      </div>
    </div>
  );
};

export default Resumes; 