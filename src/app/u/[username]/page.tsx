// src/app/u/[username]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {
  addDays,
  format,
  startOfToday,
} from 'date-fns';

interface Booking {
  date: string;
  hour: number;
  status: string;
}

interface User {
  name: string;
  email: string;
}

export default function PublicBookingPage() {
  const params = useParams();
  const username = params?.username as string;

  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selected, setSelected] = useState<{ date: string; hour: number } | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const today = startOfToday();
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const hours = Array.from({ length: 10 }, (_, i) => 9 + i);

  useEffect(() => {
    const fetchUser = async () => {
      const qUser = query(collection(db, 'users'), where('username', '==', username));
      const snapshotUser = await getDocs(qUser);
      if (!snapshotUser.empty) {
        const userData = snapshotUser.docs[0].data() as User;
        setUser(userData);

        const qBookings = query(
          collection(db, 'bookings'),
          where('email', '==', userData.email),
          where('status', '==', 'accepted')
        );
        const snapshotBookings = await getDocs(qBookings);
        const bookingData = snapshotBookings.docs.map(doc => doc.data()) as Booking[];
        setBookings(bookingData);
      }
      setLoading(false);
    };
    if (username) fetchUser();
  }, [username]);

  const isBusy = (date: string, hour: number) => {
    return bookings.some(b => b.date === date && b.hour === hour);
  };

  const handleSubmit = async () => {
    if (!selected || !user) return;
    const booking = {
      ...formData,
      date: selected.date,
      hour: selected.hour,
      status: 'pending',
    };
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...booking, to: user.email }),
      });
    } catch (err) {
      console.error('Email error', err);
    }
    setSubmitted(true);
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6">User not found.</p>;

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold mb-2">
        {user.name}&apos;s Booking Page
      </h1>
      <p className="mb-4 text-gray-600">Email: {user.email}</p>

      <table className="w-full text-sm border border-black mb-4">
        <thead>
          <tr>
            <th className="border px-2 py-1">Time</th>
            {days.map((day, i) => (
              <th key={i} className="border px-2 py-1">
                {format(day, 'EEE dd')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map(hour => (
            <tr key={hour}>
              <td className="border px-2 py-1 text-center">{hour}:00</td>
              {days.map((day, i) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const busy = isBusy(dateStr, hour);
                return (
                  <td
                    key={i}
                    className={`border px-2 py-1 text-center cursor-pointer ${
                      busy ? 'bg-red-200 text-red-700' : 'hover:bg-green-100'
                    }`}
                    onClick={() => {
                      if (!busy) {
                        setSelected({ date: dateStr, hour });
                        setSubmitted(false);
                      }
                    }}
                  >
                    {busy ? 'Busy' : 'Free'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {selected && !submitted && (
        <div className="max-w-md bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Request Booking</h2>
          <p className="mb-2 text-gray-600">
            {selected.date} at {selected.hour}:00
          </p>

          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full border px-2 py-1 mb-2"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full border px-2 py-1 mb-2"
          />
          <input
            type="text"
            placeholder="Subject of Discussion"
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
            className="w-full border px-2 py-1 mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Send
            </button>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-600 px-4 py-1 border rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <p className="mt-4 text-green-600 font-medium">
          ✅ Your request has been sent!
        </p>
      )}
    </div>
  );
}