
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
        description={article.metadata.excerpt}
        keywords={`resume tips, career advice, job search, ${article.metadata.category}`}
        image={article.metadata.image}
        url={`/blog/${slug}`}
        type="article"
        author={article.metadata.author}
        publishedTime={new Date(article.metadata.date).toISOString()}
        section="Career Advice"
        tags={[article.metadata.category, 'resume tips', 'career advice']}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-6">
              <FaArrowLeft className="mr-2" />
              Back to Blog
            </Link>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                {article.metadata.category}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">{article.metadata.readTime}</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {article.metadata.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {article.metadata.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">
                    {article.metadata.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{article.metadata.author}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{article.metadata.authorTitle}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(article.metadata.rating) ? 'text-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {article.metadata.rating} ({article.metadata.ratingCount} ratings)
                  </span>
                </div>
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
          </div>
        </div>

        {/* Article Image */}
        {article.metadata.image && (
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={article.metadata.image}
                  alt={article.metadata.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">In This Guide:</h3>
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
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-1 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400">
                <div 
                  className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </article>

              {/* Article Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 font-semibold">
                        {article.metadata.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{article.metadata.author}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{article.metadata.authorTitle}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Published {article.metadata.date}
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