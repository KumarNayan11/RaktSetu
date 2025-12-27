'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp, doc, updateDoc, query, where, getDocs, getDoc, writeBatch, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { revalidatePath } from 'next/cache';
import type { Hospital } from './types';

const RequestSchema = z.object({
  hospitalId: z.string().min(1, 'Please select a hospital.'),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  units: z.coerce.number().int().min(1, 'At least one unit is required.'),
  urgency: z.enum(['critical', 'high', 'normal']),
  patientName: z.string().min(1, 'Patient name is required.'),
  patientStory: z.string().optional(),
});

export async function createBloodRequest(formData: FormData) {
  const parsed = RequestSchema.safeParse({
    hospitalId: formData.get('hospitalId'),
    bloodGroup: formData.get('bloodGroup'),
    units: formData.get('units'),
    urgency: formData.get('urgency'),
    patientName: formData.get('patientName'),
    patientStory: formData.get('patientStory'),
  });

  if (!parsed.success) {
    console.error(parsed.error);
    return { success: false, error: 'Invalid data provided.' };
  }
  
  if (!db) {
     return { success: false, error: 'Database not initialized.' };
  }

  try {
    const hospitalRef = doc(db, 'hospitals', parsed.data.hospitalId);
    const hospitalSnap = await getDoc(hospitalRef);

    if (!hospitalSnap.exists()) {
        return { success: false, error: 'Selected hospital does not exist.' };
    }
    const hospitalData = hospitalSnap.data() as Omit<Hospital, 'id'>;

    await addDoc(collection(db, 'bloodRequests'), {
      ...parsed.data,
      hospitalName: hospitalData.name,
      hospitalLocality: hospitalData.locality,
      hospitalPhone: hospitalData.phone,
      hospitalMapLink: hospitalData.mapLink || '',
      status: 'open',
      createdAt: serverTimestamp(),
    });

    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error creating request:', error);
    return { success: false, error: 'Failed to create blood request.' };
  }
}

const UpdateRequestSchema = z.object({
    units: z.coerce.number().int().min(1, 'At least one unit is required.'),
    urgency: z.enum(['critical', 'high', 'normal']),
    patientName: z.string().min(1, 'Patient name is required.'),
    patientStory: z.string().optional(),
});

export async function updateBloodRequest(id: string, formData: FormData) {
    const parsed = UpdateRequestSchema.safeParse({
        units: formData.get('units'),
        urgency: formData.get('urgency'),
        patientName: formData.get('patientName'),
        patientStory: formData.get('patientStory'),
    });

    if (!parsed.success) {
        return { success: false, error: 'Invalid data provided.' };
    }
    
    if (!db) {
        return { success: false, error: 'Database not initialized.' };
    }

    try {
        const requestRef = doc(db, 'bloodRequests', id);
        await updateDoc(requestRef, parsed.data);
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Error updating request:', error);
        return { success: false, error: 'Failed to update blood request.' };
    }
}

export async function closeBloodRequest(id: string) {
  if (!db) {
     return { success: false, error: 'Database not initialized.' };
  }
  try {
    const requestRef = doc(db, 'bloodRequests', id);
    await updateDoc(requestRef, { status: 'closed' });
    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error closing request:', error);
    return { success: false, error: 'Failed to close blood request.' };
  }
}


export async function deleteBloodRequest(id: string) {
  if (!db) {
     return { success: false, error: 'Database not initialized.' };
  }
  try {
    const requestRef = doc(db, 'bloodRequests', id);
    await deleteDoc(requestRef);
    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting request:', error);
    return { success: false, error: 'Failed to delete blood request.' };
  }
}


const HospitalSchema = z.object({
  name: z.string().min(3, 'Hospital name must be at least 3 characters.'),
  locality: z.string().min(3, 'Locality must be at least 3 characters.'),
  phone: z.string().regex(/^\d{10,12}$/, 'Please enter a valid 10-12 digit phone number.'),
  mapLink: z.string().url().optional().or(z.literal('')),
});

export async function addHospital(formData: FormData) {
  const parsed = HospitalSchema.safeParse({ 
    name: formData.get('name'),
    locality: formData.get('locality'),
    phone: formData.get('phone'),
    mapLink: formData.get('mapLink') || '',
  });

  if (!parsed.success) {
    console.error(parsed.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid hospital details provided.' };
  }
  
  if (!db) {
     return { success: false, error: 'Database not initialized.' };
  }

  try {
    const q = query(collection(db, 'hospitals'), where('name', '==', parsed.data.name));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { success: false, error: 'Hospital with this name already exists.' };
    }

    await addDoc(collection(db, 'hospitals'), {
      ...parsed.data,
      status: 'inactive',
    });
    revalidatePath('/admin/hospitals');
    return { success: true };
  } catch (error) {
    console.error('Error adding hospital:', error);
    return { success: false, error: 'Failed to add hospital.' };
  }
}

export async function updateHospital(id: string, updates: { status?: 'active' | 'inactive' }) {
  if (!Object.keys(updates).length) {
    return { success: false, error: 'No updates provided.' };
  }
  if (!db) {
     return { success: false, error: 'Database not initialized.' };
  }
  try {
    const hospitalRef = doc(db, 'hospitals', id);
    await updateDoc(hospitalRef, updates);
    revalidatePath('/admin/hospitals');
    return { success: true };
  } catch (error) {
    console.error('Error updating hospital:', error);
    return { success: false, error: 'Failed to update hospital.' };
  }
}

export async function deleteHospital(id: string) {
    if (!db) {
        return { success: false, error: 'Database not initialized.' };
    }
    try {
        const batch = writeBatch(db);

        // 1. Delete the hospital itself
        const hospitalRef = doc(db, 'hospitals', id);
        batch.delete(hospitalRef);

        // 2. Find and delete all associated blood requests
        const requestsQuery = query(collection(db, 'bloodRequests'), where('hospitalId', '==', id));
        const requestsSnapshot = await getDocs(requestsQuery);
        requestsSnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        revalidatePath('/admin/hospitals');
        revalidatePath('/');
        revalidatePath('/dashboard');
        
        return { success: true };
    } catch (error) {
        console.error('Error deleting hospital and its requests:', error);
        return { success: false, error: 'Failed to delete hospital.' };
    }
}


export async function resetDatabase() {
    if (!db) {
     return { success: false, error: 'Database not initialized.' };
    }
    try {
        console.log("Resetting database...");

        const collectionsToDelete = ['bloodRequests', 'hospitals'];
        const batch = writeBatch(db);

        for (const collectionName of collectionsToDelete) {
            const q = query(collection(db, collectionName));
            const snapshot = await getDocs(q);
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            console.log(`Scheduled ${snapshot.size} documents for deletion from ${collectionName}.`);
        }

        await batch.commit();
        
        console.log("Database reset successfully.");
        revalidatePath('/');
        revalidatePath('/dashboard');
        revalidatePath('/admin/hospitals');

        return { success: true };
    } catch (error) {
        console.error('Error resetting database:', error);
        return { success: false, error: 'Failed to reset database.' };
    }
}
