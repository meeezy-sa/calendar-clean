import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  const {
    name,
    email,
    subject,
    date,
    hour,
    status,
    ownerEmail,
  } = body;

  if (!ownerEmail) {
    return NextResponse.json({ error: 'Missing owner email' }, { status: 400 });
  }

  const message = `
    <p>Hi,</p>
    <p><strong>${name}</strong> has made a booking request.</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Hour:</strong> ${hour}:00</p>
    <p><strong>Status:</strong> ${status}</p>
  `;

  try {
    const data = await resend.emails.send({
      from: 'Majid Booking <booking@meeezy.com>',
      to: ownerEmail,
      subject: `📅 Booking Status Update: ${status}`,
      html: message,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}