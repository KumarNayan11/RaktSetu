import type { Timestamp } from 'firebase/firestore';

export type UrgencyLevel = 'critical' | 'high' | 'normal';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type RequestStatus = 'open' | 'closed';
export type HospitalStatus = 'active' | 'inactive';

export interface BloodRequest {
  id: string;
  hospitalId: string;
  hospitalName: string;
  hospitalLocality: string;
  hospitalPhone: string;
  hospitalMapLink?: string;
  bloodGroup: BloodGroup;
  units: number;
  urgency: UrgencyLevel;
  patientName: string;
  patientStory?: string;
  status: RequestStatus;
  createdAt: Timestamp;
}

export interface Hospital {
  id: string;
  name: string;
  locality: string;
  phone: string;
  mapLink?: string;
  status: HospitalStatus;
}
