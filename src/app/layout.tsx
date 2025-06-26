// Import global styles and font
import './globals.css';
import { Inter } from 'next/font/google';

// Initialize the Inter font with Latin subset
const interFont = Inter({ subsets: ['latin'] });

// Metadata for the application - Mobile optimized
export const metadata = {
  title: 'BayForm',
  description: 'Create professional simple resumes for job applications',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

// Root layout component wraps all pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon for the browser tab */}
        <link rel="icon" href="/images/favicon.png" />
      </head>
      <body className={interFont.className}>
        {/* Main content area with minimum height and background color */}
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
