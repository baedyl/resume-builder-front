// pages/Home.tsx
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <main>
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="md:w-1/2">
            <div className="max-w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl transition-colors">
                  Build a Standout Resume That Gets You Hired
                </h2>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 transition-colors">
                  Create a professional resume in minutes with our easy-to-use tools, AI assistance, and many templates.
                </p>
                <div className="mt-8">
                  <a
                    href="/resume"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
                  >
                    Start Building Your Resume Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="py-12 bg-white dark:bg-gray-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">Features</h3>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 transition-colors">What makes our resume builder special</p>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transition-colors">
                <h4 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Multiple Templates</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300 transition-colors">Choose from a wide range of professional templates.</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transition-colors">
                <h4 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Drag-and-Drop Customization</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300 transition-colors">Easily customize your resume with our intuitive editor.</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transition-colors">
                <h4 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">AI-Powered Suggestions</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300 transition-colors">Get smart suggestions to improve your resume content.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">What Our Users Say</h3>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 transition-colors">Don't just take our word for it</p>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transition-colors">
                <p className="text-gray-600 dark:text-gray-300 transition-colors">"This resume builder made creating my resume so easy and quick!"</p>
                <p className="mt-4 text-gray-900 dark:text-gray-100 font-medium transition-colors">Emmanuel Dylan, Software Engineer</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transition-colors">
                <p className="text-gray-600 dark:text-gray-300 transition-colors">"I love the AI suggestions; they really helped me improve my resume."</p>
                <p className="mt-4 text-gray-900 dark:text-gray-100 font-medium transition-colors">Bello I'siga, SEO Manager</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transition-colors">
                <p className="text-gray-600 dark:text-gray-300 transition-colors">"The templates look great and the fact that they're optimized for ATS is super helpful."</p>
                <p className="mt-4 text-gray-900 dark:text-gray-100 font-medium transition-colors">Jordan Djimgou, Marketing Manager</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white dark:bg-gray-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">How It Works</h3>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 transition-colors">Create your resume in 3 easy steps</p>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h4 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Fill in the form</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300 transition-colors">Fill all the required fields of the form with your data</p>
              </div>
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm0 0v4M16 7H8m0 0l3 3m-3-3l3-3" />
                </svg>
                <h4 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Customize Your Content</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300 transition-colors">Customize with drag-and-drop and enhance with AI</p>
              </div>
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <h4 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">Download Your Resume</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300 transition-colors">Download your resume in PDF format.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">Ready to Get Started?</h3>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 transition-colors">Create your professional resume today</p>
            <div className="mt-8">
              <a
                href="/resume"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
              >
                Start Building Your Resume Now
              </a>
            </div>
          </div>
        </section>

        {/* Templates Showcase Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">Choose Your Resume Style</h3>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 transition-colors">Preview and pick a template to get started</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="w-80 bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center transition-colors">
                <img src="/template/modern.png" alt="Modern Template" className="rounded mb-4 border dark:border-gray-700" />
                <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100 transition-colors">Modern</h4>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4 transition-colors">Clean and professional design for modern job seekers.</p>
                <a href="/resume?template=modern" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Use This Template</a>
              </div>
              <div className="w-80 bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center transition-colors">
                <img src="/template/classic.png" alt="Classic Template" className="rounded mb-4 border dark:border-gray-700" />
                <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100 transition-colors">Classic</h4>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4 transition-colors">Traditional and formal layout for timeless appeal.</p>
                <a href="/resume?template=classic" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Use This Template</a>
              </div>
              <div className="w-80 bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center transition-colors">
                <img src="/template/minimal.png" alt="Minimal Template" className="rounded mb-4 border dark:border-gray-700" />
                <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100 transition-colors">Minimal</h4>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4 transition-colors">Simple and elegant style for a focused resume.</p>
                <a href="/resume?template=minimal" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Use This Template</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;