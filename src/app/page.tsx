'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12 text-gray-800 flex items-center justify-center">
      <div className="max-w-3xl w-full text-center px-4">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight leading-tight">
          Welcome to <span className="text-blue-600">meeezy</span>
        </h1>

<img
  src="/images/logo.png"
  alt="meeezy logo"
  className="h-12 w-auto max-w-[100px] mx-auto mb-6 object-contain"
/>

        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto">
          The easiest way to share your availability and get booked without back-and-forth messages.
        </p>

        <Link
          href="/signup"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Get Started
        </Link>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">📅 Simple Scheduling</h3>
            <p className="text-gray-600 text-sm">
              Create your own calendar link and let others see when you're free.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">⚡ Fast Booking</h3>
            <p className="text-gray-600 text-sm">
              Others can request a slot with just a click. No need for endless emails.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">🌐 Your Own Link</h3>
            <p className="text-gray-600 text-sm">
              Share your public booking link like <code>/u/yourname</code> anywhere.
            </p>
          </div>
        </div>

        <div className="mt-16 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} meeezy. All rights reserved.
        </div>
      </div>
    </div>
  );
}