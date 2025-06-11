'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { useSession } from 'next-auth/react';

export default function SystemAdminPage() {
  const { data: session, status } = useSession();
type User = {
  id?: string;
  name?: string;
  email?: string;
  link?: string;
  createdAt?: any;
};

type Booking = {
  id?: string;
  name?: string;
  email?: string;
  subject?: string;
  date?: string;
  hour?: number;
  status?: string;
};

const [users, setUsers] = useState<User[]>([]);
const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      (session?.user?.email === 'mmofaiz@gmail.com' || session?.user?.email === 'calinder736@gmail.com')
    ) {
      fetchData();
    } else if (status === 'authenticated') {
      window.location.href = '/';
    }
  }, [status, session]);

  const fetchData = async () => {
    const usersSnap = await getDocs(collection(db, 'users'));
    const usersData = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(usersData);

    const bookingsSnap = await getDocs(collection(db, 'bookings'));
    const bookingsData = bookingsSnap.docs.map(doc => doc.data());
    setBookings(bookingsData);
  };

  const getUserBookingsCount = (email: string) => {
    return bookings.filter(b => b.email === email).length;
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'users', id));
    fetchData();
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const sortedUsers = filteredUsers.sort((a, b) => {
    const countA = getUserBookingsCount(a.email);
    const countB = getUserBookingsCount(b.email);
    return sortDesc ? countB - countA : countA - countB;
  });

  if (status === 'loading') return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">📊 System Admin Dashboard</h1>

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="px-4 py-2 border rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setSortDesc(!sortDesc)}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sort by Bookings {sortDesc ? '↓' : '↑'}
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">Username</th>
            <th className="border px-4 py-2 text-left">Bookings</th>
            <th className="border px-4 py-2 text-left">Link</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(user => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{getUserBookingsCount(user.email)}</td>
              <td className="border px-4 py-2">
                <a
                  href={`/u/${user.username}`}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  View
                </a>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}