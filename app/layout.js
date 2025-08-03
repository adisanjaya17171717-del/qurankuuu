// app/layout.js

import { Inter } from 'next/font/google';
import { SEO_CONFIG, createSEOConfig } from '../utils/seo';
import "./globals.css";
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

// Generate metadata for the layout
export const metadata = createSEOConfig({
  title: SEO_CONFIG.defaultTitle,
  description: SEO_CONFIG.defaultDescription,
  keywords: SEO_CONFIG.keywords,
  url: "/",
  type: "website"
});

// Export viewport separately for Next.js 14+
export const viewport = {
  themeColor: SEO_CONFIG.themeColor,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.className}>
      <body className="bg-gray-50">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}