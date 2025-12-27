'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check } from 'lucide-react';
import type { BloodRequest } from '@/lib/types';

function generateMessages(request: BloodRequest) {
    const verificationUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/?requestId=${request.id}` 
        : '';
    
    const englishMessage = `*URGENT BLOOD REQUEST*

A patient at *${request.hospitalName}* is in critical need of blood.

*Blood Group:* ${request.bloodGroup}
*Units Required:* ${request.units}
*Urgency:* ${request.urgency}
${request.patientStory ? `*Patient Story:* ${request.patientStory}\n` : ''}
Please help save a life. Your donation is invaluable.

*Verify this request and check its status at:*
${verificationUrl}

Thank you for your support!`;

    const hindiMessage = `*तत्काल रक्त की आवश्यकता*

*${request.hospitalName}* में एक मरीज को तत्काल रक्त की आवश्यकता है।

*ब्लड ग्रुप:* ${request.bloodGroup}
*यूनिट की आवश्यकता:* ${request.units}
*अविलंबता:* ${request.urgency}
${request.patientStory ? `*मरीज की कहानी:* ${request.patientStory}\n` : ''}
 कृपया एक जीवन बचाने में मदद करें। आपका रक्तदान अमूल्य है।

*इस अनुरोध को सत्यापित करें और इसकी स्थिति जांचें:*
${verificationUrl}

आपके सहयोग के लिए धन्यवाद!`;

    return { englishMessage, hindiMessage };
}


export function ShareDialog({ children, request }: { children: React.ReactNode; request: BloodRequest }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<'english' | 'hindi' | null>(null);
  const { toast } = useToast();
  
  const messages = generateMessages(request);

  const handleSelectToCopy = (id: 'english-message' | 'hindi-message', type: 'english' | 'hindi') => {
    const textarea = document.getElementById(id) as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.focus();
      textarea.select();
      setSelected(type);
      toast({ title: 'Text selected!', description: 'Press Ctrl+C or Cmd+C to copy.' });
      setTimeout(() => setSelected(null), 3000);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not select text.' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Share Request</DialogTitle>
          <DialogDescription>
            Click the button to select the message, then press Ctrl+C to copy. A link to verify this request is automatically included.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="english-message">English Message</Label>
            <div className="relative">
              <Textarea id="english-message" value={messages.englishMessage} readOnly rows={10} className="pr-10" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={() => handleSelectToCopy('english-message', 'english')}
              >
                {selected === 'english' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hindi-message">Hindi Message</Label>
            <div className="relative">
              <Textarea id="hindi-message" value={messages.hindiMessage} readOnly rows={10} className="pr-10" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={() => handleSelectToCopy('hindi-message', 'hindi')}
              >
                {selected === 'hindi' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
