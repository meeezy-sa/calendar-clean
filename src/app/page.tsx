'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Image
        src="/images/logo.png"
        alt="meeezy logo"
        width={120}
        height={120}
        className="mb-6"
      />

      <main className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Meeezy</h1>
        <p className="text-gray-600 mb-8">
          A smart way to share your calendar availability and receive bookings effortlessly.
        </p>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => router.push('/signup')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </button>

          <button
            onClick={() => router.push('/signin')}
            className="text-sm text-blue-600 hover:underline"
          >
            Already have an account? Sign In
          </button>
        </div>
      </main>

      <footer className="mt-16 text-center text-sm text-gray-400">
        <p>
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>{' '}
          ·{' '}
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
        </p>
        <p className="mt-2">&copy; {new Date().getFullYear()} Meeezy. All rights reserved.</p>
      </footer>
    </div>
  );
}