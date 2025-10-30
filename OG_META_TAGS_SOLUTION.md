# Open Graph Meta Tags Solution for Social Media Sharing

## Problem
When sharing blog article links on LinkedIn, Twitter, Facebook, or other social platforms, the default og-image was being displayed instead of article-specific images because:
1. This is a Single Page Application (SPA) built with React/Vite
2. Social media crawlers don't execute JavaScript
3. Dynamic meta tags from React components aren't visible to crawlers

## Solution
We implemented **Vercel Edge Middleware** (`middleware.js`) that:
1. Detects social media crawlers (LinkedIn, Twitter, Facebook, WhatsApp, etc.)
2. Serves a static HTML page with proper Open Graph meta tags for crawlers
3. Allows normal users to continue to the React app

## How It Works

### For Social Media Crawlers:
- Middleware detects crawler user-agents
- Serves static HTML with:
  - Proper Open Graph tags (`og:image`, `og:title`, `og:description`)
  - Twitter Card tags
  - LinkedIn-specific tags
  - Article metadata (author, date, category)
  - A preview page with a link to the full article

### For Human Visitors:
- Middleware passes request through to the React app
- Normal SPA experience with client-side routing

## Files Modified

### 1. `/middleware.js` (NEW)
- Edge middleware that intercepts `/blog/*` routes
- Contains article metadata mapping
- Generates HTML with meta tags for crawlers

### 2. `/vercel.json`
- Already configured with proper rewrites
- No changes needed (middleware works automatically)

## Testing Your Links

Use these tools to verify Open Graph tags:

1. **LinkedIn Post Inspector:**
   - https://www.linkedin.com/post-inspector/
   - Paste your article URL
   - Click "Inspect"

2. **Twitter Card Validator:**
   - https://cards-dev.twitter.com/validator
   - (Requires Twitter account)

3. **Facebook Sharing Debugger:**
   - https://developers.facebook.com/tools/debug/
   - Scrapes and shows preview

4. **Open Graph Preview:**
   - https://www.opengraph.xyz/
   - Quick preview without login

## Adding New Articles

When you add a new article, update the `articlesMetadata` object in `/middleware.js`:

\`\`\`javascript
'your-article-slug': {
  title: "Your Article Title",
  description: "Article description/excerpt",
  author: "Author Name",
  date: "YYYY-MM-DD",
  category: "category-slug",
  image: "https://your-image-url.com/image.jpg"
}
\`\`\`

**Image Requirements:**
- Format: JPG, PNG, or SVG
- Recommended size: 1200x630px (LinkedIn/Facebook OG standard)
- Must be hosted on a public URL (Cloudinary, Unsplash, etc.)
- Use HTTPS (not HTTP)

## Troubleshooting

### Link still shows default image
1. **Clear cache:** Social platforms cache meta tags for 7-30 days
2. **Force re-scrape:**
   - LinkedIn: Use Post Inspector → "Inspect" button
   - Facebook: Use Sharing Debugger → "Scrape Again" button
   - Twitter: Card validator automatically re-scrapes

### Middleware not running
1. Check Vercel deployment logs
2. Verify `middleware.js` is in the root directory
3. Ensure the article slug matches exactly

### Image not displaying
1. Verify image URL is publicly accessible
2. Check image dimensions (1200x630px recommended)
3. Ensure image is served over HTTPS
4. Test image URL in a browser
5. Some platforms require images < 8MB

## Benefits of This Approach

✅ **SEO-Friendly:** Proper meta tags for search engines  
✅ **Fast:** Runs at the edge, no extra server needed  
✅ **Scalable:** Works for unlimited articles  
✅ **Maintainable:** Simple metadata object to update  
✅ **User-Friendly:** No impact on normal site visitors  
✅ **Cost-Effective:** No additional services required  

## Alternative Solutions Considered

1. **Server-Side Rendering (SSR):** Too complex for this use case
2. **react-snap:** Adds build complexity and maintenance
3. **Prerender.io:** Requires paid service
4. **Static HTML generation:** Requires manual updates

Our middleware solution is the perfect balance of simplicity and effectiveness! 🚀

