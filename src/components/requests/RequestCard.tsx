'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { BloodRequest } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, Hospital, Droplets, CheckCircle2, Share2, Phone, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ShareDialog } from './ShareDialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BloodDropIcon } from '@/components/icons/BloodDropIcon';

type UrgencyConfig = {
  [key in 'critical' | 'high' | 'normal']: {
    label: string;
    iconColor: string;
    badgeVariant: 'destructive' | 'default' | 'secondary';
  };
};

const urgencyConfig: UrgencyConfig = {
  critical: { label: 'Critical', iconColor: 'text-destructive', badgeVariant: 'destructive' },
  high: { label: 'High', iconColor: 'text-amber-500', badgeVariant: 'default' },
  normal: { label: 'Normal', iconColor: 'text-muted-foreground', badgeVariant: 'secondary' },
};

export function RequestCard({ request }: { request: BloodRequest }) {
  const config = urgencyConfig[request.urgency];
  const isClosed = request.status === 'closed';

  const mapUrl = request.hospitalMapLink 
    ? request.hospitalMapLink
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${request.hospitalName}, ${request.hospitalLocality}`)}`;

  return (
    <Card className={cn(
      "flex flex-col transition-all duration-300 hover:shadow-lg",
      isClosed && "bg-gray-100/50 dark:bg-zinc-900/50 opacity-60"
    )}>
      <CardHeader className="flex-row items-start justify-between gap-4 pb-4">
        <div className="flex items-center gap-3">
          <BloodDropIcon className={cn("h-10 w-10", config.iconColor, isClosed ? 'text-gray-400' : '')} />
          <div>
            <CardTitle className="text-3xl font-extrabold">{request.bloodGroup}</CardTitle>
            <p className="-mt-1 text-sm text-muted-foreground">Blood Group</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
           <p className="text-xs text-muted-foreground">Urgency</p>
           <Badge variant={isClosed ? 'secondary' : config.badgeVariant} className="capitalize">
              {isClosed ? 'Closed' : config.label}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
         <div className="flex items-start text-foreground/90">
          <Hospital className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
          <div>
            <p className="font-semibold">{request.hospitalName}</p>
            <p className="text-sm text-muted-foreground">{request.hospitalLocality}</p>
          </div>
        </div>
        <div className="flex items-center text-foreground/90">
          <Phone className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
          <p className="text-sm">{request.hospitalPhone}</p>
        </div>
        <div className="flex items-center text-foreground/90">
          <Droplets className="mr-3 h-5 w-5 text-primary" />
          <span>Requires <span className="font-bold">{request.units} units</span></span>
        </div>
        {request.patientStory && (
            <p className="text-sm text-muted-foreground border-l-4 pl-4 italic">
                Patient Name - {request.patientName}: {request.patientStory}
            </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-4 pt-4">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
                {isClosed ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                <span>
                    {isClosed ? 'Fulfilled' : 'Requested'}{' '}
                    {request.createdAt ? formatDistanceToNow(request.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                </span>
            </div>
            {!isClosed && (
              <ShareDialog request={request}>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                      <Share2 className="h-3.5 w-3.5" />
                      Share
                  </button>
              </ShareDialog>
            )}
        </div>
         {!isClosed && (
            <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline">
                    <a href={`tel:${request.hospitalPhone}`}><Phone /> Contact</a>
                </Button>
                <Button asChild>
                    <Link href={mapUrl} target="_blank"><MapPin /> Find on Map</Link>
                </Button>
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
