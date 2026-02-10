'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function ProfilePage() {
  const { useSession } = useAuth();
  const session = useSession();
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-8">Profile</h1>

      <div className="bg-white rounded-xl shadow-card p-6 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">Account Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">Name</label>
              <p className="text-neutral-900">{session?.data?.user?.email || 'Not provided'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">Email</label>
              <p className="text-neutral-900">{session?.data?.user?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">Session Expiry</label>
              <p className="text-neutral-900">
                {session?.data?.expiresAt ? new Date(session.data.expiresAt * 1000).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">Account Actions</h2>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              onClick={() => {
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  // In a real app, you would call an API to delete the account
                  alert('Account deletion functionality would be implemented here');
                }
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}