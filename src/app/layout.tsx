import './globals.css';
import ClientSessionProvider from '@/components/ClientSessionProvider';

export const metadata = {
  title: 'Calendar Booking App',
  description: 'MVP by Majid',
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