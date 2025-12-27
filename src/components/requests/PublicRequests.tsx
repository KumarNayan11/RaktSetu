'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, onSnapshot, orderBy, where, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BloodRequest, Hospital } from '@/lib/types';
import { RequestCard } from './RequestCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TypewriterEffect } from '@/components/effects/TypewriterEffect';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;


function SpecificRequestViewer({ requestId }: { requestId: string }) {
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    const docRef = doc(db, 'bloodRequests', requestId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setRequest({ id: docSnap.id, ...docSnap.data() } as BloodRequest);
      } else {
        setError('The request you are looking for could not be found or may have been deleted.');
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError('An error occurred while fetching the request.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [requestId]);

  if (loading) {
    return <Skeleton className="h-64 max-w-sm mx-auto rounded-lg" />;
  }
  
  if (error) {
     return (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Not Found</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
     )
  }

  if (!request) {
    return null;
  }

  return (
    <div className="max-w-sm mx-auto">
        <RequestCard request={request} />
    </div>
  );
}


function AllRequestsViewer() {
    const [requests, setRequests] = useState<BloodRequest[]>([]);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSecondLine, setShowSecondLine] = useState(false);
    
    const [filterHospital, setFilterHospital] = useState<string>('all');
    const [filterBloodGroup, setFilterBloodGroup] = useState<string>('all');
    const [isFilterOpen, setFilterOpen] = useState(false);

    useEffect(() => {
        const fetchHospitals = async () => {
            if (!db) return;
            const q = query(collection(db, 'hospitals'), where('status', '==', 'active'));
            const snapshot = await getDocs(q);
            setHospitals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hospital)));
        }
        fetchHospitals();
    }, [])

    useEffect(() => {
        if (!db) {
            setError('Could not connect to the database.');
            setLoading(false);
            return;
        };
        
        let q;
        const isHospitalFiltered = filterHospital && filterHospital !== 'all';
        const isBloodGroupFiltered = filterBloodGroup && filterBloodGroup !== 'all';

        if (isHospitalFiltered && isBloodGroupFiltered) {
            q = query(collection(db, 'bloodRequests'), 
                where('hospitalId', '==', filterHospital),
                where('bloodGroup', '==', filterBloodGroup),
                orderBy('createdAt', 'desc')
            );
        } else if (isHospitalFiltered) {
            q = query(collection(db, 'bloodRequests'), 
                where('hospitalId', '==', filterHospital),
                orderBy('createdAt', 'desc')
            );
        } else if (isBloodGroupFiltered) {
            q = query(collection(db, 'bloodRequests'), 
                where('bloodGroup', '==', filterBloodGroup),
                orderBy('createdAt', 'desc')
            );
        } else {
            q = query(collection(db, 'bloodRequests'), orderBy('createdAt', 'desc'));
        }
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BloodRequest)).filter(req => req.status === 'open'));
            setLoading(false);
            setError(null); // Clear previous errors
        }, (err) => {
            console.error(err);
            // Provide a more specific error message if it's a permissions/index issue
            if (err.message.includes("permission-denied") || err.message.includes("requires an index")) {
               setError("The query is not supported by the database rules. This usually means a composite index is required. The Firestore rules may need to be deployed and given a moment to propagate.");
            } else {
               setError('Failed to fetch blood requests. Please check your network connection.');
            }
            setLoading(false);
        });

        const timer = setTimeout(() => {
            setShowSecondLine(true);
        }, 1500); // Delay for the second line

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
    }, [filterHospital, filterBloodGroup]);

    const clearFilters = () => {
        setFilterHospital('all');
        setFilterBloodGroup('all');
    }
    
    const selectedHospital = useMemo(() => {
        if (!filterHospital || filterHospital === 'all') return null;
        return hospitals.find(h => h.id === filterHospital);
    }, [filterHospital, hospitals])

    const hasFilters = filterHospital !== 'all' || filterBloodGroup !== 'all';
    
    if (loading) {
        return (
        <div className="space-y-8">
            <div className="h-24" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
            </div>
        </div>
        );
    }

    if (error) {
        return (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Error Fetching Data</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
        );
    }

    return (
        <div>
            <div className="relative text-center mb-12">
                 <div className="h-10 flex items-center justify-center mb-4">
                    <TypewriterEffect 
                        text="Bridging Emergency Blood Needs Responsibly" 
                        className="text-red-700 font-mono tracking-wide"
                    />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight font-headline">
                Live Blood Requests
                </h1>
                <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto animate-fade-in-up">
                    Your contribution can save a life.
                    <span className={`block transition-opacity duration-1000 ${showSecondLine ? 'opacity-100' : 'opacity-0'}`}>
                        Find active requests from verified hospitals below.
                    </span>
                </p>
            </div>
            
            <div className="flex justify-center mb-6">
                 <Popover open={isFilterOpen} onOpenChange={setFilterOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Filter Requests
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Filters</h4>
                                <p className="text-sm text-muted-foreground">
                                Find specific blood requests.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="hospital">Hospital</Label>
                                <Select value={filterHospital} onValueChange={setFilterHospital}>
                                    <SelectTrigger id="hospital" className="col-span-2 h-8">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {hospitals.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="blood-group">Blood Group</Label>
                                <Select value={filterBloodGroup} onValueChange={setFilterBloodGroup}>
                                    <SelectTrigger id="blood-group" className="col-span-2 h-8">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {bloodGroups.map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                </div>
                            </div>
                             <Button onClick={() => setFilterOpen(false)}>Done</Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            
            {hasFilters && (
                 <div className="flex justify-center items-center gap-2 mb-6 text-sm text-muted-foreground">
                    <span>Filtering by:</span>
                    {selectedHospital && <Badge variant="secondary">{selectedHospital.name}</Badge>}
                    {filterBloodGroup !== 'all' && <Badge variant="secondary">{filterBloodGroup}</Badge>}
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto px-2 py-1">
                        <X className="h-3 w-3 mr-1" />
                        Clear
                    </Button>
                 </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                ))}
            </div>

            {requests.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
                    <h2 className="text-2xl font-semibold">No Active Requests Found</h2>
                    <p className="mt-2 text-muted-foreground">
                        {hasFilters ? "Try adjusting or clearing your filters." : "Please check back later."}
                    </p>
                </div>
            )}
        </div>
    );
}

export function PublicRequests() {
    const searchParams = useSearchParams();
    const requestId = searchParams.get('requestId');

    if (requestId) {
        return (
            <div>
                 <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight font-headline">
                        Verifying Request
                    </h1>
                    <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
                        You are viewing a specific request. Check its status and details below.
                    </p>
                </div>
                <SpecificRequestViewer requestId={requestId} />
                <div className="text-center mt-8">
                    <Button asChild variant="outline">
                        <Link href="/">View All Live Requests</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return <AllRequestsViewer />
}
