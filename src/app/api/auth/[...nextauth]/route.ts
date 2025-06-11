import NextAuth from "next-auth/next"; // ✅ CORRECT
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };