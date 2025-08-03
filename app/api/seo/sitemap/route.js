// app/api/seo/sitemap/route.js

import { NextResponse } from 'next/server';
import { SEO_CONFIG } from '../../../../utils/seo';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    
    const baseUrl = SEO_CONFIG.siteUrl;
    const now = new Date().toISOString();
    
    let sitemapData = [];
    
    switch (type) {
      case 'surah':
        // Generate sitemap for all surah
        for (let i = 1; i <= 114; i++) {
          sitemapData.push({
            url: `${baseUrl}/surah/${i}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: i <= 10 ? 0.9 : 0.8 // Higher priority for first 10 surah
          });
        }
        break;
        
      case 'doa':
        const doaCategories = [
          'Doa Harian',
          'Doa Makan', 
          'Doa Perjalanan',
          'Doa Sholat',
          'Doa Pagi Sore',
          'Doa Rumah',
          'Doa Belajar',
          'Doa Kesehatan',
          'Doa Keluarga',
          'Doa Pekerjaan'
        ];
        
        doaCategories.forEach(category => {
          sitemapData.push({
            url: `${baseUrl}/doa?kategori=${encodeURIComponent(category)}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7
          });
        });
        break;
        
      case 'popular':
        // Popular surah with higher SEO priority
        const popularSurah = [
          { id: 1, name: 'Al-Fatihah', priority: 0.95 },
          { id: 2, name: 'Al-Baqarah', priority: 0.9 },
          { id: 18, name: 'Al-Kahf', priority: 0.9 },
          { id: 36, name: 'Ya-Sin', priority: 0.9 },
          { id: 67, name: 'Al-Mulk', priority: 0.9 },
          { id: 112, name: 'Al-Ikhlas', priority: 0.9 },
          { id: 113, name: 'Al-Falaq', priority: 0.85 },
          { id: 114, name: 'An-Nas', priority: 0.85 }
        ];
        
        popularSurah.forEach(surah => {
          sitemapData.push({
            url: `${baseUrl}/surah/${surah.id}`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: surah.priority,
            title: `Surah ${surah.name}`,
            description: `Baca Surah ${surah.name} lengkap dengan terjemahan Indonesia`
          });
        });
        break;
        
      case 'all':
      default:
        // Return all main pages
        const mainPages = [
          { url: baseUrl, priority: 1.0, changeFrequency: 'daily' },
          { url: `${baseUrl}/surah`, priority: 0.9, changeFrequency: 'daily' },
          { url: `${baseUrl}/tajwid`, priority: 0.8, changeFrequency: 'weekly' },
          { url: `${baseUrl}/doa`, priority: 0.8, changeFrequency: 'weekly' },
          { url: `${baseUrl}/sambung-ayat`, priority: 0.7, changeFrequency: 'weekly' },
          { url: `${baseUrl}/fikih-nikah`, priority: 0.6, changeFrequency: 'monthly' }
        ];
        
        sitemapData = mainPages.map(page => ({
          ...page,
          lastModified: now
        }));
        break;
    }
    
    return NextResponse.json({
      success: true,
      data: sitemapData,
      total: sitemapData.length,
      type: type,
      generated: now
    });
    
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate sitemap',
      message: error.message
    }, { status: 500 });
  }
}

// POST endpoint untuk update sitemap cache
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, urls } = body;
    
    if (action === 'update-priority') {
      // Update priority untuk URL tertentu
      const response = {
        success: true,
        message: 'Sitemap priorities updated',
        updated: urls?.length || 0
      };
      
      return NextResponse.json(response);
    }
    
    if (action === 'revalidate') {
      // Trigger revalidation untuk sitemap
      const response = {
        success: true,
        message: 'Sitemap revalidation triggered',
        timestamp: new Date().toISOString()
      };
      
      return NextResponse.json(response);
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Sitemap update error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update sitemap',
      message: error.message
    }, { status: 500 });
  }
}