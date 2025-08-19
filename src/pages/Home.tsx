// pages/Home.tsx

import { Link } from 'react-router-dom';
import { FaRocket, FaMagic, FaDownload, FaStar, FaCheck, FaUsers, FaClipboardList, FaClock, FaFileAlt } from 'react-icons/fa';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SEO 
        title="AI Resume Builder - Free Professional Resume Creator with AI"
        description="Create professional, ATS-optimized resumes with AI assistance. Free AI resume builder with templates, cover letters, and job tracking. Build your resume in minutes!"
        keywords="ai resume builder, ai resume builder free, free resume builder, AI resume creator, professional resume builder, ATS optimized resume, resume templates, cover letter generator, job application tracker, career tools, job search, resume maker, cv builder"
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium mb-8">
              <FaRocket className="mr-2" />
              Free AI Resume Builder
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Stop Sending Resumes That Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">Rejected by ATS</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Our AI resume builder helps unemployed professionals and career changers create ATS-optimized resumes that actually get past automated screening. 
              <strong> 73% of our users get interviews within 7 days.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="/resume"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaMagic className="mr-2" />
                Start Building Free
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaStar className="mr-2" />
                View Pricing
              </a>
              <a
                href="#templates"
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-lg font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              >
                <FaFileAlt className="mr-2" />
                View Templates
              </a>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Free AI resume builder
              </div>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                AI-powered insights
              </div>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Export to PDF
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Professionals Choose Us Over Other Resume Builders
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We solve the real problems that other tools ignore
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Problems Other Tools Don't Solve */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-6">
                ❌ What Other Resume Builders Don't Tell You
              </h3>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Generic Templates Get Rejected</h4>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Most templates aren't ATS-optimized, leading to automatic rejection
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">No Career Transition Support</h4>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Can't help you translate experience from one industry to another
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">One-Size-Fits-All Approach</h4>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Same advice for everyone, regardless of your situation
                </p>
              </div>
            </div>
            
            {/* Right Column - Our Solutions */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6">
                ✅ How We Actually Help You Get Hired
              </h3>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">ATS-Optimized for Real Results</h4>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Our AI analyzes job descriptions and optimizes your resume to pass automated screening
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Career Transition Expertise</h4>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Specialized AI that helps translate your experience into relevant skills for new industries
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Personalized for Your Situation</h4>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Different strategies for unemployed professionals vs. career changers vs. industry switchers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - More Compelling */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">73%</div>
              <div className="text-gray-600 dark:text-gray-300">Higher Interview Rate</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">vs. generic resumes</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-300">ATS Pass Rate</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">automated screening</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">7 Days</div>
              <div className="text-gray-600 dark:text-gray-300">Average to Interview</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">from resume to call</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">5 Min</div>
              <div className="text-gray-600 dark:text-gray-300">Resume Creation</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">start to finish</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Outcome Focused */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How We Get You Results That Other Tools Can't
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Every feature is designed to solve a specific problem in your job search
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <FaMagic className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">ATS Optimization That Actually Works</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI doesn't just suggest keywords—it analyzes job descriptions and ensures your resume gets past automated screening systems. 
                <strong>95% of our resumes pass ATS checks.</strong>
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                <FaFileAlt className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Career Transition Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Switching industries? Our AI helps translate your experience into relevant skills and achievements that hiring managers in your target field will understand.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                <FaDownload className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Industry-Specific Optimization</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Different industries have different expectations. Our AI adapts your resume to match the specific requirements and language of your target industry.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-6">
                <FaClock className="text-orange-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Unemployment Gap Solutions</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Employment gaps don't have to hurt your chances. Our AI helps you present breaks in employment as periods of growth and skill development.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                <FaClipboardList className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Job Search Strategy</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Beyond just building resumes, we help you track applications, follow up strategically, and manage your entire job search process.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6">
                <FaUsers className="text-indigo-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Real Career Coaching</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get personalized advice from our AI that understands your specific situation—whether you're unemployed, changing careers, or switching industries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Your Situation, Our Solution Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tailored Solutions for Your Specific Situation
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We don't believe in one-size-fits-all solutions
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Unemployed Professionals */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <FaUsers className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Unemployed Professionals</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Your Challenges:</h4>
                <ul className="text-blue-700 dark:text-blue-300 space-y-2">
                  <li>• Employment gaps that worry recruiters</li>
                  <li>• Skills that may seem outdated</li>
                  <li>• Competition from employed candidates</li>
                  <li>• Need to show continued growth</li>
                </ul>
              </div>
              
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Our Solutions:</h4>
                <ul className="text-blue-700 dark:text-blue-300 space-y-2">
                  <li>• AI that reframes gaps as growth periods</li>
                  <li>• Skills assessment and upskilling suggestions</li>
                  <li>• Competitive positioning strategies</li>
                  <li>• Volunteer/work gap optimization</li>
                </ul>
              </div>
              
              <a href="/resume?audience=unemployed" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Build Resume for Job Seekers
              </a>
            </div>
            
            {/* Career Changers */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <FaRocket className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">Career Changers</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">Your Challenges:</h4>
                <ul className="text-green-700 dark:text-green-300 space-y-2">
                  <li>• Transferring skills across industries</li>
                  <li>• Explaining career pivot to recruiters</li>
                  <li>• Building relevant experience quickly</li>
                  <li>• Overcoming industry bias</li>
                </ul>
              </div>
              
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">Our Solutions:</h4>
                <ul className="text-green-700 dark:text-green-300 space-y-2">
                  <li>• AI skill translation across industries</li>
                  <li>• Career change narrative optimization</li>
                  <li>• Relevant project and experience highlighting</li>
                  <li>• Industry-specific language adaptation</li>
                </ul>
              </div>
              
              <a href="/resume?audience=career-changer" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                Build Resume for Career Change
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Create Your Resume in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              It's never been easier to build a professional resume with our AI resume builder
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Fill Your Information</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enter your personal details, work experience, education, and skills in our easy-to-use form.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Choose Your Template</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Select from our professional templates and customize the design to match your style.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Download & Apply</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Download your professional PDF resume and start applying to your dream jobs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Professional Resume Templates
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose the perfect template for your industry and experience level
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <img src="/template/modern.png" alt="Modern Template" className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Modern</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Clean and contemporary design perfect for tech and creative industries.
                </p>
                <div className="flex items-center justify-end">
                  <a 
                    href="/resume?template=modern" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Use Template
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <img src="/template/classic.png" alt="Classic Template" className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Classic</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Traditional and formal layout ideal for corporate and professional roles.
                </p>
                <div className="flex items-center justify-end">
                  <a 
                    href="/resume?template=classic" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Use Template
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <img src="/template/minimal.png" alt="Minimal Template" className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Minimal</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Simple and elegant design that puts focus on your content and achievements.
                </p>
                <div className="flex items-center justify-end">
                  <a 
                    href="/resume?template=minimal" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Use Template
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative">
              <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded">New</span>
              <img src="/template/colorful.png" alt="Colorful Template" className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Colorful</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Vibrant and eye-catching design perfect for creative and marketing roles.
                </p>
                <div className="flex items-center justify-end">
                  <a 
                    href="/resume?template=colorful" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Use Template
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Specific Outcomes */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Real Results from Real People
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See how our AI resume builder transformed their job search
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "After 8 months of unemployment, I used this AI builder and got 3 interviews in 2 weeks. Landed a job paying 20% more than my previous role!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  S
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Sarah Chen</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Marketing Director</div>
                  <div className="text-xs text-green-600 font-medium">8 months → 2 weeks to hire</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Switched from finance to tech using their career transition AI. The resume perfectly translated my skills and I got hired at a startup within a month."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  M
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Mike Rodriguez</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Product Manager</div>
                  <div className="text-xs text-green-600 font-medium">Finance → Tech in 1 month</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "The ATS optimization is real! My resume was getting rejected everywhere. After using this tool, I passed every ATS check and got 5 interviews."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  J
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Jennifer Park</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">UX Designer</div>
                  <div className="text-xs text-green-600 font-medium">0 → 5 interviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stop Sending Resumes That Get Rejected
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have increased their interview rate by 73% with our ATS-optimized AI resume builder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <a
              href="/resume"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <FaRocket className="mr-2" />
              Build Your ATS-Optimized Resume
            </a>
            <Link
              to="/pricing"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              <FaFileAlt className="mr-2" />
              View Premium Features
            </Link>
          </div>
          <p className="text-blue-100 text-sm">
            Free AI resume builder • 95% ATS pass rate • 73% higher interview rate
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;