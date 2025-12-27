import { PublicRequests } from '@/components/requests/PublicRequests';
import { RaktSahayak } from '@/components/RaktSahayak';

export default function Home() {
  return (
    <div className="w-full">
      <PublicRequests />
      <RaktSahayak />
    </div>
  );
}
