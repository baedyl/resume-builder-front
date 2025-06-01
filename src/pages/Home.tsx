// pages/Home.tsx
const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="md:w-1/2">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                  Build a Standout Resume That Gets You Hired
                </h2>
                <p className="mt-4 text-xl text-gray-600">
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
      </main>
    </div>
  );
};

export default Home;