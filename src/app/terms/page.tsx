export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-16 text-gray-800 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1>

      <p className="mb-4">
        Welcome to <strong>Meeezy</strong>. By accessing or using our calendar booking services, you agree to the
        following Terms of Service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Usage</h2>
      <p className="mb-4">
        Our platform allows users to publish availability and receive meeting requests. You agree to use it only
        for lawful purposes and not for spam, fraud, or abuse.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Data Ownership</h2>
      <p className="mb-4">
        You retain ownership of your personal data. We only use it for displaying your availability and managing bookings.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Modifications</h2>
      <p className="mb-4">
        We may modify these terms at any time. Continued use means you accept any changes.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Termination</h2>
      <p className="mb-4">
        We reserve the right to suspend or terminate your access if you misuse the service or violate these terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Contact</h2>
      <p>
        For any questions, email us at{' '}
        <a href="mailto:support@meeezy.com" className="text-blue-600 underline">
          support@meeezy.com
        </a>
        .
      </p>
    </div>
  );
}