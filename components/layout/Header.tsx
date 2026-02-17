'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { useRewardSystem } from '@/lib/hooks/useRewardSystem';
import { useAuth } from '@/components/AuthProvider';
import { DashboardMobileMenu } from './DashboardMobileMenu';

const navItems = [
  { href: '/tasks', label: 'Tasks', icon: '📋' },
  { href: '/streaks', label: 'Streaks', icon: '🔥' },
  { href: '/rewards', label: 'Rewards', icon: '🎁' },
  { href: '/todays-quote', label: 'Quote', icon: '💬' },
];

export function Header() {
  const pathname = usePathname();
  const { signOut, useSession } = useAuth();
  const session = useSession();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <div className="flex-shrink-0">
            <Link href="/tasks" className="flex items-center gap-2 group">
              <div className="text-xl">📋</div>
              <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-primary-600 transition-colors">
                Taskflow
              </span>
            </Link>
          </div>

          {/* Center: Main Navigation (Exactly 4 Buttons) */}
          <nav className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-auto">
            <div className="flex items-center w-full justify-around">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex flex-col items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 group min-w-[80px]",
                    pathname === item.href
                      ? "text-primary-600 bg-primary-50"
                      : "text-neutral-600 hover:text-primary-600 hover:bg-neutral-50"
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs mt-1 font-medium">{item.label}</span>

                  {/* Active Indicator */}
                  {pathname === item.href && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-primary-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right: Performance Metrics + Profile + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Desktop Performance Metrics */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="bg-white rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700">
                <div className="flex items-center gap-1">
                  <span>📊</span>
                  <span>{useRewardSystem.getState().completionRate}%</span>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700">
                <div className="flex items-center gap-1">
                  <span>⚡</span>
                  <span>{useRewardSystem.getState().executionVelocity.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="h-6 w-px bg-neutral-200 mx-2 hidden lg:block" />

            {/* Desktop Profile Dropdown */}
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium shadow-sm hover:shadow-md transition-all text-sm"
                  aria-label="User menu"
                >
                  {userInitial}
                </button>

                {/* Desktop Dropdown */}
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50"
                  >
                    <Link
                      href="/"
                      className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span>🏠</span>
                      <span>Go to Home</span>
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span>⚙️</span>
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center gap-2 md:hidden">
              <DashboardMobileMenu
                navItems={navItems}
                userInitial={userInitial}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation (Exactly 4 Buttons) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
        <div className="flex items-center justify-around h-16 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 min-w-[70px]",
                pathname === item.href
                  ? "text-primary-600"
                  : "text-neutral-600 hover:text-primary-600"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>

              {pathname === item.href && (
                <div className="w-1.5 h-0.5 bg-primary-500 rounded-full mt-0.5" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}