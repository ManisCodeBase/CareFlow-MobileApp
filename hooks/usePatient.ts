/**
 * usePatient Hook
 * Manages patient and appointment data fetching and state
 * 
 * Handles:
 * - Loading patient details
 * - Loading appointment details
 * - Loading previous consultations for patient
 * - Error handling and loading states
 */

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Patient, Appointment, Consultation } from '@/types/clinical';
import { getPatientById, getAppointmentById } from '@/services/PatientService';

interface UsePatientOptions {
  patientId?: string;
  appointmentId?: string;
  autoLoad?: boolean;
}

export const usePatient = ({ 
  patientId, 
  appointmentId, 
  autoLoad = true 
}: UsePatientOptions = {}) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Load patient by ID
   */
  const loadPatient = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('👤 Loading patient:', id);
      
      const data = await getPatientById(id);
      setPatient(data);
      
      if (!data) {
        throw new Error('Patient not found');
      }
      
      return data;
    } catch (err) {
      console.error('Error loading patient:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load appointment by ID
   */
  const loadAppointment = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('📅 Loading appointment:', id);
      
      const data = await getAppointmentById(id);
      setAppointment(data);
      
      if (!data) {
        throw new Error('Appointment not found');
      }

      // Load patient data from appointment
      if (data.patient) {
        setPatient(data.patient);
      }

      // Load previous consultations if appointment has consultation ID
      if (data.consultationId || data.patientId) {
        await loadConsultations(data.patientId, id);
      }
      
      return data;
    } catch (err) {
      console.error('Error loading appointment:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load patient's previous consultations
   */
  const loadConsultations = async (patientIdToLoad?: string, appointmentIdToLoad?: string) => {
    try {
      const consultationsData = await AsyncStorage.getItem('clinical_consultations');
      if (!consultationsData) {
        setConsultations([]);
        return [];
      }

      const allConsultations: Consultation[] = JSON.parse(consultationsData);
      const filtered = allConsultations.filter(
        c => 
          (patientIdToLoad && c.patientId === patientIdToLoad) ||
          (appointmentIdToLoad && c.appointmentId === appointmentIdToLoad)
      );

      console.log('📋 Loaded consultations:', filtered.length);
      setConsultations(filtered);
      return filtered;
    } catch (err) {
      console.error('Error loading consultations:', err);
      setConsultations([]);
      return [];
    }
  };

  /**
   * Refresh all data
   */
  const refresh = async () => {
    if (appointmentId) {
      await loadAppointment(appointmentId);
    } else if (patientId) {
      await loadPatient(patientId);
    }
  };

  // Auto-load on mount if IDs provided
  useEffect(() => {
    if (!autoLoad) return;

    if (appointmentId) {
      loadAppointment(appointmentId);
    } else if (patientId) {
      loadPatient(patientId);
    }
  }, [appointmentId, patientId, autoLoad]);

  return {
    // State
    patient,
    appointment,
    consultations,
    loading,
    error,
    
    // Actions
    loadPatient,
    loadAppointment,
    loadConsultations,
    refresh,
  };
};
