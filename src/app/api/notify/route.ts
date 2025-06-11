import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const { name, email, subject, date, hour } = data;

  console.log("📬 Notification request received:", data);

  // 1️⃣ رسالة إلى الإدارة
  const adminRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Majid Booking <booking@meeezy.com>",
      to: "mmofaiz@gmail.com",
      subject: "📬 New Booking Request",
      html: `
        <p><strong>${name}</strong> (${email}) requested a booking:</p>
        <ul>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Hour:</strong> ${hour}:00</li>
          <li><strong>Subject:</strong> ${subject}</li>
        </ul>
      `,
    }),
  });

  const adminResult = await adminRes.json();
  console.log("📩 Sent to admin:", adminResult);

  // 2️⃣ نسخة تأكيد للمستخدم (موجهة لك فقط)
  const userRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Majid Booking <booking@meeezy.com>",
      to: "mmofaiz@gmail.com", // TEST COPY ONLY
      subject: "✅ Booking Confirmation (Test Copy)",
      html: `
        <p>This is a test confirmation intended for <strong>${email}</strong></p>
        <p>Hi <strong>${name}</strong>,<br/>
        Your booking request has been received with the following details:</p>
        <ul>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Hour:</strong> ${hour}:00</li>
          <li><strong>Subject:</strong> ${subject}</li>
        </ul>
      `,
    }),
  });

  const userResult = await userRes.json();
  console.log("✅ Sent confirmation to user (TEST):", userResult);

  return NextResponse.json({
    success: true,
    admin: adminResult,
    user: userResult,
  });
}