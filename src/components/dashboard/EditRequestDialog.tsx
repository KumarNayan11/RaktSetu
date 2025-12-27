'use client';

import { useState, useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateBloodRequest } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit } from 'lucide-react';
import type { BloodRequest } from '@/lib/types';

const urgencyLevels = ['critical', 'high', 'normal'] as const;

const formSchema = z.object({
  units: z.coerce.number().int().min(1, 'At least one unit is required.'),
  urgency: z.enum(urgencyLevels),
  patientName: z.string().min(1, 'Patient name is required.'),
  patientStory: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function EditRequestDialog({ request }: { request: BloodRequest }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      units: request.units,
      urgency: request.urgency,
      patientName: request.patientName || '',
      patientStory: request.patientStory || '',
    },
  });

  const onUpdateRequest: SubmitHandler<FormValues> = async (data) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const result = await updateBloodRequest(request.id, formData);
      
      if (result.success) {
        toast({ title: 'Success!', description: 'The blood request has been updated.' });
        setOpen(false);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={request.status === 'closed'}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit Request</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Blood Request</DialogTitle>
          <DialogDescription>
            Update the details for the <span className="font-bold">{request.bloodGroup}</span> request.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onUpdateRequest)} className="space-y-6 pt-4">
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
            <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
