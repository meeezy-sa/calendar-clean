import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const { name, email, date, hour, subject, status } = data;

  const message =
    status === 'accepted'
      ? `✅ Your booking on ${date} at ${hour}:00 has been accepted.`
      : `❌ Your booking on ${date} at ${hour}:00 has been declined.`;

  const html = `
    <p>Dear <strong>${name}</strong>,</p>
    <p>${message}</p>
    <p>Here are the booking details:</p>
    <ul>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Hour:</strong> ${hour}:00</li>
      <li><strong>Subject:</strong> ${subject}</li>
    </ul>
    <p>If you have any questions, feel free to reach out.</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Majid Booking <booking@meeezy.com>",
      to: email, // ✅ نستخدم الإيميل القادم من الحجز
      subject: `📢 Booking ${status === 'accepted' ? 'Accepted' : 'Declined'}`,
      html,
    }),
  });

  const result = await res.json();
  console.log("📤 Status email sent:", result);

  return NextResponse.json({ success: true });
}