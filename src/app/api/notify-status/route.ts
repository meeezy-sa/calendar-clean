// ===============================
// 1. /src/app/api/notify-status/route.ts
// ===============================

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  const { name, subject, date, hour, status } = body;

  const ownerEmail = req.headers.get('x-user-email');
  if (!ownerEmail) {
    return NextResponse.json({ error: 'Missing recipient email' }, { status: 400 });
  }

  const emailContent = `
    Hi,

    ${name} requested a booking.

    Subject: ${subject}
    Date: ${date}
    Time: ${hour}:00
    Status: ${status}
  `;

  const data = await resend.emails.send({
    from: 'Meeezy <booking@meeezy.com>',
    to: ownerEmail,
    subject: `📆 Booking ${status.toUpperCase()}`,
    text: emailContent,
  });

  return NextResponse.json(data);
}


// ===============================
// 2. /src/app/u/[username]/page.tsx
// ===============================

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface User {
  name: string;
  email: string;
  link: string;
}

interface Booking {
  name: string;
  email: string;
  subject: string;
  date: string;
  hour: number;
  status: string;
}

export default function UserPage() {
  const params = useParams();
  const username = params.username;

  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    async function fetchUser() {
      const q = query(collection(db, 'users'), where('link', '==', `/u/${username}`));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data() as User;
        setUser(userData);
      }
    }
    fetchUser();
  }, [username]);

  if (!user) return <p className="p-6">User not found.</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {user.name}&apos;s Booking Page
      </h1>
      {/* Booking UI and form here */}
    </div>
  );
}