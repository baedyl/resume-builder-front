
import { Link, useLocation } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Define readable names for routes
  const routeNames: Record<string, string> = {
    'my-resumes': 'My Resumes',
    'cover-letters': 'Cover Letters',
    'job-tracker': 'Job Tracker',
    'blog': 'Blog',
    'contact': 'Contact',
    'about': 'About',
    'settings': 'Settings',
    'subscription': 'Subscription',
    'terms': 'Terms of Service',
    'privacy': 'Privacy Policy',
    'resume': 'Resume Builder',
    'resumes': 'Resumes',
    'login': 'Login',
    'register': 'Register',
    'apply': 'Apply for Job'
  };

  // Don't show breadcrumbs on homepage, login, or register
  if (pathnames.length === 0 || pathnames.includes('login') || pathnames.includes('register')) {
    return null;
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    ...pathnames
      .filter(pathname => !(/^\d+$/.test(pathname))) // Filter out numeric IDs
      .map((pathname, index) => {
        // Calculate the correct path including skipped segments
        const originalIndex = pathnames.indexOf(pathname);
        const path = `/${pathnames.slice(0, originalIndex + 1).join('/')}`;
        const label = routeNames[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
        return { label, path };
      })
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path} className="flex items-center">
              {index === 0 && (
                <FaHome className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 dark:text-white font-medium">
                  {breadcrumb.label}
                </span>
              ) : (
                <>
                  <Link
                    to={breadcrumb.path}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {breadcrumb.label}
                  </Link>
                  <FaChevronRight className="w-3 h-3 mx-2 text-gray-400" />
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs; 