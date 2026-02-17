'use client';

import { motion } from 'framer-motion';

export function AIInsightsPanel() {
  // Mock AI insights data - in a real implementation, this would come from an API
  const insights = [
    {
      id: 1,
      title: "Productivity Pattern",
      description: "You're 23% more productive on Mondays. Consider scheduling important tasks early in the week.",
      priority: "high"
    },
    {
      id: 2,
      title: "Deadline Optimization", 
      description: "Your completion rate drops by 15% when tasks have no deadlines. Adding due dates could improve execution.",
      priority: "medium"
    },
    {
      id: 3,
      title: "Task Type Efficiency",
      description: "You complete creative tasks 31% faster than analytical tasks. Consider grouping similar task types together.",
      priority: "low"
    }
  ];

  return (
    <motion.div 
      className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🤖</span>
        <h3 className="font-semibold text-neutral-800">AI Insights</h3>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className={`p-3 rounded-lg border-l-2 ${
              insight.priority === 'high' ? 'border-red-500 bg-red-50' :
              insight.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
              'border-blue-500 bg-blue-50'
            }`}
          >
            <h4 className="font-medium text-neutral-800 text-sm">{insight.title}</h4>
            <p className="text-xs text-neutral-600 mt-1">{insight.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-neutral-100">
        <button className="w-full py-2 text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors">
          View Detailed Analysis →
        </button>
      </div>
    </motion.div>
  );
}