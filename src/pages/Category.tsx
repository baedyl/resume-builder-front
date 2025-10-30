import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCalendar, FaArrowRight, FaClock, FaChevronLeft, FaChevronRight, FaTags } from 'react-icons/fa';
import { getAllArticles } from '../utils/articleLoader';
import SEO from '../components/SEO';

const categoryInfo: Record<string, { title: string; description: string; icon: string }> = {
  'ats-optimization': {
    title: 'ATS Optimization',
    description: 'Master Applicant Tracking Systems and create resumes that get past automated screening. Learn the best practices for ATS-friendly formatting and keyword optimization.',
    icon: '🎯'
  },
  'ai-resume': {
    title: 'AI Resume Builder',
    description: 'Discover how artificial intelligence can transform your resume writing process. Learn to use AI tools to create compelling, optimized resumes faster.',
    icon: '🤖'
  },
  'career-branding': {
    title: 'Career Branding',
    description: 'Build a strong professional brand that stands out. Learn how to optimize your LinkedIn profile, create compelling headlines, and position yourself effectively.',
    icon: '✨'
  },
  'job-search': {
    title: 'Job Search Strategies',
    description: 'Effective job search tactics and networking strategies to land your dream role. Learn innovative approaches to stand out in a competitive market.',
    icon: '🔍'
  },
  'resume-tips': {
    title: 'Resume Tips',
    description: 'Practical resume writing advice to help you create professional resumes that catch recruiters\' attention and land interviews.',
    icon: '📝'
  },
  'cover-letter': {
    title: 'Cover Letters',
    description: 'Write compelling cover letters that complement your resume and make a strong first impression with hiring managers.',
    icon: '✉️'
  },
  'ai-news': {
    title: 'AI & Career News',
    description: 'Stay updated on the latest AI developments and how they impact job search, resume writing, and career advancement.',
    icon: '📰'
  }
};

const Category: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const allArticles = getAllArticles();
        // Filter articles by category
        const filtered = allArticles.filter(article => 
          article.metadata.category === category || article.metadata.section === category
        );
        setArticles(filtered);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
    setCurrentPage(1); // Reset pagination when category changes
  }, [category]);

  const categoryData = category ? categoryInfo[category] : null;
  const otherCategories = Object.keys(categoryInfo).filter(cat => cat !== category);

  // Pagination logic
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Category Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The category you're looking for doesn't exist.</p>
          <Link to="/blog" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <FaArrowRight className="mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${categoryData.title} - Career Blog`}
        description={categoryData.description}
        keywords={`${categoryData.title}, resume tips, career advice, job search, ${category}`}
        url={`/blog/category/${category}`}
      />
      <div id="main-content" role="main" className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="text-6xl mb-4">{categoryData.icon}</div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {categoryData.title}
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-6">
                {categoryData.description}
              </p>
              <div className="flex justify-center gap-4">
                <Link 
                  to="/blog" 
                  className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  All Articles
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-gray-600 dark:text-gray-300">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white font-medium">{categoryData.title}</span>
          </nav>
        </div>

        {/* Articles */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-300">
              {articles.length === 0 ? (
                'No articles found in this category'
              ) : (
                `Showing ${startIndex + 1}-${Math.min(endIndex, articles.length)} of ${articles.length} article${articles.length !== 1 ? 's' : ''}`
              )}
            </p>
          </div>

          {/* Articles Grid */}
          {currentArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {currentArticles.map((article, index) => (
                  <Link
                    key={index}
                    to={`/blog/${article.slug}`}
                    className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                  >
                    {/* Article Image */}
                    {article.metadata.image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.metadata.image}
                          alt={article.metadata.title || 'Article'}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Article Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaCalendar size={12} />
                          {article.metadata.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock size={12} />
                          {article.metadata.readTime}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {article.metadata.title}
                      </h2>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {article.metadata.excerpt || article.metadata.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          By {article.metadata.author}
                        </span>
                        <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                          Read More
                          <FaArrowRight className="ml-2" size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <FaChevronLeft />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 mb-4">No articles found in this category yet.</p>
              <Link to="/blog" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                View all articles
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          )}
        </div>

        {/* Other Categories */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-2 mb-6">
              <FaTags className="text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Explore Other Categories
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCategories.map((cat) => {
                const info = categoryInfo[cat];
                return (
                  <Link
                    key={cat}
                    to={`/blog/category/${cat}`}
                    className="block p-6 bg-gray-50 dark:bg-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="text-4xl mb-3">{info.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {info.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                      {info.description}
                    </p>
                    <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium mt-3">
                      View Articles
                      <FaArrowRight className="ml-2" size={12} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;

