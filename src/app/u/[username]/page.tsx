// src/app/u/[username]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import {
  format,
  startOfToday,
  startOfWeek,
  addDays,
  isBefore,
  parseISO,
  setHours,
} from 'date-fns';

export default function UserBookingPage() {
  const params = useParams();
  const username = params?.username as string;
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; hour: number } | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '' });
  const [submitted, setSubmitted] = useState(false);

  const hours = Array.from({ length: 10 }, (_, i) => 9 + i);
  const today = startOfToday();
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      const qUser = query(collection(db, 'users'), where('username', '==', username));
      const snapshotUser = await getDocs(qUser);
      if (!snapshotUser.empty) {
        const userData = snapshotUser.docs[0].data();
        setUser(userData);

        const qBookings = query(
          collection(db, 'bookings'),
          where('email', '==', userData.email),
          where('status', '==', 'accepted')
        );
        const snapshotBookings = await getDocs(qBookings);
        const data = snapshotBookings.docs.map(doc => doc.data());
        setBookings(data);
      }
    };

    if (username) fetchUserAndBookings();
  }, [username]);

  const isBusy = (date: string, hour: number) => {
    return bookings.some(b => b.date === date && b.hour === hour);
  };

  const handleSubmit = async () => {
    if (!selectedSlot) return;
    const booking = {
      ...formData,
      date: selectedSlot.date,
      hour: selectedSlot.hour,
      status: 'pending',
    };
    try {
      await addDoc(collection(db, 'bookings'), booking);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting:', err);
    }
    setFormData({ name: '', email: '', subject: '' });
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{user?.name}'s Booking Page</h1>

        {/* 📅 Weekly Grid */}
        <table className="w-full border border-gray-300 mb-6">
          <thead>
            <tr>
              <th className="border p-2">Time</th>
              {days.map((day, i) => (
                <th key={i} className="border p-2 text-sm">
                  {format(day, 'EEE dd')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour}>
                <td className="border p-2 font-medium">{hour}:00</td>
                {days.map((day, i) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const busy = isBusy(dateStr, hour);

                  return (
                    <td
                      key={i}
                      className={`border p-2 text-center cursor-pointer transition text-sm ${
                        busy ? 'bg-red-200 text-red-600' : 'bg-green-100 hover:bg-green-200'
                      }`}
                      onClick={() => !busy && setSelectedSlot({ date: dateStr, hour })}
                    >
                      {busy ? 'Busy' : 'Free'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Booking Form */}
        {selectedSlot && !submitted && (
          <div className="bg-gray-100 p-6 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Request Booking</h2>
            <p className="mb-3 text-sm text-gray-600">
              {selectedSlot.date} at {selectedSlot.hour}:00
            </p>
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Subject of Discussion"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full mb-4 px-3 py-2 border rounded"
            />
            <div className="flex gap-4">
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Send
              </button>
              <button onClick={() => setSelectedSlot(null)} className="text-gray-600 px-4 py-2">
                Cancel
              </button>
            </div>
          </div>
        )}

        {submitted && (
          <div className="mt-4 text-green-600">✅ Your booking request has been sent.</div>
        )}
      </div>
    </div>
  );
}