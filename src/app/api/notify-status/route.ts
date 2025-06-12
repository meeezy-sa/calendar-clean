// ✅ /src/app/api/notify-status/route.ts

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const data = await req.json();

  const { name, email, date, hour, status } = data;

  const subject = `📢 Booking ${status === 'accepted' ? 'Accepted' : 'Declined'}`;
  const body = `
    <p>Hello ${name},</p>
    <p>Your booking request for <strong>${date} at ${hour}:00</strong> was <strong>${status}</strong>.</p>
    <p>Thank you!</p>
  `;

  try {
    const result = await resend.emails.send({
      from: 'Meeezy Booking <booking@meeezy.com>',
      to: [email],
      subject,
      html: body,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ error: 'Email failed to send' }, { status: 500 });
  }
}