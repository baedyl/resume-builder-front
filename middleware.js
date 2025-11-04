// Vercel Edge Middleware to serve proper Open Graph meta tags for social media crawlers
// This runs at the edge before the main app loads

export const config = {
  matcher: '/blog/:path*',
};

// Article metadata mapping (keep this updated with your articles)
const articlesMetadata = {
  'turn-tasks-into-wins-bullet-formula-gets-interviews': {
    title: "Turn Tasks Into Wins: The Bullet Formula That Gets Interviews",
    description: "Master the STAR/PAR formula to transform boring task lists into quantified achievements. Learn the action–impact structure, discover metrics for every domain, and use ProAI to convert responsibilities into interview-winning bullets.",
    author: "Emmanuel Dylan",
    date: "2025-11-03",
    category: "resume-optimization",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop"
  },
  'beat-the-bots-in-2025-ats-friendly-resume-blueprint': {
    title: "Beat the Bots in 2025: The ATS‑Friendly Resume Blueprint",
    description: "Demystify ATS and follow a clear, 10‑step workflow to tailor your resume in minutes using ProAI — with formatting rules, keyword mapping, section order, file types, and examples.",
    author: "Emmanuel Dylan",
    date: "2025-10-30",
    category: "ats-optimization",
    image: "https://res.cloudinary.com/dssnz4eum/image/upload/v1761843842/1_o02uum.svg"
  },
  '5-ats-mistakes-that-get-resumes-rejected': {
    title: "5 ATS Mistakes That Get Resumes Rejected (And How to Fix Them)",
    description: "Discover the top 5 ATS mistakes that cost you interviews and learn how to optimize your resume for applicant tracking systems.",
    author: "ProAI Team",
    date: "2025-01-15",
    category: "ats-optimization",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop"
  },
  'the-ultimate-guide-to-ats-optimized-resumes': {
    title: "The Ultimate Guide to ATS-Optimized Resumes in 2025",
    description: "Learn everything you need to know about creating ATS-friendly resumes that pass automated screening and land interviews.",
    author: "ProAI Team",
    date: "2025-01-10",
    category: "ats-optimization",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop"
  },
  'what-is-an-ats-resume-2025': {
    title: "What is an ATS Resume? Complete Guide for 2025",
    description: "Understanding ATS resumes and how to create one that gets past automated screening systems.",
    author: "ProAI Team",
    date: "2025-01-05",
    category: "ats-optimization",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop"
  },
  'how-to-use-ai-to-write-a-resume-that-stands-out': {
    title: "How to Use AI to Write a Resume That Stands Out in 2025",
    description: "Discover how AI-powered tools can help you create a compelling, ATS-optimized resume in minutes.",
    author: "ProAI Team",
    date: "2024-12-20",
    category: "ai-resume",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop"
  },
  'how-to-tailor-your-resume-in-under-10-minutes': {
    title: "How to Tailor Your Resume in Under 10 Minutes (ProAI Method)",
    description: "Learn the fastest way to customize your resume for any job using AI-powered tools and proven strategies.",
    author: "ProAI Team",
    date: "2024-12-15",
    category: "resume-tips",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop"
  },
  '10-resume-mistakes-costing-job-interviews': {
    title: "10 Resume Mistakes Costing You Job Interviews (2025 Guide)",
    description: "Avoid these common resume mistakes that prevent you from getting interviews and learn how to fix them.",
    author: "ProAI Team",
    date: "2024-12-10",
    category: "resume-tips",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop"
  },
  'linkedin-resume-headline-stop-using-aspiring': {
    title: 'LinkedIn Resume Headline: Stop Using "Aspiring" (What to Write Instead)',
    description: "Transform your LinkedIn headline from weak to powerful with these proven strategies and examples.",
    author: "ProAI Team",
    date: "2024-12-05",
    category: "career-branding",
    image: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=1200&h=630&fit=crop"
  },
  'how-to-write-a-cover-letter-2025': {
    title: "How to Write a Cover Letter in 2025 (With Free AI Tool)",
    description: "Master the art of writing compelling cover letters that get you noticed using modern techniques and AI assistance.",
    author: "ProAI Team",
    date: "2024-11-30",
    category: "cover-letter",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop"
  },
  'gpt-5-latest-changes': {
    title: "GPT-5: Latest Changes and What They Mean for Your Career",
    description: "Explore the latest GPT-5 updates and how they can revolutionize your job search and resume creation.",
    author: "ProAI Team",
    date: "2024-11-25",
    category: "ai-news",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop"
  },
  'unlock-career-potential-best-ai-resume-builder': {
    title: "Unlock Your Career Potential with the Best AI Resume Builder",
    description: "Discover how AI Resume Builders revolutionize job applications with ATS-optimization, career branding, and personalized guidance that transforms generic resumes into compelling career narratives.",
    author: "Emmanuel Dylan",
    date: "2025-10-31",
    category: "ai-resume",
    image: "https://res.cloudinary.com/dssnz4eum/image/upload/v1761844679/ProAI_Resume_Article_Cover_Template_4_farx6a.svg"
  },
};

export default async function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Detect social media crawlers
  const isCrawler = /bot|crawler|spider|crawling|facebookexternalhit|twitterbot|linkedinbot|whatsapp|slackbot|discordbot|telegram/i.test(userAgent);
  
  // If not a crawler, continue to the app
  if (!isCrawler) {
    return;
  }

  // Extract the article slug from the URL
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  // Check if it's a blog article URL
  if (pathParts[0] !== 'blog' || pathParts.length < 2) {
    return;
  }

  const slug = pathParts[1];
  const article = articlesMetadata[slug];

  // If article not found, continue to the app
  if (!article) {
    return;
  }

  // Generate HTML with proper meta tags for crawlers
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>${article.title} | ProAI Resume</title>
  <meta name="title" content="${article.title}" />
  <meta name="description" content="${article.description}" />
  <meta name="author" content="${article.author}" />
  <meta name="robots" content="index, follow" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://proairesume.online/blog/${slug}" />
  <meta property="og:title" content="${article.title}" />
  <meta property="og:description" content="${article.description}" />
  <meta property="og:image" content="${article.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${article.title}" />
  <meta property="og:site_name" content="ProAI Resume" />
  <meta property="og:locale" content="en_US" />
  <meta property="article:published_time" content="${new Date(article.date).toISOString()}" />
  <meta property="article:author" content="${article.author}" />
  <meta property="article:section" content="${article.category}" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://proairesume.online/blog/${slug}" />
  <meta name="twitter:title" content="${article.title}" />
  <meta name="twitter:description" content="${article.description}" />
  <meta name="twitter:image" content="${article.image}" />
  <meta name="twitter:image:alt" content="${article.title}" />
  <meta name="twitter:site" content="@baedyl" />
  <meta name="twitter:creator" content="@baedyl" />
  
  <!-- LinkedIn (uses Open Graph) -->
  <meta property="og:image:secure_url" content="${article.image}" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://proairesume.online/blog/${slug}" />
</head>
<body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; line-height: 1.6; color: #1f2937;">
  <article>
    <header style="margin-bottom: 2rem;">
      <div style="display: inline-block; background: #dbeafe; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; margin-bottom: 1rem;">
        ${article.category}
      </div>
      <h1 style="font-size: 2.25rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; color: #111827;">
        ${article.title}
      </h1>
      <p style="font-size: 1.125rem; color: #6b7280; margin: 1rem 0;">
        ${article.description}
      </p>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb;">
        <div style="width: 40px; height: 40px; background: #e5e7eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.875rem; color: #6b7280;">
          ${article.author.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div style="font-weight: 500; color: #111827; font-size: 0.9375rem;">${article.author}</div>
          <div style="font-size: 0.875rem; color: #9ca3af;">${new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        </div>
      </div>
    </header>
    
    ${article.image ? `
    <div style="margin: 2rem 0;">
      <img src="${article.image}" alt="${article.title}" style="width: 100%; height: auto; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);" />
    </div>
    ` : ''}
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 2rem 0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      <p style="margin: 0; color: white; font-size: 1rem; line-height: 1.6;">
        <strong style="font-size: 1.125rem;">📖 Read the Full Article</strong><br/>
        This is a preview for social media sharing. 
        <a href="https://proairesume.online/blog/${slug}" style="color: #fde047; text-decoration: none; font-weight: 600; border-bottom: 2px solid #fde047;">
          Click here to read the complete article →
        </a>
      </p>
    </div>
    
    <footer style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e5e7eb; text-align: center;">
      <a href="https://proairesume.online" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.875rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); transition: transform 0.2s;">
        🚀 Try ProAI Resume Builder Free
      </a>
    </footer>
  </article>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}

