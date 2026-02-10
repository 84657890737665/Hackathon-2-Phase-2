'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <Navbar />
      {/* Gradient mesh overlay */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />

      {/* Hero Section */}
      <section className="relative z-10 min-h-[90vh] flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Image */}
          <div className="relative flex justify-center order-2 lg:order-1">
            <img
              src="/hero-section.jpeg"
              alt="TaskFlow application interface showing task management features"
              className="rounded-2xl shadow-2xl border border-white/30 max-w-full h-auto"
            />

            {/* Floating decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-accent-200/30 to-primary-200/30 rounded-full blur-xl animate-float"></div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gradient-to-br from-warm-200/20 to-accent-200/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="text-center lg:text-left order-1 lg:order-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient animate-fade-in">
              Turn productivity into a habit, not a struggle
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Complete tasks, build streaks, and earn rewards with our fun and effective productivity app. Say goodbye to procrastination and hello to a more productive you!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/signup"
                className="px-8 py-4 button-primary text-center"
              >
                Start Building Habits Today
              </Link>
              <Link
                href="/signin"
                className="px-8 py-4 bg-white/80 text-primary-600 font-medium rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 text-center"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                <span>Join 10,000+ productive users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warm-500 rounded-full animate-pulse"></div>
                <span>Build streaks for 30+ days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="relative z-10 py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-neutral-900">
            Stop Breaking Your Productivity Promises
          </h2>
          <p className="text-center text-neutral-600 mb-16 max-w-2xl mx-auto">
            Traditional to-do lists don't work because they lack motivation and accountability. We solve this with gamification.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '❌',
                title: 'The Problem',
                desc: 'Most people abandon their productivity systems within 2 weeks due to lack of motivation and accountability'
              },
              {
                icon: '🎯',
                title: 'Our Solution',
                desc: 'Gamified task management with streaks, rewards, and social accountability to keep you engaged'
              },
              {
                icon: '🚀',
                title: 'The Result',
                desc: 'Users build lasting productive habits that increase their daily effectiveness by 40%'
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="card-base p-8 text-center group"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-neutral-900">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}