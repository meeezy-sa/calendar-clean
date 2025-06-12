'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SigninPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded shadow max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Sign in to Meeezy</h1>

        {error && (
          <p className="mb-4 text-red-600 text-sm">⚠️ {error}</p>
        )}

        <button
          onClick={() => signIn('google')}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}