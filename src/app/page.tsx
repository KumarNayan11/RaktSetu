import { Suspense } from 'react';
import { PublicRequests } from '@/components/requests/PublicRequests';
import { RaktSahayak } from '@/components/RaktSahayak';

export default function Home() {
  return (
    <div className="w-full">
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        <PublicRequests />
        <RaktSahayak />
      </Suspense>
    </div>
  );
}