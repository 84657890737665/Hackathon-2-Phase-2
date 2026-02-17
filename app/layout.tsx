import { Inter } from 'next/font/google';
import './globals.css';
import { CompletionCelebration } from '@/components/rewards/CompletionCelebration';
import { AuthProvider } from '@/components/AuthProvider';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Taskflow - Work Simplified',
  description: 'Enterprise-grade task management with AI-powered productivity insights',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen bg-white flex flex-col">
        <AuthProvider>
          <div className="flex-grow">
            {children}
            <CompletionCelebration />
            <Toaster position="top-right" />
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}