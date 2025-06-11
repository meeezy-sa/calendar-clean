'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc,
} from 'firebase/firestore';

type Booking = {
  id: string;
  name: string;
  email: string;
  subject: string;
  date: string;
  hour: number;
  status?: 'pending' | 'accepted' | 'declined';
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      if (
        session?.user?.email !== 'mmofaiz@gmail.com' &&
        session?.user?.email !== 'calinder736@gmail.com'
      ) {
        window.location.href = '/';
      } else {
        fetchBookings();
      }
    }
  }, [session, status]);

  const fetchBookings = async () => {
    const q = query(collection(db, 'bookings'), orderBy('date'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];
    setBookings(data);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'bookings', id));
    fetchBookings();
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: 'accepted' | 'declined'
  ) => {
    const bookingRef = doc(db, 'bookings', id);
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;

    await updateDoc(bookingRef, { status: newStatus });

    await fetch('/api/notify-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...booking, status: newStatus }),
    });

    fetchBookings();
  };

  const filtered = bookings.filter((b) =>
    [b.name, b.email, b.subject].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>🔐 Admin Dashboard</h1>

      <input
        type="text"
        placeholder="Search by name, email, or subject..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          margin: '20px 0',
          padding: 10,
          width: '100%',
          maxWidth: 400,
        }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Subject</th>
            <th style={th}>Date</th>
            <th style={th}>Hour</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((b) => (
            <tr key={b.id}>
              <td style={td}>{b.name}</td>
              <td style={td}>{b.email}</td>
              <td style={td}>{b.subject}</td>
              <td style={td}>{b.date}</td>
              <td style={td}>{b.hour}:00</td>
              <td style={td}>{b.status ?? 'pending'}</td>
              <td style={td}>
                <button onClick={() => handleUpdateStatus(b.id, 'accepted')} style={{ marginRight: 5 }}>
                  ✅ Accept
                </button>
                <button onClick={() => handleUpdateStatus(b.id, 'declined')} style={{ marginRight: 5 }}>
                  ❌ Decline
                </button>
                <button onClick={() => handleDelete(b.id)}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { border: '1px solid #ccc', padding: 10, backgroundColor: '#f0f0f0' };
const td = { border: '1px solid #ccc', padding: 10 };