// ✅ /src/app/api/notify/route.ts

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const data = await req.json();
  const { name, email, subject, date, hour, username } = data;

  const ownerQuery = query(collection(db, 'users'), where('username', '==', username));
  const snapshot = await getDocs(ownerQuery);
  const owner = snapshot.docs[0]?.data();

  const userMessage = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thanks for booking with me!</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Hour:</strong> ${hour}:00</p>
    <p><strong>Subject:</strong> ${subject}</p>
  `;

  const ownerMessage = `
    <p><strong>${name}</strong> just booked a meeting with you.</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Hour:</strong> ${hour}:00</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Email:</strong> ${email}</p>
  `;

  try {
    await resend.emails.send({
      from: 'Meeezy <booking@meeezy.com>',
      to: [email],
      subject: '✅ Booking Request Received',
      html: userMessage,
    });

    if (owner?.email) {
      await resend.emails.send({
        from: 'Meeezy <booking@meeezy.com>',
        to: [owner.email],
        subject: '📥 New Booking Received',
        html: ownerMessage,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Email failed to send' }, { status: 500 });
  }
}