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
  title: 'TaskFlow - work, simplified',
  description: 'Structured tasks, Focused execution, Better outcomes!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
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