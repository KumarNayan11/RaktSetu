'use client';

import { useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addHospital, updateHospital, resetDatabase, deleteHospital } from '@/lib/actions';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import type { Hospital } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, Link as LinkIcon } from 'lucide-react';
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
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(3, 'Hospital name must be at least 3 characters.'),
  locality: z.string().min(3, 'Locality must be at least 3 characters.'),
  phone: z.string().regex(/^\d{10,12}$/, 'Please enter a valid 10-12 digit phone number.'),
  mapLink: z.string().url('Please enter a valid Google Maps URL.').optional().or(z.literal('')),
});

function DeleteHospitalDialog({ hospitalId }: { hospitalId: string }) {
    const [isDeleting, startDeleteTransition] = useTransition();
    const { toast } = useToast();

    const handleDelete = () => {
        startDeleteTransition(async () => {
            const result = await deleteHospital(hospitalId);
            if (result.success) {
                toast({ title: "Success", description: "Hospital and its requests have been deleted." });
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
                    <span className="sr-only">Delete Hospital</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the hospital and all of its associated blood requests.
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


export function HospitalManager() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isResetting, startResetTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', locality: '', phone: '', mapLink: '' },
  });

  useEffect(() => {
    if (!db) {
      setLoading(false);
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not initialized. Check your .env.local file.' });
      return;
    }
    const q = query(collection(db, 'hospitals'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const hospitalData: Hospital[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hospital));
        setHospitals(hospitalData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching hospitals: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch hospitals.' });
        setLoading(false);
    });
    return () => unsubscribe();
}, [toast]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('locality', values.locality);
      formData.append('phone', values.phone);
      if (values.mapLink) {
        formData.append('mapLink', values.mapLink);
      }
      const result = await addHospital(formData);
      if (result.success) {
        toast({ title: 'Success', description: 'Hospital added successfully.' });
        form.reset();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    });
  };

  const handleUpdate = (id: string, updates: Partial<Hospital>) => {
    startTransition(async () => {
      const result = await updateHospital(id, updates);
      if (result.success) {
        toast({ title: 'Success', description: 'Hospital updated.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    });
  };

  const handleResetDatabase = () => {
    startResetTransition(async () => {
      const result = await resetDatabase();
      if (result.success) {
        toast({ title: 'Success', description: 'Database has been reset.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    });
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Add New Hospital</CardTitle>
            <CardDescription>Enter the details of the new hospital to add to the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Apollo Hospital" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="locality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Locality</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Jubilee Hills, Hyderabad" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mapLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Maps Link (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://maps.app.goo.gl/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Hospital
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
         <Card className="mt-8">
            <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
                <CardDescription>Perform system-wide actions.</CardDescription>
            </CardHeader>
            <CardContent>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full" disabled={isResetting}>
                            {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            Reset Database
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all blood requests and hospitals
                            from the database.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetDatabase}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Existing Hospitals</CardTitle>
            <CardDescription>Manage activation status and other properties.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && !hospitals.length ? (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : hospitals.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold">No Hospitals Found</h2>
                    <p className="mt-2 text-muted-foreground">
                        Add a hospital using the form on the left.
                    </p>
                </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Locality</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Map Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hospitals.map((hospital) => (
                  <TableRow key={hospital.id}>
                    <TableCell className="font-medium">{hospital.name}</TableCell>
                     <TableCell>{hospital.locality}</TableCell>
                     <TableCell>{hospital.phone}</TableCell>
                    <TableCell>
                      {hospital.mapLink ? (
                        <Link href={hospital.mapLink} target="_blank" className="text-primary hover:underline">
                            <LinkIcon className="inline h-4 w-4" />
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={hospital.status === 'active' ? 'default' : 'secondary'} className={hospital.status === 'active' ? 'bg-green-600' : ''}>
                        {hospital.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={hospital.status === 'active'}
                        onCheckedChange={(checked) => handleUpdate(hospital.id, { status: checked ? 'active' : 'inactive' })}
                        disabled={isPending}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                        <DeleteHospitalDialog hospitalId={hospital.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
