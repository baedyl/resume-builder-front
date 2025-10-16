
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { FaArrowLeft, FaCalendar, FaUser, FaClock, FaBookmark, FaShare, FaStar } from 'react-icons/fa';
import { getArticleBySlug } from '../utils/articleLoader';
import SEO from '../components/SEO';

const Article: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const article = slug ? getArticleBySlug(slug) : null;

  useEffect(() => {
    if (article) {
      // Add IDs to h2 elements for table of contents navigation
      const h2Elements = document.querySelectorAll('h2');
      h2Elements.forEach((h2, index) => {
        const text = h2.textContent || '';
        const id = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
        h2.id = id;
      });

      // Handle smooth scrolling for table of contents links
      const handleTableOfContentsClick = (e: Event) => {
        const target = e.target as HTMLAnchorElement;
        if (target.href && target.href.includes('#')) {
          e.preventDefault();
          const id = target.href.split('#')[1];
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      };

      // Add event listeners to table of contents links
      const tocLinks = document.querySelectorAll('nav a[href^="#"]');
      tocLinks.forEach(link => {
        link.addEventListener('click', handleTableOfContentsClick);
      });

      // Cleanup event listeners
      return () => {
        tocLinks.forEach(link => {
          link.removeEventListener('click', handleTableOfContentsClick);
        });
      };
    }
  }, [article]);

  const handleShare = () => {
    if (!article) return;
    
    const url = `${window.location.origin}/blog/${slug}`;
    const text = `${article.metadata.title} - Check out this article on AI Resume Builder!`;
    const hashtags = 'AIResumeBuilder,ResumeTips,CareerAdvice,JobSearch';
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
    
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  if (!article) {
    return (
      <>
        <SEO 
          title="Article Not Found"
          description="The requested article could not be found."
          type="website"
        />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
            <Link to="/blog" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title={article.metadata.title}
        description={article.metadata.excerpt || article.metadata.description}
        keywords={`resume tips, career advice, job search, ${article.metadata.category || article.metadata.section}`}
        image={article.metadata.image}
        url={`/blog/${slug}`}
        type="article"
        author={article.metadata.author}
        publishedTime={new Date(article.metadata.date || article.metadata.publishedTime || '').toISOString()}
        section="Career Advice"
        tags={[article.metadata.category || article.metadata.section, 'resume tips', 'career advice']}
      />
      <div id="main-content" role="main" className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-6">
              <FaArrowLeft className="mr-2" />
              Back to Blog
            </Link>
            
            <div className="flex items-center gap-4 mb-4 min-h-[28px]">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                {article.metadata.category || article.metadata.section}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                <FaClock className="mr-1" />
                {article.metadata.readTime || '5 min read'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {article.metadata.title}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {article.metadata.excerpt || article.metadata.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
                      {article.metadata.author.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {article.metadata.author}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <FaCalendar className="mr-1" />
                      {new Date(article.metadata.date || article.metadata.publishedTime || '').toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button aria-label="Save article" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <FaBookmark />
                </button>
                <button 
                  className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  onClick={handleShare}
                  title="Share on Twitter"
                >
                  <FaShare />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Article Image */}
        {article.metadata.image && (
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={article.metadata.image}
                  alt={article.metadata.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={630}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (img.src !== '/og-image.jpg') {
                      img.src = '/og-image.jpg';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Table of Contents */}
                {article.metadata.tableOfContents && article.metadata.tableOfContents.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Table of Contents
                    </h3>
                    <nav className="space-y-2">
                      {article.metadata.tableOfContents.map((item, index) => (
                        <a
                          key={index}
                          href={`#${item.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}`}
                          className="block text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {item}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Article Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Article Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Rating</span>
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={`w-4 h-4 ${i < (article.metadata.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {article.metadata.rating || 4.8}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Read Time</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {article.metadata.readTime || '5 min read'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Category</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {article.metadata.category || article.metadata.section}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Article; 