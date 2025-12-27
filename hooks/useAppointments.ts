/**
 * useAppointments Hook
 * Manages appointments list for dashboard
 * 
 * Handles:
 * - Loading today's appointments
 * - Refresh control
 * - Filtering and grouping appointments
 * - Demo data initialization
 */

import { useState, useCallback } from 'react';
import { Appointment, AppointmentSection } from '@/types/clinical';
import { getTodaysAppointments, initializeDemoData } from '@/services/PatientService';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Load today's appointments
   */
  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📊 Loading appointments...');
      
      // Initialize demo data if needed
      await initializeDemoData();
      
      const data = await getTodaysAppointments();
      console.log('📊 Loaded appointments:', data.length);
      setAppointments(data);
      
      return data;
    } catch (err) {
      console.error('Error loading appointments:', err);
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh appointments with pull-to-refresh
   */
  const refresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  /**
   * Group appointments into sections (Upcoming/Completed)
   */
  const getSections = useCallback((): AppointmentSection[] => {
    const now = new Date();
    const upcoming: Appointment[] = [];
    const completed: Appointment[] = [];

    appointments.forEach(apt => {
      if (apt.status === 'completed') {
        completed.push(apt);
      } else {
        const aptTime = new Date(apt.scheduledTime);
        if (aptTime > now || apt.status === 'pending') {
          upcoming.push(apt);
        } else {
          completed.push(apt);
        }
      }
    });

    const sections: AppointmentSection[] = [];
    if (upcoming.length > 0) {
      sections.push({ title: 'Upcoming', data: upcoming });
    }
    if (completed.length > 0) {
      sections.push({ title: 'Completed', data: completed });
    }

    return sections;
  }, [appointments]);

  /**
   * Get counts for quick stats
   */
  const getCounts = useCallback(() => {
    const total = appointments.length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const pending = appointments.filter(a => a.status === 'pending').length;
    const upcoming = total - completed;

    return { total, completed, pending, upcoming };
  }, [appointments]);

  return {
    // State
    appointments,
    loading,
    refreshing,
    error,
    
    // Computed
    sections: getSections(),
    counts: getCounts(),
    
    // Actions
    loadAppointments,
    refresh,
  };
};
