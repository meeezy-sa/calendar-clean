import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  console.log("🧠 SESSION FROM SERVER:", session);

  return NextResponse.json({ session });
}