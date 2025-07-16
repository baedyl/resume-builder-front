// pages/Home.tsx
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <main>
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="md:w-1/2">
            <div className="max-w-full mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-gray-100 transition-colors">
                  Build a Standout Resume That Gets You Hired
                </h2>
                <p className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300 transition-colors">
                  Create a professional resume in minutes with our easy-to-use tools, AI assistance, and many templates.
                </p>
                <div className="mt-6 sm:mt-8">
                  <a
                    href="/resume"
                    className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-md text-base sm:text-lg font-medium hover:bg-blue-700 transition"
                  >
                    Start Building Your Resume Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="py-8 sm:py-12 bg-white dark:bg-gray-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">How It Works</h3>
              <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors">Create your resume in 3 easy steps</p>
            </div>
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h4 className="mt-4 text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Fill in the form</h4>
                <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors">Fill all the required fields of the form with your data</p>
              </div>
              <div className="text-center">
                <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm0 0v4M16 7H8m0 0l3 3m-3-3l3-3" />
                </svg>
                <h4 className="mt-4 text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Customize Your Content</h4>
                <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors">Customize with drag-and-drop and enhance with AI</p>
              </div>
              <div className="text-center">
                <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="mt-4 text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Download Your Resume</h4>
                <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors">Download your professional resume in PDF format</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">Choose Your Resume Style</h3>
              <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors">Preview and pick a template to get started</p>
            </div>
            <div className="flex flex-col sm:flex-wrap justify-center gap-6 sm:gap-8">
              <div className="w-full sm:w-80 bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center transition-colors">
                <img src="/template/modern.png" alt="Modern Template" className="rounded mb-4 border dark:border-gray-700 w-full" />
                <h4 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-gray-100 transition-colors">Modern</h4>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center mb-4 transition-colors">Clean and professional design for modern job seekers.</p>
                <a href="/resume?template=modern" className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base">Use This Template</a>
              </div>
              <div className="w-full sm:w-80 bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center transition-colors">
                <img src="/template/classic.png" alt="Classic Template" className="rounded mb-4 border dark:border-gray-700 w-full" />
                <h4 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-gray-100 transition-colors">Classic</h4>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center mb-4 transition-colors">Traditional and formal layout for timeless appeal.</p>
                <a href="/resume?template=classic" className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base">Use This Template</a>
              </div>
              <div className="w-full sm:w-80 bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center transition-colors">
                <img src="/template/minimal.png" alt="Minimal Template" className="rounded mb-4 border dark:border-gray-700 w-full" />
                <h4 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-gray-100 transition-colors">Minimal</h4>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center mb-4 transition-colors">Simple and elegant style for a clean look.</p>
                <a href="/resume?template=minimal" className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base">Use This Template</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;