import { SEO_CONFIG } from '../utils/seo';

export default function robots() {
  const baseUrl = SEO_CONFIG.siteUrl;
  
  return {
    rules: [
      // Rules for all user agents
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/static/',
          '/private/',
          '/temp/',
          '/*?*utm_*',  // Block UTM tracking parameters
          '/*?*fbclid=*', // Block Facebook click IDs
          '/*?*gclid=*',  // Block Google click IDs
        ],
      },
      
      // Specific rules for Google
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
        ],
      },
      
      // Rules for Bing
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
        ],
      },
      
      // Rules for social media crawlers
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },
      
      // Block bad bots
      {
        userAgent: [
          'SemrushBot',
          'AhrefsBot',
          'MJ12bot',
          'DotBot',
          'AspiegelBot',
          'SurveyBot',
          'CCBot',
          'ScreamingFrogSEOSpider',
          'BLEXBot'
        ],
        disallow: '/',
      }
    ],
    
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
    
    // Crawl delay for different bots
    crawlDelay: 1, // 1 second delay for all bots
  };
}