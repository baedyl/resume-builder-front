# LinkedIn Analysis API Backend Implementation

This document outlines the backend API structure needed to support the AI-powered LinkedIn analysis feature.

## API Endpoints

### 1. Analyze LinkedIn Profile
```
POST /api/linkedin/analyze
```

**Request Body:**
```json
{
  "profileUrl": "https://linkedin.com/in/username",
  "analysisType": "basic" | "premium"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "analysis_1234567890_abc123def",
    "profileUrl": "https://linkedin.com/in/username",
    "overallScore": 85,
    "strengths": ["Strong technical skills", "Clear career progression"],
    "weaknesses": ["Limited leadership experience"],
    "recommendations": ["Add quantifiable achievements"],
    "keywordOptimization": {
      "currentKeywords": ["JavaScript", "React"],
      "suggestedKeywords": ["TypeScript", "Microservices"],
      "missingKeywords": ["Leadership", "Agile"]
    },
    "professionalPresentation": {
      "headlineScore": 80,
      "aboutScore": 75,
      "experienceScore": 85,
      "skillsScore": 90,
      "overallPresentationScore": 82
    },
    "detailedAnalysis": {
      "industryAlignment": 78,
      "careerProgression": 82,
      "skillGaps": ["Advanced analytics", "Cloud technologies"],
      "marketPosition": "Mid-level professional with growth potential",
      "competitiveAdvantages": ["Strong technical foundation"],
      "industryTrends": ["Remote work adaptation", "Digital transformation"]
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2024-01-16T10:30:00Z",
    "analysisType": "premium"
  }
}
```

### 2. Get Analysis by ID
```
GET /api/linkedin/analysis/:id
```

### 3. List User's Analyses
```
GET /api/linkedin/analyses
```

### 4. Delete Analysis
```
DELETE /api/linkedin/analysis/:id
```

### 5. Get Rate Limit Info
```
GET /api/linkedin/rate-limits
```

## Rate Limiting

### LinkedIn Analysis
- **Limit**: 10 requests per minute per user
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### General API
- **Limit**: 100 requests per 15 minutes per user
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Caching Strategy

### Cache Duration
- **Basic Analysis**: 24 hours
- **Premium Analysis**: 24 hours
- **User-specific cache keys**: `{userId}:{analysisType}:{profileUrl}`

### Cache Management
- **Max entries**: 1000 per user
- **Cleanup**: Remove oldest 20% when limit exceeded
- **Automatic expiration**: Based on `expiresAt` timestamp

## AI Integration

### OpenAI Integration Example
```javascript
const analyzeWithAI = async (profileData, analysisType) => {
  const prompt = `
    Analyze this LinkedIn profile and provide a comprehensive assessment:
    
    Profile URL: ${profileData.url}
    Analysis Type: ${analysisType}
    
    Please provide:
    1. Overall score (1-100)
    2. Strengths and weaknesses
    3. Specific recommendations
    4. Keyword optimization suggestions
    5. Professional presentation feedback
    ${analysisType === 'premium' ? '6. Industry alignment analysis\n7. Career progression insights\n8. Market positioning\n9. Competitive advantages\n10. Industry trends' : ''}
    
    Return the response in JSON format matching the LinkedInAnalysis interface.
  `;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2000
  });
  
  return JSON.parse(response.choices[0].message.content);
};
```

### Alternative AI Services
- **Claude API** (Anthropic)
- **Gemini API** (Google)
- **Custom AI models**

## Database Schema

### Analyses Table
```sql
CREATE TABLE linkedin_analyses (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  profile_url VARCHAR(500) NOT NULL,
  analysis_type ENUM('basic', 'premium') NOT NULL,
  analysis_data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);
```

### Rate Limits Table
```sql
CREATE TABLE rate_limits (
  user_id VARCHAR(255) PRIMARY KEY,
  linkedin_requests INT DEFAULT 0,
  linkedin_reset_time TIMESTAMP,
  general_requests INT DEFAULT 0,
  general_reset_time TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Environment Variables

```env
# AI Service Configuration
OPENAI_API_KEY=your_openai_api_key
AI_MODEL=gpt-4
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2000

# Rate Limiting
LINKEDIN_RATE_LIMIT=10
LINKEDIN_RATE_WINDOW=60
GENERAL_RATE_LIMIT=100
GENERAL_RATE_WINDOW=900

# Caching
CACHE_DURATION=86400
MAX_CACHE_ENTRIES=1000

# Database
DATABASE_URL=your_database_url
```

## Error Handling

### Common Error Responses
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "rateLimitInfo": {
    "remaining": 0,
    "resetTime": 1642248000000
  }
}
```

### Error Codes
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INVALID_URL`: Invalid LinkedIn URL format
- `ANALYSIS_FAILED`: AI analysis failed
- `CACHE_ERROR`: Caching operation failed
- `DATABASE_ERROR`: Database operation failed

## Security Considerations

1. **Input Validation**: Validate LinkedIn URLs and analysis types
2. **Rate Limiting**: Implement proper rate limiting per user
3. **Authentication**: Verify user authentication for all endpoints
4. **Data Privacy**: Ensure profile data is handled securely
5. **Caching**: Implement secure caching with proper expiration
6. **Error Handling**: Don't expose sensitive information in errors

## Monitoring and Logging

1. **Request Logging**: Log all API requests and responses
2. **Error Tracking**: Track and alert on errors
3. **Performance Monitoring**: Monitor response times and throughput
4. **Rate Limit Monitoring**: Track rate limit usage
5. **Cache Hit Rates**: Monitor cache performance

## Deployment Considerations

1. **Scaling**: Consider horizontal scaling for high traffic
2. **Caching**: Use Redis or similar for distributed caching
3. **Database**: Use connection pooling and proper indexing
4. **Load Balancing**: Implement load balancing for multiple instances
5. **Health Checks**: Implement health check endpoints
