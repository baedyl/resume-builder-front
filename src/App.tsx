import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import ResumeForm from './components/ResumeForm';
import ResumeApplicationForm from './components/ResumeApplicationForm';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NavBar from './components/NavBar';
import Breadcrumbs from './components/Breadcrumbs';
import Callback from './components/Callback';
import ResumeBuilder from './pages/ResumeBuilder';
import Resumes from './pages/Resumes';
import CoverLetters from './pages/CoverLetters';
import JobTracker from './pages/JobTracker';
import Blog from './pages/Blog';
import Article from './pages/Article';
import Subscription from './pages/Subscription';
import LoadingOverlay from './components/LoadingOverlay';

// Placeholder components for missing pages
const Contact = () => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Contact Us</h1>
      <p className="text-gray-600 dark:text-gray-300">Contact page coming soon...</p>
    </div>
  </div>
);

const About = () => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About Us</h1>
      <p className="text-gray-600 dark:text-gray-300">About page coming soon...</p>
    </div>
  </div>
);

const Settings = () => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      <p className="text-gray-600 dark:text-gray-300">Settings page coming soon...</p>
    </div>
  </div>
);

const Terms = () => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>
      <p className="text-gray-600 dark:text-gray-300">Terms of service page coming soon...</p>
    </div>
  </div>
);

const Privacy = () => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
      <p className="text-gray-600 dark:text-gray-300">Privacy policy page coming soon...</p>
    </div>
  </div>
);

const ForgotPassword = () => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Forgot Password</h1>
      <p className="text-gray-600 dark:text-gray-300">Password reset functionality coming soon...</p>
    </div>
  </div>
);

const Cookies = () => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Cookie Policy</h1>
      <p className="text-gray-600 dark:text-gray-300">Cookie policy page coming soon...</p>
    </div>
  </div>
);

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  // Show a loading state while Auth0 checks authentication
  if (isLoading) {
    return <div aria-live="polite" aria-busy={true}>
      <LoadingOverlay />
    </div>
  }

  

  return (
    <Router>
      <SubscriptionProvider>
        <NavBar />
        <Breadcrumbs />
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/my-resumes" /> : <Home />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/resume"
            element={isAuthenticated ? <ResumeForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/resume/:id/apply"
            element={isAuthenticated ? <ResumeApplicationForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-resumes"
            element={isAuthenticated ? <ResumeBuilder /> : <Navigate to="/login" />}
          />
          <Route
            path="/resumes"
            element={isAuthenticated ? <Resumes /> : <Navigate to="/login" />}
          />
          <Route
            path="/cover-letters"
            element={isAuthenticated ? <CoverLetters /> : <Navigate to="/login" />}
          />
          <Route
            path="/job-tracker"
            element={isAuthenticated ? <JobTracker /> : <Navigate to="/login" />}
          />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Article />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/settings"
            element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
          />
          <Route
            path="/subscription"
            element={isAuthenticated ? <Subscription /> : <Navigate to="/login" />}
          />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SubscriptionProvider>
    </Router>
  );
}

export default App;