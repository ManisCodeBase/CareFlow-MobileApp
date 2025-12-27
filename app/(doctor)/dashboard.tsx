/**
 * Screen 1: Daily Rounds Dashboard
 * Landing screen showing doctor's appointments for the day
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@/constants/theme';
import { Appointment, AppointmentSection } from '@/types/clinical';
import { useAppointments } from '@/hooks';
import { formatDate, formatTime, isTimePassed, getGreeting } from '@/utils';
import { getPendingWorkflows } from '@/services/WorkflowService';

export default function DashboardScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [doctorName] = useState('Smith');
  const [pendingWorkflows, setPendingWorkflows] = useState<Array<{ consultationId: string; patientName: string }>>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);
  
  const { 
    sections, 
    refreshing, 
    refresh,
    loadAppointments 
  } = useAppointments();

  const loadPendingWorkflows = async () => {
    try {
      setLoadingWorkflows(true);
      const pending = await getPendingWorkflows();
      setPendingWorkflows(pending);
      console.log('📋 Pending workflows loaded:', pending.length);
    } catch (error) {
      console.error('❌ Error loading pending workflows:', error);
      // Don't show error to user - this is background functionality
    } finally {
      setLoadingWorkflows(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
      loadPendingWorkflows();
    }, [])
  );

  const handleRefresh = async () => {
    await refresh();
    await loadPendingWorkflows();
  };

  const renderAppointmentCard = ({ item }: { item: Appointment }) => {
    const timePassed = isTimePassed(item.scheduledTime);
    
    return (
      <TouchableOpacity
        style={styles.appointmentCard}
        onPress={() => router.push({
          pathname: '/(doctor)/patient/[id]',
          params: { id: item.id }
        })}
        activeOpacity={0.7}
      >
        {/* Time Column */}
        <View style={styles.timeColumn}>
          <Text style={[styles.timeText, timePassed && styles.timeTextPassed]}>
            {formatTime(item.scheduledTime)}
          </Text>
        </View>

        {/* Patient Info Column */}
        <View style={styles.infoColumn}>
          <Text style={styles.patientName}>{item.patient.name}</Text>
          <Text style={styles.demographics}>
            {item.patient.age}{item.patient.gender} • ID: {item.patient.medicalRecordNumber}
          </Text>
          <View style={styles.reasonBadge}>
            <Text style={styles.reasonText}>{item.reason}</Text>
          </View>
        </View>

        {/* Status Column */}
        <View style={styles.statusColumn}>
          {item.status === 'completed' ? (
            <View style={styles.completedIcon}>
              <Ionicons name="checkmark-circle" size={28} color={Colors.success} />
            </View>
          ) : (
            <View style={styles.pendingIcon}>
              <Ionicons name="ellipse-outline" size={28} color={Colors.status.pending} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: AppointmentSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}, Dr. {doctorName}</Text>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.dateText}>{formatDate()}</Text>
          </View>
        </View>
      </View>

      {/* Pending Approvals Notification */}
      {pendingWorkflows.length > 0 && (
        <TouchableOpacity
          style={styles.notificationBanner}
          onPress={() => {
            const first = pendingWorkflows[0];
            router.push({
              pathname: '/(doctor)/workflow/[consultationId]',
              params: { consultationId: first.consultationId }
            });
          }}
          activeOpacity={0.8}
        >
          <View style={styles.notificationIcon}>
            <Ionicons name="alert-circle" size={24} color={Colors.warning} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>
              {pendingWorkflows.length} Workflow{pendingWorkflows.length > 1 ? 's' : ''} Pending Approval
            </Text>
            <Text style={styles.notificationSubtitle}>
              AI has completed processing. Tap to review and approve.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.warning} />
        </TouchableOpacity>
      )}

      {loadingWorkflows && pendingWorkflows.length === 0 && (
        <View style={styles.notificationBanner}>
          <ActivityIndicator color={Colors.primary} size="small" />
          <Text style={styles.loadingWorkflowsText}>Checking for pending approvals...</Text>
        </View>
      )}

      {/* Appointments List */}
      <SectionList
        sections={sections}
        renderItem={renderAppointmentCard}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ItemSeparator}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={Colors.border.medium} />
            <Text style={styles.emptyText}>No appointments scheduled for today</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  greeting: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    letterSpacing: -0.5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  dateText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    fontWeight: FontWeights.medium,
  },
  listContent: {
    padding: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  sectionHeader: {
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    letterSpacing: -0.3,
  },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  timeColumn: {
    width: 70,
    marginRight: Spacing.lg,
    alignItems: 'flex-start',
  },
  timeText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
    letterSpacing: -0.2,
  },
  timeTextPassed: {
    color: Colors.text.tertiary,
  },
  infoColumn: {
    flex: 1,
    gap: Spacing.xs,
  },
  patientName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  demographics: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    fontWeight: FontWeights.medium,
  },
  reasonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.button,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  reasonText: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    fontWeight: FontWeights.semibold,
  },
  statusColumn: {
    marginLeft: Spacing.lg,
  },
  completedIcon: {
    // Just container
  },
  pendingIcon: {
    // Just container
  },
  separator: {
    height: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.huge,
  },
  emptyText: {
    fontSize: FontSizes.base,
    color: Colors.text.secondary,
    marginTop: Spacing.xl,
    fontWeight: FontWeights.medium,
  },
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '15',
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    padding: Spacing.xl,
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.lg,
    borderRadius: BorderRadius.sm,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    letterSpacing: -0.2,
  },
  notificationSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  loadingWorkflowsText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.md,
    fontWeight: FontWeights.medium,
  },
});

// Separator component for list items
const ItemSeparator = () => <View style={styles.separator} />;
