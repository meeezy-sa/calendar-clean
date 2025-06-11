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
    <p style="color: #999; font-size: 12px;">Sent by meeezy.com</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Meeezzy Booking <booking@meeezy.com>",
      to: email, // ✅ Dynamic recipient
      subject: `📢 Booking ${status === 'accepted' ? 'Accepted' : 'Declined'}`,
      html,
    }),
  });

  const result = await res.json();
  console.log("📤 Status email sent to:", email, result);

  return NextResponse.json({ success: true });
}