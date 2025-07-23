export interface ArticleMetadata {
  title: string;
  excerpt: string;
  author: string;
  authorTitle: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  rating: number;
  ratingCount: number;
  tableOfContents: string[];
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
    const file = articleFiles[path] as { metadata: ArticleMetadata; content: string };
    const slug = path.replace('../content/articles/', '').replace('.js', '');
    

    
    try {
      articles.push({
        slug,
        metadata: file.metadata,
        content: file.content
      });
      

    } catch (error) {
      console.error(`Error loading article ${slug}:`, error);
    }
  }


  return articles.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
}

export function getArticleBySlug(slug: string): ArticleData | null {
  const articles = getAllArticles();
  return articles.find(article => article.slug === slug) || null;
}

export function getArticlesByCategory(category: string): ArticleData[] {
  const articles = getAllArticles();
  return articles.filter(article => article.metadata.category === category);
}

export function searchArticles(query: string): ArticleData[] {
  const articles = getAllArticles();
  const lowercaseQuery = query.toLowerCase();
  
  return articles.filter(article => 
    article.metadata.title.toLowerCase().includes(lowercaseQuery) ||
    article.metadata.excerpt.toLowerCase().includes(lowercaseQuery) ||
    article.content.toLowerCase().includes(lowercaseQuery)
  );
} 