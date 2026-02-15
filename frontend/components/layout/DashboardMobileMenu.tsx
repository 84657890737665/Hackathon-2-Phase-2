'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
    href: string;
    label: string;
    icon: string;
}

interface DashboardMobileMenuProps {
    navItems: NavItem[];
    userInitial: string;
    onLogout: () => void;
}

export function DashboardMobileMenu({ navItems, userInitial, onLogout }: DashboardMobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
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
                        "absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl transform transition-transform duration-300",
                        isOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    <div className="flex flex-col h-full p-6">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-xl font-bold text-gradient">Menu</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-neutral-500 hover:text-neutral-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                                        pathname === item.href
                                            ? "bg-primary-50 text-primary-600"
                                            : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-600"
                                    )}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                            
                            {/* Home link */}
                            <Link
                                key="home"
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                                    pathname === "/"
                                        ? "bg-primary-50 text-primary-600"
                                        : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-600"
                                )}
                            >
                                <span className="text-xl">🏠</span>
                                <span>Go to Home</span>
                            </Link>
                        </div>

                        <div className="pt-6 border-t border-neutral-200">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onLogout();
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <span className="text-xl">🚪</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
