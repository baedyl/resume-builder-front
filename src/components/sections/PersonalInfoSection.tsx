import React from 'react';
import { useFormContext } from 'react-hook-form';

const PersonalInfoSection: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<any>();
  return (
    <>
      {/* Personal Information */}
      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Full Name</label>
        <input
          {...register('fullName')}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Full Name"
        />
        {errors.fullName?.message && <p className="mt-1 text-sm text-red-600">{String(errors.fullName.message)}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Email</label>
        <input
          {...register('email')}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Email"
        />
        {errors.email?.message && <p className="mt-1 text-sm text-red-600">{String(errors.email.message)}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Phone (Optional)</label>
        <input
          {...register('phone')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="Phone"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Address (Optional)</label>
        <input
          {...register('address')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="Address"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">LinkedIn (Optional)</label>
        <input
          {...register('linkedIn')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="LinkedIn URL"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Website (Optional)</label>
        <input
          {...register('website')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="Website URL"
        />
      </div>
    </>
  );
};

export default PersonalInfoSection; 