import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const { name, email, date, hour, subject } = data;

  const html = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>Your booking request has been received.</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Hour:</strong> ${hour}:00</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p>You’ll get a reply soon!</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Meeezy Booking <booking@meeezy.com>",
      to: email, // ✅ Send directly to requester
      subject: "✅ Booking Request Received",
      html,
    }),
  });

  const result = await res.json();
  console.log("📤 Confirmation sent to requester:", result);

  return NextResponse.json({ success: true });
}