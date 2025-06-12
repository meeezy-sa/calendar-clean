'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';

interface Booking {
  id: string;
  name: string;
  email: string;
  subject: string;
  date: string;
  hour: number;
  status: string;
}

interface UserData {
  name: string;
  email: string;
  username: string;
  createdAt: Timestamp;
}

export default function UserPage() {
  const { username } = useParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const q = query(collection(db, 'users'), where('username', '==', username));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setUser(snapshot.docs[0].data() as UserData);
      }
    };
    fetchUser();
  }, [username]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user?.email) {
        const q = query(collection(db, 'bookings'), where('email', '==', user.email));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];
        setBookings(data);
      }
    };
    fetchBookings();
  }, [user]);

  if (!user) return <p className="p-6">User not found.</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          {user.name}&apos;s Public Booking Page
        </h1>

        <div className="bg-white rounded shadow p-4">
          {bookings.length === 0 ? (
            <p className="text-gray-600">No booking slots available yet.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Hour</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} className="border-t">
                    <td className="py-2 px-4">{b.name}</td>
                    <td className="py-2 px-4">{b.date}</td>
                    <td className="py-2 px-4">{b.hour}:00</td>
                    <td className="py-2 px-4">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}