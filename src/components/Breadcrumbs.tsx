
import { Link, useLocation } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import { useAuth0 } from '@auth0/auth0-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const auth0 = useAuth0();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs if Auth0 is still loading
  if (auth0?.isLoading) {
    return null;
  }

  // Define readable names for routes
  const routeNames: Record<string, string> = {
    'dashboard': 'Dashboard',
    'my-resumes': 'My Resumes',
    'cover-letters': 'Cover Letters',
    'job-tracker': 'Job Tracker',
    'blog': 'Blog',
    'contact': 'Contact',
    'about': 'About',
    'settings': 'Settings',
    'subscription': 'Subscription',
    'pricing': 'Pricing',
    'terms': 'Terms of Service',
    'privacy': 'Privacy Policy',
    'resume': 'Resume Builder',
    'resumes': 'Resumes',
    'login': 'Login',
    'register': 'Register',
    'apply': 'Apply for Job'
  };

  // Don't show breadcrumbs on login, register, or callback pages
  if (pathnames.includes('login') || pathnames.includes('register') || pathnames.includes('callback')) {
    return null;
  }

  // For authenticated users, "Home" concept maps to Dashboard
  // For unauthenticated users, Home should go to / (static home page)
  const isAuthenticated = auth0?.isAuthenticated || false;
  const homePath = isAuthenticated ? '/dashboard' : '/';

  // For authenticated users, show breadcrumbs even on homepage
  // For unauthenticated users, only show breadcrumbs on non-homepage routes
  if (pathnames.length === 0 && !isAuthenticated) {
    return null;
  }

  const homeLabel = isAuthenticated ? 'Dashboard' : 'Home';
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Only add home/dashboard breadcrumb if not already on that page
  if (pathnames.length === 0 || (isAuthenticated && pathnames[0] !== 'dashboard')) {
    breadcrumbs.push({ label: homeLabel, path: homePath });
  }

  let cumulativePath = '';
  pathnames.forEach((segment, index) => {
    cumulativePath += `/${segment}`;

    // If the path is /my-resumes/:id or /cover-letters/:id, show 'Edit' instead of the encrypted id
    if (
      index === 1 &&
      (pathnames[0] === 'my-resumes' || pathnames[0] === 'cover-letters')
    ) {
      breadcrumbs.push({ label: 'Edit', path: cumulativePath });
      return;
    }

    const label = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({ label, path: cumulativePath });
  });

  return (
    <nav className="bg-white dark:bg-gray-800">
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