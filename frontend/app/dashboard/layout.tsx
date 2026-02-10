import { Header } from '@/components/layout/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/20 relative flex flex-col">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-4 sm:p-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}