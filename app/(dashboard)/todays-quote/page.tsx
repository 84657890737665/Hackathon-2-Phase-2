'use client';

import { useState, useEffect } from 'react';

export default function TodaysQuotePage() {
  const [quote, setQuote] = useState({
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  });

  // In a real app, this would fetch from an API
  useEffect(() => {
    // Simulate fetching a daily quote
    const quotes = [
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
      },
      {
        text: "Life is what happens to you while you're busy making other plans.",
        author: "John Lennon"
      },
      {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
      },
      {
        text: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle"
      },
      {
        text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
        author: "Ralph Waldo Emerson"
      }
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-sm border border-indigo-100">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Today's Inspiration</h1>
        
        <div className="text-center">
          <blockquote className="text-2xl italic text-gray-700 mb-6">
            "{quote.text}"
          </blockquote>
          
          <cite className="text-lg text-gray-600 font-semibold">
            — {quote.author}
          </cite>
        </div>
        
        <div className="mt-10 flex justify-center">
          <div className="bg-white p-4 rounded-xl shadow-inner border border-indigo-100">
            <p className="text-gray-600 text-center">
              Take a moment to reflect on today's wisdom and carry it forward in your journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}