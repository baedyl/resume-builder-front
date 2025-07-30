import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendar, FaUser, FaArrowRight, FaBookmark, FaShare, FaClock } from 'react-icons/fa';
import { getAllArticles } from '../utils/articleLoader';
import SEO from '../components/SEO';

const Blog: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const allArticles = getAllArticles();
        setArticles(allArticles);
        setFilteredArticles(allArticles);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  useEffect(() => {
    let filtered = articles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.metadata.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.metadata.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.metadata.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.metadata.category === selectedCategory);
    }

    setFilteredArticles(filtered);
  }, [articles, searchTerm, selectedCategory]);

  const categories = ['all', ...Array.from(new Set(articles.map(article => article.metadata.category))).sort()];

  if (isLoading) {
    return (
      <>
        <SEO 
          title="Blog - Career Advice & Resume Tips"
          description="Discover expert career advice, resume writing tips, and job search strategies. Learn how to create ATS-optimized resumes and land your dream job."
          keywords="career advice, resume tips, job search, ATS optimization, cover letters, interview tips"
        />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading articles...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Blog - Career Advice & Resume Tips"
        description="Discover expert career advice, resume writing tips, and job search strategies. Learn how to create ATS-optimized resumes and land your dream job."
        keywords="career advice, resume tips, job search, ATS optimization, cover letters, interview tips"
        url="/blog"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Career Blog
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Expert advice on resume writing, job searching, and career development. 
                Learn how to create ATS-optimized resumes and land your dream job.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-300">
              {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <article key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Article Image */}
                  {article.metadata.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.metadata.image}
                        alt={article.metadata.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="p-6">
                    {/* Category and Read Time */}
                    <div className="flex items-center gap-4 mb-3">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                        {article.metadata.category}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                        <FaClock className="mr-1" />
                        {article.metadata.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {article.metadata.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {article.metadata.excerpt}
                    </p>

                    {/* Author and Date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
                            {article.metadata.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {article.metadata.author}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <FaCalendar className="mr-1" />
                            {article.metadata.date}
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaArrowRight key={i} className={`w-4 h-4 ${i < Math.floor(article.metadata.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {article.metadata.rating}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/blog/${article.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                      >
                        Read More
                        <FaArrowRight className="ml-1 w-4 h-4" />
                      </Link>

                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                          <FaBookmark />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                          <FaShare />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog; 