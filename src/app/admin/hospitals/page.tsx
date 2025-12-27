'use client';

import { HospitalManager } from "@/components/admin/HospitalManager";

export default function AdminHospitalsPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-primary tracking-tight font-headline">
                    Hospital Management
                </h1>
                <p className="mt-2 text-lg text-foreground/80">
                    Add new hospitals and manage verification and status.
                </p>
            </div>
            <HospitalManager />
        </div>
    );
}
