// middleware.ts

import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/signin', // redirect if not authenticated
  },
});

export const config = {
  matcher: ['/dashboard'], // protect only /dashboard route
};