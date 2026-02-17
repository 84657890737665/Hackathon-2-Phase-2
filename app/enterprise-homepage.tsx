'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EnterpriseHomepage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Work <span className="text-primary-600">Simplified</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-neutral-600 max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Taskflow transforms chaotic work into focused execution, empowering teams to achieve more with less effort through intelligent automation and performance insights.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link 
                href="/signup" 
                className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link 
                href="/demo" 
                className="px-8 py-4 bg-white text-neutral-700 font-semibold rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-all duration-300"
              >
                See How It Works
              </Link>
            </motion.div>
            
            {/* Dashboard Preview */}
            <motion.div 
              className="max-w-5xl mx-auto rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-6 border-b border-neutral-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-sm text-neutral-500">taskflow.works/dashboard</div>
                </div>
              </div>
              <div className="bg-white p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Metric Cards */}
                  <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                    <div className="text-2xl font-bold text-primary-600">87%</div>
                    <div className="text-sm text-neutral-600">Deadline Reliability</div>
                  </div>
                  <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                    <div className="text-2xl font-bold text-success-600">12.4</div>
                    <div className="text-sm text-neutral-600">Tasks/Week Avg</div>
                  </div>
                  <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                    <div className="text-2xl font-bold text-warning-600">7</div>
                    <div className="text-sm text-neutral-600">Day Streak</div>
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Task List */}
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-4">Today's Priorities</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                        <div className="w-5 h-5 rounded border border-neutral-300 flex items-center justify-center"></div>
                        <span className="text-neutral-800">Review Q1 roadmap with team</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                        <div className="w-5 h-5 rounded border border-neutral-300 flex items-center justify-center">
                          <div className="w-3 h-3 bg-primary-600 rounded-sm"></div>
                        </div>
                        <span className="text-neutral-800 line-through text-neutral-400">Prepare investor presentation</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                        <div className="w-5 h-5 rounded border border-neutral-300 flex items-center justify-center"></div>
                        <span className="text-neutral-800">Update API documentation</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Assistant */}
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-4">AI Assistant</h3>
                    <div className="bg-gradient-to-br from-primary-50 to-accent-50 border border-neutral-200 rounded-xl p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm">🤖</div>
                        <div>
                          <p className="text-sm text-neutral-700">Based on your calendar and task patterns, I recommend focusing on the roadmap review first. It's connected to 3 other pending tasks.</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs bg-white border border-neutral-200 rounded-lg px-3 py-1.5 hover:bg-neutral-100">Reschedule for tomorrow</button>
                        <button className="text-xs bg-primary-600 text-white rounded-lg px-3 py-1.5 hover:bg-primary-700">Start now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Value Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Designed for Execution</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Taskflow eliminates friction in task management with intelligent automation and performance insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Clarity</h3>
              <p className="text-neutral-600">
                AI-powered prioritization surfaces the tasks that matter most for your goals
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Focus</h3>
              <p className="text-neutral-600">
                Minimize distractions with clean interfaces and intelligent notifications
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Accountability</h3>
              <p className="text-neutral-600">
                Performance metrics that drive results, not gamified points
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">AI Assistance</h3>
              <p className="text-neutral-600">
                Predictive insights that anticipate bottlenecks before they occur
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">From Chaos to Clarity</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Taskflow streamlines your workflow with intelligent automation
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Capture Tasks</h3>
              <p className="text-neutral-600">
                Add tasks with natural language or structured inputs
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">AI Prioritizes</h3>
              <p className="text-neutral-600">
                Our algorithms analyze deadlines, dependencies, and patterns
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Execute Focus</h3>
              <p className="text-neutral-600">
                Work through prioritized tasks with minimal distractions
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">4</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Measure Results</h3>
              <p className="text-neutral-600">
                Performance metrics show real impact on productivity
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enterprise Trust Signals */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Enterprise-Ready Platform</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Built for security, scalability, and compliance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Security First</h3>
              <p className="text-neutral-600 mb-4">
                SOC 2 compliant infrastructure with end-to-end encryption and role-based access controls
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center gap-2"><span>✓</span> Two-factor authentication</li>
                <li className="flex items-center gap-2"><span>✓</span> Single sign-on (SSO)</li>
                <li className="flex items-center gap-2"><span>✓</span> Audit trails</li>
                <li className="flex items-center gap-2"><span>✓</span> Data encryption</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Reliable Performance</h3>
              <p className="text-neutral-600 mb-4">
                99.9% uptime SLA with sub-200ms response times for enterprise-scale datasets
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center gap-2"><span>✓</span> Global CDN</li>
                <li className="flex items-center gap-2"><span>✓</span> Auto-scaling infrastructure</li>
                <li className="flex items-center gap-2"><span>✓</span> Real-time sync</li>
                <li className="flex items-center gap-2"><span>✓</span> 99.9% uptime guarantee</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Scale Effortlessly</h3>
              <p className="text-neutral-600 mb-4">
                From startups to enterprises, our platform adapts to your team's needs
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center gap-2"><span>✓</span> Unlimited projects</li>
                <li className="flex items-center gap-2"><span>✓</span> Team collaboration</li>
                <li className="flex items-center gap-2"><span>✓</span> API access</li>
                <li className="flex items-center gap-2"><span>✓</span> Custom integrations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">AI-Powered Productivity Assistant</h2>
              <p className="text-xl text-neutral-600 mb-6">
                Taskflow's AI doesn't just track your tasks—it anticipates your needs and guides your execution.
              </p>
              <ul className="space-y-4 text-neutral-600">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">🤖</div>
                  <span>Predicts which tasks will impact your deadlines most</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">🔍</div>
                  <span>Identifies potential bottlenecks before they occur</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">⚡</div>
                  <span>Suggests optimal task ordering based on dependencies</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">📊</div>
                  <span>Provides actionable insights to improve team performance</span>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 bg-white border border-neutral-200 rounded-2xl p-6 shadow-lg">
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white flex-shrink-0">🤖</div>
                  <div>
                    <div className="font-medium text-neutral-900">Taskflow Assistant</div>
                    <div className="mt-2 text-neutral-700">
                      I've analyzed your upcoming tasks and identified that the API documentation update is blocking 3 other tasks scheduled for next week. I recommend prioritizing this today.
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button className="text-sm bg-white border border-neutral-200 rounded-lg px-4 py-2 hover:bg-neutral-100">Schedule for today</button>
                      <button className="text-sm bg-primary-600 text-white rounded-lg px-4 py-2 hover:bg-primary-700">Learn more</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Simplify Your Work?</h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Join thousands of teams who have transformed their productivity with Taskflow
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/signup" 
              className="px-8 py-4 bg-white text-primary-700 font-semibold rounded-lg shadow-lg hover:bg-primary-50 transition-all duration-300 hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/contact-sales" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}