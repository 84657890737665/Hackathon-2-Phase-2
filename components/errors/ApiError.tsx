'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ApiErrorProps {
  statusCode: number;
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}

export default function ApiError({ 
  statusCode, 
  title = 'Something went wrong', 
  message = 'An unexpected error occurred',
  showHomeButton = true 
}: ApiErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(`API Error ${statusCode}: ${message}`);
  }, [statusCode, message]);

  const handleGoHome = () => {
    router.push('/');
  };

  const statusMessages: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Page Not Found',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
  };

  const statusMessage = statusMessages[statusCode] || 'Unexpected Error';

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold text-primary-600 mb-4">{statusCode}</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{statusMessage}</h1>
        <p className="text-gray-600 mb-8">{message}</p>
        
        {showHomeButton && (
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-gradient-button text-white font-medium rounded-lg hover:shadow-md transition-all"
          >
            Go to Homepage
          </button>
        )}
      </div>
    </div>
  );
}