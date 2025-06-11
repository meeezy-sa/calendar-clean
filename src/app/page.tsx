'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center max-w-2xl">
        <Image
          src="/images/logo.png"
          alt="meeezy logo"
          width={100}
          height={100}
          className="mx-auto mb-6"
        />

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
          Welcome to <span className="text-blue-600">meeezy</span>
        </h1>

        <p className="text-gray-600 text-lg mb-10">
          Find the best time to meet — without back-and-forth. Let others see your availability and book a slot.
        </p>

        <div className="flex flex-col items-center gap-4 mb-10">
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>

          <Link
            href="/signin"
            className="text-gray-600 underline text-lg hover:text-blue-600 transition"
          >
            Sign In
          </Link>
        </div>

        <p className="text-sm text-gray-400">You'll love how easy it is.</p>
      </div>
    </main>
  );
}