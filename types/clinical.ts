/**
 * Clinical Workflow Data Types
 * These types define the structure of patient and consultation data
 */

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  medicalRecordNumber: string;
  allergies: string[];
  insuranceProvider?: string;
  photoUrl?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patient: Patient;
  scheduledTime: string;
  reason: string;
  status: 'pending' | 'completed' | 'cancelled';
  consultationId?: string;
}

export interface Consultation {
  id: string;
  appointmentId: string;
  patientId: string;
  audioUri: string;
  duration: number; // in seconds
  transcription?: string;
  formattedNote?: string;
  startedAt: string;
  completedAt?: string;
  status: 'recording' | 'processing' | 'completed' | 'draft';
}

export type AppointmentSection = {
  title: string;
  data: Appointment[];
};
