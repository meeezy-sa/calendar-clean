export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-16 text-gray-800 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>

      <p className="mb-4">
        At <strong>Meeezy</strong>, we take your privacy seriously. This Privacy Policy explains how we collect,
        use, and protect your personal information when you use our calendar booking service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <ul className="list-disc pl-5 mb-4 space-y-2">
        <li>Your name and email address during signup</li>
        <li>Optional information provided during booking</li>
        <li>Authentication information via Google</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Data</h2>
      <p className="mb-4">
        We only use your information to help people view your availability and book a meeting. We do not sell
        or share your data with third parties.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Protection</h2>
      <p className="mb-4">
        All data is stored securely using Google Firebase and protected by best practices.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p>
        If you have any questions about your privacy, please contact us at{' '}
        <a href="mailto:support@meeezy.com" className="text-blue-600 underline">
          support@meeezy.com
        </a>
        .
      </p>
    </div>
  );
}