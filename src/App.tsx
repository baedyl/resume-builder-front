import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { GTMProvider } from './contexts/GTMContext';
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
import ResumeDetail from './pages/ResumeDetail';
import CoverLetterDetail from './pages/CoverLetterDetail';
import JobTracker from './pages/JobTracker';
import Blog from './pages/Blog';
import Article from './pages/Article';
import Subscription from './pages/Subscription';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import AIResumeBuilder from './pages/AIResumeBuilder';
import PreviewEditor from './pages/PreviewEditor';
import LoadingOverlay from './components/LoadingOverlay';
import Footer from './components/Footer';
import SEO from './components/SEO';
import { FaUsers, FaRocket, FaLightbulb, FaHeart, FaCode, FaSearch, FaPalette, FaChartLine } from 'react-icons/fa';

// Placeholder components for missing pages

const About = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    {/* Hero Section */}
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About Resume Builder
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're a passionate team of developers, SEO professionals, and designers building 
            innovative AI-powered solutions to help people land their dream jobs.
          </p>
        </div>
      </div>
    </div>

    {/* Mission Section */}
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              In today's competitive job market, we believe everyone deserves the tools and resources 
              to present their best professional self. Our mission is to democratize access to 
              professional resume creation through cutting-edge AI technology.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              We're committed to helping job seekers overcome the challenges of ATS systems, 
              stand out to recruiters, and ultimately secure their dream positions.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8">
            <div className="flex items-center mb-4">
              <FaRocket className="text-3xl text-blue-600 dark:text-blue-400 mr-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Goal</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              To empower millions of job seekers with AI-powered tools that transform 
              their career prospects and help them achieve their professional dreams.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Team Section */}
    <div className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We're a diverse team of experts passionate about technology and helping people succeed in their careers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FaCode className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Developers</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our engineering team builds robust, scalable solutions using the latest technologies 
              to ensure a seamless user experience.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FaSearch className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">SEO Professionals</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our SEO experts ensure our content reaches job seekers who need it most, 
              optimizing for visibility and accessibility.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FaPalette className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Designers</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our design team creates intuitive, beautiful interfaces that make resume building 
              both enjoyable and effective.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Values Section */}
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Our Values
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            These core principles guide everything we do and every decision we make.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaLightbulb className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Innovation</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              We constantly push boundaries to create cutting-edge solutions that give our users an edge.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaHeart className="text-green-600 dark:text-green-400 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Empathy</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              We understand the challenges job seekers face and design our tools with their needs in mind.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaUsers className="text-purple-600 dark:text-purple-400 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Collaboration</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              We believe the best solutions come from diverse teams working together toward a common goal.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaChartLine className="text-orange-600 dark:text-orange-400 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Excellence</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              We're committed to delivering the highest quality tools and support to our users.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Features Section */}
    <div className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            What Makes Us Different
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our unique combination of expertise and technology sets us apart in the resume building space.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              AI-Powered Intelligence
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our advanced AI algorithms analyze job descriptions and optimize your resume 
              for maximum ATS compatibility and human appeal.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Industry Expertise
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our team's deep understanding of hiring processes and ATS systems ensures 
              your resume gets past automated screening.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              User-Centered Design
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Every feature is designed with the user experience in mind, making resume 
              creation intuitive and enjoyable.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Continuous Innovation
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We constantly update our platform with the latest hiring trends and 
              technological advancements.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Comprehensive Support
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              From resume building to job tracking, we provide end-to-end career 
              development tools and resources.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Proven Results
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our users consistently report higher interview rates and successful 
              job placements using our platform.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* CTA Section */}
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Ready to Build Your Dream Career?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of job seekers who have transformed their careers with our AI-powered resume builder.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/resume"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Building Your Resume
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
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

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Redirecting to Terms of Service...</h1>
        <p className="text-gray-600 dark:text-gray-300">If you are not redirected automatically, please click the link below.</p>
        <a target="_blank"
          href="https://www.termsfeed.com/live/05b57518-3df0-4de2-9982-8bf5e69cce36"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 mt-4 inline-block"
        >
          Click here to view Terms of Service
        </a>
      </div>
    </div>
  );
};

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Redirecting to Privacy Policy...</h1>
        <p className="text-gray-600 dark:text-gray-300">If you are not redirected automatically, please click the link below.</p>
        <a target="_blank"
          href="https://www.termsfeed.com/live/05b57518-3df0-4de2-9982-8bf5e69cce36"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 mt-4 inline-block"
        >
          Click here to view Privacy Policy
        </a>
      </div>
    </div>
  );
};

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
      <GTMProvider>
        <SubscriptionProvider>
          <SEO />
          <div className="min-h-screen flex flex-col">
            <NavBar />
            <Breadcrumbs />
            <main className="flex-1">
              <Routes>
                <Route
                  path="/"
                  element={<Home />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/ai-resume-builder" element={<AIResumeBuilder />} />
                <Route
                  path="/resume"
                  element={isAuthenticated ? <ResumeForm /> : <Navigate to="/login" />}
                />
                <Route
                  path="/my-resumes/:id/apply"
                  element={isAuthenticated ? <ResumeApplicationForm /> : <Navigate to="/login" />}
                />
                <Route
                  path="/my-resumes"
                  element={isAuthenticated ? <ResumeBuilder /> : <Navigate to="/login" />}
                />
                <Route
                  path="/my-resumes/:id"
                  element={isAuthenticated ? <ResumeDetail /> : <Navigate to="/login" />}
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
                  path="/cover-letters/:id"
                  element={isAuthenticated ? <CoverLetterDetail /> : <Navigate to="/login" />}
                />
                <Route
                  path="/job-tracker"
                  element={isAuthenticated ? <JobTracker /> : <Navigate to="/login" />}
                />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<Article />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/preview-editor" element={<PreviewEditor />} />
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
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </SubscriptionProvider>
      </GTMProvider>
    </Router>
  );
}

export default App;