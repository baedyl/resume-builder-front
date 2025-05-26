// pages/Home.tsx
const Home: React.FC = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        <main>
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                Create Your Professional Resume
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Build a standout resume in minutes with our easy-to-use tools.
              </p>
              <div className="mt-8">
                <a
                  href="/resume"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };
  
  export default Home;