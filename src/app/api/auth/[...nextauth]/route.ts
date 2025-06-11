import NextAuth from "next-auth/next"; // ✅ CORRECT
import type { NextAuthOptions } from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };