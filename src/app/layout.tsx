import './globals.css';
import ClientSessionProvider from '@/components/ClientSessionProvider';

export const metadata = {
  title: 'Meeezy — Book Meetings Without Back-and-Forth',
  description: 'Meeezy lets you share your calendar availability and receive booking requests — simple, fast, and private.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800 antialiased">
        <ClientSessionProvider>{children}</ClientSessionProvider>
      </body>
    </html>
  );
}