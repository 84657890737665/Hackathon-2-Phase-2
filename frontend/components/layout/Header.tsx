'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { StreakCounter } from '@/components/rewards/StreakCounter';
import { PointsDisplay } from '@/components/rewards/PointsDisplay';
import { useAuth } from '@/components/AuthProvider';

const navItems = [
  { href: '/dashboard/tasks', label: 'Tasks', icon: '📋' },
  { href: '/dashboard/completed', label: 'History', icon: '📊' },
  { href: '/dashboard/achievements', label: 'Rewards', icon: '🏆' },
];

export function Header() {
  const pathname = usePathname();
  const { signOut, useSession } = useAuth();
  const session = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  // Only show header content if user is authenticated
  if (!session?.data) {
    return null;
  }

  const userInitial = session.data.user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">

          {/* Left: Logo */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard/tasks" className="flex items-center gap-2 group">
              <div className="text-2xl group-hover:scale-110 transition-transform">✨</div>
              <span className="text-xl font-bold text-gradient hidden sm:block">
                TaskFlow
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                    pathname === item.href
                      ? "bg-primary-50 text-primary-600"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-600"
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Center/Right: Rewards + User */}
          <div className="flex items-center gap-4">
            {/* Streak Counter */}
            <div className="hidden sm:block">
              <StreakCounter />
            </div>

            {/* Points Display */}
            <div className="hidden sm:block">
              <PointsDisplay />
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
              <Link href="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 rounded-lg transition-colors group">
                <div className="w-8 h-8 rounded-full bg-gradient-button flex items-center justify-center text-white font-bold">
                  {userInitial}
                </div>
                <span className="hidden md:block text-sm font-medium text-neutral-700 group-hover:text-neutral-900">
                  Profile
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-neutral-200 z-50">
        <div className="flex items-center justify-around h-16 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all",
                pathname === item.href
                  ? "text-primary-600"
                  : "text-neutral-500"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
          <Link href="/dashboard/profile" className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-neutral-500">
            <span className="text-xl">👤</span>
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
}