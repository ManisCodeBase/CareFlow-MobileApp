/**
 * Patient Service
 * Manages patient data and appointments
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Patient, Appointment, Consultation } from '@/types/clinical';

const PATIENTS_KEY = 'clinical_patients';
const APPOINTMENTS_KEY = 'clinical_appointments';
const CONSULTATIONS_KEY = 'clinical_consultations';

/**
 * Get all patients
 */
export const getPatients = async (): Promise<Patient[]> => {
  try {
    const data = await AsyncStorage.getItem(PATIENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting patients:', error);
    return [];
  }
};

/**
 * Get patient by ID
 */
export const getPatientById = async (id: string): Promise<Patient | null> => {
  try {
    const patients = await getPatients();
    return patients.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error getting patient by ID:', error);
    return null;
  }
};

/**
 * Get all appointments for today
 */
export const getTodaysAppointments = async (): Promise<Appointment[]> => {
  try {
    const data = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    console.log('📅 Raw appointments data:', data);
    const appointments: Appointment[] = data ? JSON.parse(data) : [];
    console.log('📅 Total appointments:', appointments.length);
    
    // Filter for today's appointments - compare date strings only (not time)
    const today = new Date().toDateString();
    const filtered = appointments.filter(apt => {
      const aptDate = new Date(apt.scheduledTime).toDateString();
      const isToday = aptDate === today;
      console.log(`Appointment ${apt.id}: ${aptDate} === ${today}? ${isToday}`);
      return isToday;
    });
    
    console.log('📅 Filtered today appointments:', filtered.length);
    return filtered;
  } catch (error) {
    console.error('Error getting appointments:', error);
    return [];
  }
};

/**
 * Get appointment by ID
 */
export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  try {
    const data = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    const appointments: Appointment[] = data ? JSON.parse(data) : [];
    return appointments.find(apt => apt.id === id) || null;
  } catch (error) {
    console.error('Error getting appointment:', error);
    return null;
  }
};

/**
 * Update appointment status
 */
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: Appointment['status'],
  consultationId?: string
): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    const appointments: Appointment[] = data ? JSON.parse(data) : [];
    
    const updated = appointments.map(apt =>
      apt.id === appointmentId
        ? { ...apt, status, consultationId }
        : apt
    );
    
    await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

/**
 * Save a new consultation
 */
export const saveConsultation = async (consultation: Consultation): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(CONSULTATIONS_KEY);
    const consultations: Consultation[] = data ? JSON.parse(data) : [];
    
    consultations.push(consultation);
    await AsyncStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(consultations));
  } catch (error) {
    console.error('Error saving consultation:', error);
    throw error;
  }
};

/**
 * Update an existing consultation
 */
export const updateConsultation = async (
  consultationId: string,
  updates: Partial<Consultation>
): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(CONSULTATIONS_KEY);
    const consultations: Consultation[] = data ? JSON.parse(data) : [];
    
    const updated = consultations.map(c =>
      c.id === consultationId ? { ...c, ...updates } : c
    );
    
    await AsyncStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating consultation:', error);
    throw error;
  }
};

/**
 * Get consultation by ID
 */
export const getConsultationById = async (id: string): Promise<Consultation | null> => {
  try {
    const data = await AsyncStorage.getItem(CONSULTATIONS_KEY);
    const consultations: Consultation[] = data ? JSON.parse(data) : [];
    return consultations.find(c => c.id === id) || null;
  } catch (error) {
    console.error('Error getting consultation:', error);
    return null;
  }
};

/**
 * Initialize demo data for testing
 */
export const initializeDemoData = async (): Promise<void> => {
  try {
    // Check if we have appointments for today
    const existingAppointments = await getTodaysAppointments();
    if (existingAppointments.length > 0) {
      console.log('✅ Demo data for today already exists, skipping initialization');
      return;
    }

    console.log('🚀 Initializing demo data for today...');

    // Create demo patients
    const patients: Patient[] = [
      {
        id: '1',
        name: 'Sarah Jenkins',
        age: 34,
        gender: 'F',
        medicalRecordNumber: '#8821',
        allergies: ['Penicillin', 'Latex'],
        insuranceProvider: 'Blue Cross',
      },
      {
        id: '2',
        name: 'Michael Thompson',
        age: 58,
        gender: 'M',
        medicalRecordNumber: '#8822',
        allergies: [],
        insuranceProvider: 'Aetna',
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        age: 27,
        gender: 'F',
        medicalRecordNumber: '#8823',
        allergies: ['Sulfa drugs'],
        insuranceProvider: 'UnitedHealthcare',
      },
    ];

    // Create demo appointments for today
    const now = new Date();
    const appointments: Appointment[] = [
      {
        id: 'apt1',
        patientId: '1',
        patient: patients[0],
        scheduledTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 30).toISOString(),
        reason: 'High Fever',
        status: 'pending',
      },
      {
        id: 'apt2',
        patientId: '2',
        patient: patients[1],
        scheduledTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0).toISOString(),
        reason: 'Follow-up',
        status: 'pending',
      },
      {
        id: 'apt3',
        patientId: '3',
        patient: patients[2],
        scheduledTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 30).toISOString(),
        reason: 'Annual Checkup',
        status: 'pending',
      },
    ];

    await AsyncStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
    await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    await AsyncStorage.setItem(CONSULTATIONS_KEY, JSON.stringify([]));
    
    console.log('Demo data initialized');
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
};
