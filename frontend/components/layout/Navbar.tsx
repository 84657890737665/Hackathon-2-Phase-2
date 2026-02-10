'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Left: Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="text-3xl group-hover:scale-110 transition-transform">✨</div>
                            <span className="text-2xl font-bold text-gradient">
                                TaskFlow
                            </span>
                        </Link>
                    </div>

                    {/* Center: Navigation Links (hidden on mobile) */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/#features"
                            className="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
                        >
                            Features
                        </Link>
                        <Link
                            href="/#pricing"
                            className="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/#about"
                            className="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
                        >
                            About
                        </Link>
                    </div>

                    {/* Right: Auth Buttons + Mobile Menu */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-3">
                            <Link
                                href="/signin"
                                className="px-6 py-2 text-neutral-700 hover:text-primary-600 font-semibold transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="px-6 py-2 bg-gradient-button text-white font-semibold rounded-lg shadow-primary hover:shadow-xl hover:scale-105 transition-all duration-200"
                            >
                                Sign Up
                            </Link>
                        </div>

                        {/* Mobile Menu Trigger */}
                        <MobileMenu />
                    </div>
                </div>
            </div>
        </nav>
    );
}
