'use client';

import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-white px-6 py-20 text-gray-800 text-center">
      <Image
        src="/images/logo.png"
        alt="meeezy logo"
        width={96}
        height={96}
        className="mx-auto mb-6"
      />
      <h1 className="text-4xl font-bold mb-4">Welcome to meeezy</h1>
      <p className="text-gray-600 mb-8">
        Find the best time to meet — without back-and-forth.
        Let others see your availability and book a slot.
      </p>
      <a
        href="/signup"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
      >
        Get Started
      </a>

      <p className="mt-10 text-sm text-gray-400">
        You&apos;ll love how easy it is.
      </p>
    </main>
  );
}