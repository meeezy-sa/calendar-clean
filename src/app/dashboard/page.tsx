'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';

type Booking = {
  id: string;
  name: string;
  email: string;
  subject: string;
  date: string;
  hour: number;
  status: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);

  // ✅ Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/signin';
    }
  }, [status]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (session?.user?.email) {
        const q = query(collection(db, 'bookings'), where('email', '==', session.user.email));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];
        setBookings(data);
      }
    };

    if (status === 'authenticated') {
      fetchBookings();
    }
  }, [session, status]);

  const handleStatus = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, 'bookings', id), { status: newStatus });

    await fetch('/api/notify-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...bookings.find(b => b.id === id), status: newStatus }),
    });

    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  if (status === 'loading') return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ✅ Header without avatar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <p className="font-semibold text-gray-800 text-lg">
            Welcome, {session?.user?.name}
          </p>
          <p className="text-sm text-gray-500">Manage your booking requests</p>
        </div>

        <div className="flex flex-col md:flex-row gap-2 items-end md:items-center justify-end text-sm">
          {/* Removed public page link */}
          <button
            onClick={() => signOut()}
            className="text-sm bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </header>

      <h2 className="text-xl font-bold mb-4">📬 Your Booking Requests</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white border rounded shadow">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Hour</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-2">{b.name}</td>
                  <td className="px-4 py-2">{b.email}</td>
                  <td className="px-4 py-2">{b.subject}</td>
                  <td className="px-4 py-2">{b.date}</td>
                  <td className="px-4 py-2">{b.hour}:00</td>
                  <td className="px-4 py-2">{b.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleStatus(b.id, 'accepted')}
                      className="text-green-600 hover:underline"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatus(b.id, 'declined')}
                      className="text-red-600 hover:underline"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}