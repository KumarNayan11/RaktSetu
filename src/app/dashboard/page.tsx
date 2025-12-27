
'use client';

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Hospital } from '@/lib/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardClient = dynamic(
  () => import('@/components/dashboard/DashboardClient').then((mod) => mod.DashboardClient),
  {
    ssr: false,
    loading: () => (
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Skeleton className="h-96 w-full" />
        </div>
        <div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    ),
  }
);

async function getActiveHospitals(): Promise<Hospital[]> {
    if (!db) return [];
    const hospitalsCol = collection(db, 'hospitals');
    const q = query(hospitalsCol, where('status', '==', 'active'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Hospital[];
}

export default function DashboardPage() {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getActiveHospitals().then(fetchedHospitals => {
            setHospitals(fetchedHospitals);
            setLoading(false);
        });
    }, []);

    if (loading) {
         return (
            <div>
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-primary tracking-tight font-headline">
                    Hospital Dashboard
                    </h1>
                    <p className="mt-2 text-lg text-foreground/80">
                    Create and manage blood requests for your hospital.
                    </p>
                </div>
                 <div className="grid md:grid-cols-2 gap-8">
                    <div>
                    <Skeleton className="h-96 w-full" />
                    </div>
                    <div>
                    <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (hospitals.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <Alert className="max-w-lg text-center">
                    <Info className="h-4 w-4" />
                    <AlertTitle>No Active Hospitals Found</AlertTitle>
                    <AlertDescription>
                        There are no active hospitals available to create a blood request for.
                        Please go to the admin panel to add and activate a hospital first.
                        <div className="mt-4">
                            <Button asChild>
                                <Link href="/admin/hospitals">Go to Admin Panel</Link>
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
         <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-primary tracking-tight font-headline">
                Hospital Dashboard
                </h1>
                <p className="mt-2 text-lg text-foreground/80">
                Create and manage blood requests for your hospital.
                </p>
            </div>
            <DashboardClient hospitals={hospitals} />
        </div>
    );
}
