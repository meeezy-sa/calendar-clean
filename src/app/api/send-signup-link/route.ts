import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, link } = await req.json();

  const html = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thanks for signing up!</p>
    <p>Your personal booking link is:</p>
    <p><a href="https://meeezy.com${link}" target="_blank">https://meeezy.com${link}</a></p>
    <p>You can share this link with anyone to let them book time with you.</p>
    <br />
    <p>– The Meeezy Team</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Meeezy <booking@meeezy.com>",
      to: email,
      subject: "🎉 Your Booking Link is Ready!",
      html,
    }),
  });

  const result = await res.json();
  console.log("📤 Signup email sent:", result);

  return NextResponse.json({ success: true });
}