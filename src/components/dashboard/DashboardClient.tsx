'use client';

import { useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createBloodRequest } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { RequestList } from './RequestList';
import type { Hospital } from '@/lib/types';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const urgencyLevels = ['critical', 'high', 'normal'] as const;

const formSchema = z.object({
  hospitalId: z.string().min(1, 'Please select a hospital.'),
  bloodGroup: z.enum(bloodGroups),
  units: z.coerce.number().int().min(1, 'At least one unit is required.'),
  urgency: z.enum(urgencyLevels),
  patientName: z.string().min(1, 'Patient name is required.'),
  patientStory: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;


export function DashboardClient({ hospitals }: { hospitals: Hospital[] }) {
  const [isSubmitting, startTransition] = useTransition();
  const { toast } = useToast();
  const defaultHospitalId = hospitals.length > 0 ? hospitals[0].id : '';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hospitalId: defaultHospitalId,
      bloodGroup: 'A+',
      units: 1,
      urgency: 'normal',
      patientName: '',
      patientStory: '',
    },
  });

  const selectedHospitalId = form.watch('hospitalId');

  const onPostRequest: SubmitHandler<FormValues> = async (data) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const result = await createBloodRequest(formData);
      
      if (result.success) {
        toast({ title: 'Success!', description: 'Your blood request is now live.' });
        form.reset({
          hospitalId: defaultHospitalId,
          bloodGroup: 'A+',
          units: 1,
          urgency: 'normal',
          patientName: '',
          patientStory: '',
        });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    });
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Create New Request</CardTitle>
          <CardDescription>Fill out the details below to post a new blood request.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onPostRequest)} className="space-y-6">
              <FormField
                control={form.control}
                name="hospitalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a hospital" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {hospitals.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {bloodGroups.map(group => <SelectItem key={group} value={group}>{group}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="units"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Units Required</FormLabel>
                      <FormControl><Input type="number" min="1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency Level</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {urgencyLevels.map(level => <SelectItem key={level} value={level} className="capitalize">{level}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl><Input placeholder="e.g. John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientStory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Story (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="e.g. Undergoing major surgery" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting || !selectedHospitalId} className="w-full">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Post Blood Request
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {selectedHospitalId ? (
        <RequestList hospitalId={selectedHospitalId} />
      ) : (
        <Card>
            <CardHeader>
                <CardTitle>Manage Requests</CardTitle>
                <CardDescription>Select a hospital to see its requests.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground py-8">No hospital selected.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
