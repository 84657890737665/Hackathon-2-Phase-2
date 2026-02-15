'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Navbar } from '@/components/layout/Navbar';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const router = useRouter();

  const validatePassword = (pass: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasNonalphas = /\W/.test(pass);

    if (pass.length < minLength) return 'Password must be at least 8 characters long';
    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas)) {
      return 'Password must contain uppercase, lowercase, numbers, and special characters';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      // Call signup API
      const response = await signUp({
        email,
        password,
        name,
      });

      if (response && response.success) {
        // Signup successful, now automatically sign in
        const signinResponse = await signIn({
          email,
          password
        });

        if (signinResponse && signinResponse.success) {
          router.push('/tasks');
        } else {
          router.push('/signin'); // Fallback if auto-signin fails
        }
      } else {
        console.error('Signup failed:', response?.error || response?.detail);
        setError(response?.error || response?.detail || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <Navbar />
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-modal p-6 sm:p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-2">
              Create Account
            </h1>
            <p className="text-neutral-600">
              Start your productivity journey today
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 rounded-lg border-2 border-neutral-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-lg border-2 border-neutral-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 rounded-lg border-2 border-neutral-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 button-primary mt-6"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-600 mt-6">
            Already have an account?{' '}
            <Link href="/signin" className="text-primary-600 font-medium hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}