
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { FaLinkedin } from 'react-icons/fa';

const PersonalInfoSection: React.FC = () => {
  const { register, formState: { errors }, setValue } = useFormContext<any>();

  const handleLinkedInImport = () => {
    // REPLACE '78m09zdenkx22d' with your actual LinkedIn Client ID from the Developer Portal
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID || '78m09zdenkx22d';
    const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
    console.log('LinkedIn Redirect URI:', redirectUri);
    // Using OpenID Connect scopes which are standard for new LinkedIn apps
    // If your app is older and uses r_liteprofile, change this back.
    const scope = 'openid%20profile%20email';
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('linkedin_oauth_state', state);
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
    
    window.location.href = authUrl;
  };

  useEffect(() => {
    const importedData = localStorage.getItem('linkedin_import_data');
    console.log('Checking for LinkedIn data:', importedData);

    if (importedData) {
      try {
        const data = JSON.parse(importedData);
        console.log('Parsed LinkedIn data:', data);

        // Handle different possible structures (OpenID vs r_liteprofile vs normalized)
        const firstName = data.firstName || data.localizedFirstName || data.given_name || '';
        const lastName = data.lastName || data.localizedLastName || data.family_name || '';
        const email = data.email || data.emailAddress || '';

        if (firstName || lastName) {
            const fullName = `${firstName} ${lastName}`.trim();
            console.log('Setting fullName:', fullName);
            setValue('fullName', fullName, { shouldValidate: true, shouldDirty: true });
        }
        if (email) {
            console.log('Setting email:', email);
            setValue('email', email, { shouldValidate: true, shouldDirty: true });
        }
        localStorage.removeItem('linkedin_import_data');
      } catch (e) {
        console.error('Error parsing imported data', e);
      }
    }
  }, [setValue]);

  return (
    <>
      <div className="mb-6">
        <button
          type="button"
          onClick={handleLinkedInImport}
          className="flex items-center justify-center w-full px-4 py-2 bg-[#0077b5] text-white rounded-lg hover:bg-[#006396] transition-colors font-medium"
        >
          <FaLinkedin className="mr-2 text-xl" />
          Import from LinkedIn
        </button>
      </div>
      {/* Personal Information */}
      <div className="space-y-2">
        <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Full Name</label>
        <input
          {...register('fullName')}
          className={`w-full p-3 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${errors.fullName ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
          placeholder="Full Name"
        />
        {errors.fullName?.message && <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors">{String(errors.fullName.message)}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Email</label>
        <input
          {...register('email')}
          className={`w-full p-3 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${errors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
          placeholder="Email"
        />
        {errors.email?.message && <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors">{String(errors.email.message)}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Phone (Optional)</label>
        <input
          {...register('phone')}
          className="w-full p-3 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          placeholder="Phone"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Address (Optional)</label>
        <input
          {...register('address')}
          className="w-full p-3 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          placeholder="Address"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">LinkedIn (Optional)</label>
        <input
          {...register('linkedIn')}
          className="w-full p-3 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          placeholder="LinkedIn URL"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-colors">Website (Optional)</label>
        <input
          {...register('website')}
          className="w-full p-3 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          placeholder="Website URL"
        />
      </div>
    </>
  );
};

export default PersonalInfoSection; 