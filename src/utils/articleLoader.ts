export interface ArticleMetadata {
  title: string;
  description?: string;
  excerpt?: string;
  keywords?: string;
  author: string;
  publishedTime?: string;
  modifiedTime?: string;
  date?: string;
  section?: string;
  category?: string;
  tags?: string[];
  image?: string;
  readTime?: string;
  rating?: number;
  ratingCount?: number;
  authorTitle?: string;
  tableOfContents?: string[];
}

export interface ArticleData {
  slug: string;
  metadata: ArticleMetadata;
  content: string;
}

// Import all article files
const articleFiles = import.meta.glob('../content/articles/*.js', { eager: true });

export function getAllArticles(): ArticleData[] {
  const articles: ArticleData[] = [];

  for (const path in articleFiles) {
    const file = articleFiles[path] as any;
    const slug = path.replace('../content/articles/', '').replace('.js', '');
    
    try {
      let metadata: ArticleMetadata;
      let content: string;

      if (file.default) {
        // New format with default export
        const articleData = file.default;
        metadata = {
          title: articleData.title,
          description: articleData.description,
          keywords: articleData.keywords,
          author: articleData.author,
          publishedTime: articleData.publishedTime,
          modifiedTime: articleData.modifiedTime,
          section: articleData.section,
          tags: articleData.tags,
          image: articleData.image,
          readTime: articleData.readTime,
          rating: articleData.rating,
          ratingCount: articleData.ratingCount
        };
        content = articleData.content;
      } else if (file.metadata && file.content) {
        // Old format with separate exports
        metadata = {
          title: file.metadata.title,
          excerpt: file.metadata.excerpt,
          author: file.metadata.author,
          authorTitle: file.metadata.authorTitle,
          date: file.metadata.date,
          readTime: file.metadata.readTime,
          category: file.metadata.category,
          image: file.metadata.image,
          rating: file.metadata.rating,
          ratingCount: file.metadata.ratingCount,
          tableOfContents: file.metadata.tableOfContents,
          // Map old fields to new structure
          description: file.metadata.excerpt,
          section: file.metadata.category,
          publishedTime: file.metadata.date
        };
        content = file.content;
      } else {
        console.warn(`Article ${slug} has unknown format`);
        continue;
      }

      articles.push({
        slug,
        metadata,
        content
      });

    } catch (error) {
      console.error(`Error loading article ${slug}:`, error);
    }
  }

  return articles.sort((a, b) => {
    const dateA = a.metadata.publishedTime || a.metadata.date || '';
    const dateB = b.metadata.publishedTime || b.metadata.date || '';
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
}

export function getArticleBySlug(slug: string): ArticleData | null {
  const articles = getAllArticles();
  return articles.find(article => article.slug === slug) || null;
}

export function getArticlesByCategory(category: string): ArticleData[] {
  const articles = getAllArticles();
  return articles.filter(article => 
    article.metadata.section === category || article.metadata.category === category
  );
}

export function searchArticles(query: string): ArticleData[] {
  const articles = getAllArticles();
  const lowercaseQuery = query.toLowerCase();
  
  return articles.filter(article => 
    article.metadata.title.toLowerCase().includes(lowercaseQuery) ||
    (article.metadata.description && article.metadata.description.toLowerCase().includes(lowercaseQuery)) ||
    (article.metadata.excerpt && article.metadata.excerpt.toLowerCase().includes(lowercaseQuery)) ||
    article.content.toLowerCase().includes(lowercaseQuery)
  );
} 