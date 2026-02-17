'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
                aria-label="Toggle menu"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Mobile Drawer */}
            <div
                className={cn(
                    "fixed inset-0 z-50 md:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />

                {/* Drawer */}
                <div
                    className={cn(
                        "absolute right-0 top-0 bottom-0 w-64 bg-white shadow-2xl transform transition-transform duration-300",
                        isOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    <div className="p-6 space-y-6">
                        <Link
                            href="/#features"
                            onClick={() => setIsOpen(false)}
                            className="block text-lg font-medium text-neutral-700 hover:text-primary-600 transition-colors"
                        >
                            Features
                        </Link>
                        <Link
                            href="/#pricing"
                            onClick={() => setIsOpen(false)}
                            className="block text-lg font-medium text-neutral-700 hover:text-primary-600 transition-colors"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/#about"
                            onClick={() => setIsOpen(false)}
                            className="block text-lg font-medium text-neutral-700 hover:text-primary-600 transition-colors"
                        >
                            About
                        </Link>

                        <div className="pt-6 border-t border-neutral-200 space-y-3">
                            <Link
                                href="/signin"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-center px-6 py-3 text-neutral-700 border-2 border-neutral-300 font-semibold rounded-lg hover:bg-neutral-50 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-center px-6 py-3 bg-gradient-button text-white font-semibold rounded-lg shadow-primary hover:shadow-xl transition-all"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
