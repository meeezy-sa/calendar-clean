'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from 'firebase/firestore';
import {
  format,
  startOfWeek,
  addDays,
} from 'date-fns';

type Booking = {
  id?: string;
  name: string;
  email: string;
  subject: string;
  date: string;
  hour: number;
  status: string;
};

type User = {
  name: string;
  email: string;
  link?: string;
 createdAt?: string | Date;
};

export default function UserCalendarPage() {
  const params = useParams();
  const username = params?.username as string;

  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; hour: number } | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '' });
  const [submitted, setSubmitted] = useState(false);

  const hours = Array.from({ length: 10 }, (_, i) => 9 + i);
  const days = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i)
  );

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      try {
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
          const bookingData = snapshotBookings.docs.map(doc => doc.data() as Booking);
          setBookings(bookingData);
        }
      } catch (error) {
        console.error('Error loading user/bookings:', error);
      } finally {
        setLoading(false);
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
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Booking error:', err);
    }

    setFormData({ name: '', email: '', subject: '' });
    setSelectedSlot(null);
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!user) return <p className="p-6 text-center text-red-500">User not found.</p>;

  return (
    <div className="min-h-screen bg-white px-4 py-10 text-gray-800">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-500">You can book a 30-min slot with me below</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto border-collapse w-full text-sm shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-50">
              <th className="border px-4 py-2 text-left">Time</th>
              {days.map((day, i) => (
                <th key={i} className="border px-4 py-2 text-center">
                  {format(day, 'EEE dd')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour}>
                <td className="border px-4 py-2 text-center font-semibold">{hour}:00</td>
                {days.map((day, i) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const busy = isBusy(dateStr, hour);
                  return (
                    <td
                      key={i}
                      className={`border px-4 py-2 text-center cursor-pointer transition ${
                        busy ? 'bg-red-200 text-red-700' : 'bg-green-100 hover:bg-green-200'
                      }`}
                      onClick={() => {
                        if (!busy) {
                          setSelectedSlot({ date: dateStr, hour });
                          setSubmitted(false);
                        }
                      }}
                    >
                      {busy ? '🛑 Busy' : '✅ Free'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSlot && !submitted && (
        <div className="mt-10 max-w-md mx-auto bg-white border p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-center">Step 2: Request a Booking</h2>
          <p className="mb-4 text-center text-gray-600">{selectedSlot.date} at {selectedSlot.hour}:00</p>

          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full mb-3 px-3 py-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full mb-3 px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Subject of Discussion"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full mb-4 px-3 py-2 border rounded"
            required
          />

          <div className="flex justify-between">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
            <button
              onClick={() => setSelectedSlot(null)}
              className="text-gray-600 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="mt-6 text-center text-green-600 font-medium">
          ✅ Your request has been sent. You’ll hear from us soon.
        </div>
      )}
    </div>
  );
}