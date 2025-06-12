import { Suspense } from 'react';
import SigninPage from './SigninPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <SigninPage />
    </Suspense>
  );
}