'use client';

import { useState, useEffect, useTransition } from 'react';
import { collection, query, onSnapshot, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';
import type { BloodRequest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { formatDistanceToNow } from 'date-fns';
import { closeBloodRequest, deleteBloodRequest } from '@/lib/actions';
import { EditRequestDialog } from './EditRequestDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '../ui/button';


function DeleteRequestDialog({ requestId }: { requestId: string }) {
    const [isDeleting, startDeleteTransition] = useTransition();
    const { toast } = useToast();

    const handleDelete = () => {
        startDeleteTransition(async () => {
            const result = await deleteBloodRequest(requestId);
            if (result.success) {
                toast({ title: "Success", description: "Request has been deleted." });
            } else {
                toast({ variant: "destructive", title: "Error", description: result.error });
            }
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Delete Request</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the blood request.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


export function RequestList({ hospitalId }: { hospitalId: string }) {
    const [requests, setRequests] = useState<BloodRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (!hospitalId || !db) {
            setLoading(false);
            return;
        }
        const q = query(
            collection(db, 'bloodRequests'), 
            where('hospitalId', '==', hospitalId)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BloodRequest));
            // Manual sort on the client-side
            fetchedRequests.sort((a, b) => {
              if (a.createdAt && b.createdAt) {
                return b.createdAt.toMillis() - a.createdAt.toMillis();
              }
              return 0;
            });
            setRequests(fetchedRequests);
            setLoading(false);
        }, (err) => {
            console.error("Error loading requests: ", err);
            toast({ variant: "destructive", title: "Error", description: "Could not load requests. Check Firestore permissions." });
            setLoading(false);
        });
        return () => unsubscribe();
    }, [hospitalId, toast]);

    const handleToggle = async (id: string, currentStatus: 'open' | 'closed') => {
        if (currentStatus === 'open') {
            const result = await closeBloodRequest(id);
            if (result.success) {
                toast({ title: "Success", description: "Request marked as closed." });
            } else {
                toast({ variant: "destructive", title: "Error", description: result.error });
            }
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Manage Requests</CardTitle>
                    <CardDescription>View and close existing blood requests.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-16">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />Loading requests...
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Requests</CardTitle>
                <CardDescription>View and close existing blood requests for your hospital.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {requests.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No requests yet.</p>
                    ) : requests.map(req => (
                        <div key={req.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                                <p className="font-semibold">{req.bloodGroup} - {req.units} units</p>
                                <p className="text-sm text-muted-foreground">{req.createdAt ? formatDistanceToNow(req.createdAt.toDate(), { addSuffix: true }) : 'just now'}</p>
                            </div>
                             <div className="flex items-center space-x-2">
                                <EditRequestDialog request={req} />
                                <DeleteRequestDialog requestId={req.id} />
                                <Switch
                                    id={`switch-${req.id}`}
                                    checked={req.status === 'closed'}
                                    onCheckedChange={() => handleToggle(req.id, req.status)}
                                    disabled={req.status === 'closed'}
                                />
                                <Label htmlFor={`switch-${req.id}`} className="capitalize">{req.status}</Label>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
