/**
 * Workflow Review & Approval Screen
 * 
 * Human-in-the-Loop (HITL) approval interface where doctors review
 * AI-generated results before sending notifications to patients.
 * 
 * Features:
 * - Review billing codes (CPT/ICD-10) with charges
 * - Review patient-friendly summary (editable)
 * - Review follow-up recommendations
 * - Review communication plan (email, WhatsApp, calendar)
 * - Approve to send notifications
 * - Reject to rebuild plan
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { toast } from 'sonner-native';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@/constants/theme';
import {
  getWorkflowStatus,
  approveWorkflow,
  rejectWorkflow,
  WorkflowStatusResponse,
} from '@/services/WorkflowService';

export default function WorkflowApprovalScreen() {
  const router = useRouter();
  const { consultationId } = useLocalSearchParams<{ consultationId: string }>();
  const { top, bottom } = useSafeAreaInsets();
  
  const [workflow, setWorkflow] = useState<WorkflowStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');

  useEffect(() => {
    loadWorkflowStatus();
  }, [consultationId]);

  const loadWorkflowStatus = async () => {
    if (!consultationId) {
      Alert.alert('Error', 'No consultation ID provided');
      router.back();
      return;
    }

    try {
      setIsLoading(true);
      console.log('📋 Loading workflow status...');
      
      const data = await getWorkflowStatus(consultationId);
      setWorkflow(data);
      setEditedSummary(data.results.patient_summary?.html_content || '');
      
      console.log('✅ Workflow loaded:', {
        status: data.approval_status,
        node: data.current_node,
        completed: data.completed,
      });
    } catch (error) {
      console.error('❌ Error loading workflow:', error);
      toast.error('Failed to load workflow results');
      Alert.alert(
        'Error',
        'Failed to load workflow results. Please try again.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    const message = 
      'This will send the following to the patient:\n\n' +
      '📧 Email with consultation summary\n' +
      '💬 WhatsApp notification\n' +
      (workflow?.results.followup_plan?.needed ? '📅 Calendar invite for follow-up\n' : '') +
      '\nContinue?';

    if (Platform.OS === 'web') {
      if (!globalThis.confirm(message)) return;
    } else {
      Alert.alert(
        'Approve & Send Notifications',
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Approve & Send',
            style: 'default',
            onPress: () => executeApproval(),
          },
        ]
      );
      return;
    }
    
    await executeApproval();
  };

  const executeApproval = async () => {
    try {
      setIsApproving(true);
      console.log('✅ Approving workflow...');
      
      await approveWorkflow(consultationId!, 'Approved by doctor');
      
      toast.success('Notifications sent to patient! ✅');
      
      if (Platform.OS === 'web') {
        alert('✅ Success!\n\nPatient has been notified via email and WhatsApp.');
      } else {
        Alert.alert(
          '✅ Notifications Sent',
          'The patient has been notified via:\n\n' +
          '📧 Email with summary\n' +
          '💬 WhatsApp message\n' +
          (workflow?.results.followup_plan?.needed ? '📅 Calendar invite\n' : ''),
          [{ text: 'Done', onPress: () => router.replace('/(doctor)/dashboard') }]
        );
        return;
      }
      
      setTimeout(() => {
        router.replace('/(doctor)/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error approving workflow:', error);
      toast.error('Failed to approve workflow');
      Alert.alert('Error', 'Failed to approve workflow. Please try again.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = () => {
    if (Platform.OS === 'web') {
      const notes = globalThis.prompt('Please provide a reason for rejection:');
      if (notes) {
        executeRejection(notes);
      }
    } else {
      Alert.prompt(
        'Reject Plan',
        'Please provide a reason for rejection so the plan can be rebuilt:',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reject',
            style: 'destructive',
            onPress: (notes) => {
              if (notes?.trim()) {
                executeRejection(notes);
              } else {
                Alert.alert('Error', 'Rejection reason is required');
              }
            },
          },
        ],
        'plain-text'
      );
    }
  };

  const executeRejection = async (notes: string) => {
    try {
      setIsRejecting(true);
      console.log('❌ Rejecting workflow...');
      
      await rejectWorkflow(consultationId!, notes);
      
      toast.success('Plan rejected. Rebuilding...');
      
      // Reload workflow status
      setTimeout(() => {
        loadWorkflowStatus();
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error rejecting workflow:', error);
      toast.error('Failed to reject workflow');
      Alert.alert('Error', 'Failed to reject workflow. Please try again.');
    } finally {
      setIsRejecting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: top }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading workflow results...</Text>
      </View>
    );
  }

  if (!workflow) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: top }]}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
        <Text style={styles.errorText}>Workflow not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { results } = workflow;

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review AI Results</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Status Badge */}
      <View style={styles.statusBadge}>
        <Ionicons name="time-outline" size={16} color={Colors.warning} />
        <Text style={styles.statusText}>
          Pending Approval - Review before sending to patient
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: bottom + 140 }}
      >
        
        {/* Billing Section */}
        {results.billing_data && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="receipt-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Billing Codes</Text>
              {results.billing_generated && (
                <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              )}
            </View>
            
            <Text style={styles.sectionSubtitle}>CPT Codes (Procedures)</Text>
            {results.billing_data.cpt_codes.map((code, idx) => (
              <View key={`cpt-${code.code}-${idx}`} style={styles.codeCard}>
                <View style={styles.codeHeader}>
                  <Text style={styles.codeText}>{code.code}</Text>
                  <Text style={styles.codeCharge}>${code.charge.toFixed(2)}</Text>
                </View>
                <Text style={styles.codeDesc}>{code.description}</Text>
                <Text style={styles.codeConfidence}>
                  Confidence: {(code.confidence * 100).toFixed(0)}%
                </Text>
              </View>
            ))}
            
            <Text style={[styles.sectionSubtitle, { marginTop: Spacing.lg }]}>
              ICD-10 Codes (Diagnoses)
            </Text>
            {results.billing_data.icd10_codes.map((code, idx) => (
              <View key={`icd10-${code.code}-${idx}`} style={styles.codeCard}>
                <Text style={styles.codeText}>{code.code}</Text>
                <Text style={styles.codeDesc}>{code.description}</Text>
              </View>
            ))}
            
            <View style={styles.totalChargeBox}>
              <Text style={styles.totalChargeLabel}>Total Consultation Charge:</Text>
              <Text style={styles.totalCharge}>
                ${results.billing_data.total_charge.toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Patient Summary Section */}
        {results.patient_summary && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Patient Summary</Text>
              <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                <Ionicons
                  name={isEditing ? 'eye' : 'pencil'}
                  size={18}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.helperText}>
              {isEditing
                ? 'Edit the summary before approving'
                : 'This will be sent to the patient via email'}
            </Text>
            
            {isEditing ? (
              <TextInput
                style={styles.summaryEditor}
                value={editedSummary}
                onChangeText={setEditedSummary}
                multiline
                placeholder="Patient summary..."
                placeholderTextColor={Colors.text.disabled}
                textAlignVertical="top"
              />
            ) : (
              <ScrollView style={styles.summaryBox} nestedScrollEnabled>
                <Text style={styles.summaryText}>{editedSummary}</Text>
              </ScrollView>
            )}
            
            {results.patient_summary.medications.length > 0 && (
              <View style={styles.detailsBox}>
                <Text style={styles.detailLabel}>💊 Medications:</Text>
                {results.patient_summary.medications.map((med, idx) => (
                  <Text key={`med-${idx}-${med.substring(0, 10)}`} style={styles.detailItem}>• {med}</Text>
                ))}
              </View>
            )}
            
            {results.patient_summary.instructions.length > 0 && (
              <View style={styles.detailsBox}>
                <Text style={styles.detailLabel}>✅ Care Instructions:</Text>
                {results.patient_summary.instructions.map((inst, idx) => (
                  <Text key={`inst-${idx}-${inst.substring(0, 10)}`} style={styles.detailItem}>• {inst}</Text>
                ))}
              </View>
            )}
            
            {results.patient_summary.warnings.length > 0 && (
              <View style={styles.detailsBox}>
                <Text style={styles.detailLabel}>⚠️ Important Warnings:</Text>
                {results.patient_summary.warnings.map((warn, idx) => (
                  <Text key={`warn-${idx}-${warn.substring(0, 10)}`} style={[styles.detailItem, styles.warningItem]}>
                    • {warn}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Follow-up Section */}
        {results.followup_plan && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Follow-up Plan</Text>
              {results.followup_analyzed && (
                <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              )}
            </View>
            
            {results.followup_plan.needed ? (
              <>
                <View style={styles.followupCard}>
                  <Text style={styles.followupNeeded}>✅ Follow-up Appointment Needed</Text>
                  <Text style={styles.followupTimeframe}>
                    Suggested: {results.followup_plan.suggested_timeframe}
                  </Text>
                  <Text style={styles.followupReason}>
                    Reason: {results.followup_plan.reason}
                  </Text>
                  <Text style={styles.followupType}>
                    Type: {results.followup_plan.appointment_type?.toUpperCase()}
                  </Text>
                  <View style={styles.urgencyBadge}>
                    <Text style={styles.urgencyText}>
                      Urgency: {results.followup_plan.urgency?.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.calendarNote}>
                  📅 Calendar invite will be sent to patient
                </Text>
              </>
            ) : (
              <View style={styles.followupCard}>
                <Text style={styles.followupNotNeeded}>
                  No follow-up appointment needed at this time
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Communication Plan */}
        {results.communication_plan && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="send-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Communication Plan</Text>
            </View>
            
            <Text style={styles.commPlanDescription}>
              The following will be sent to the patient:
            </Text>
            
            <View style={styles.commPlanBox}>
              <View style={styles.commItem}>
                <Ionicons
                  name={results.communication_plan.send_email ? 'checkmark-circle' : 'close-circle'}
                  size={20}
                  color={results.communication_plan.send_email ? Colors.success : Colors.text.disabled}
                />
                <Text style={styles.commItemText}>Email with PDF summary</Text>
              </View>
              
              <View style={styles.commItem}>
                <Ionicons
                  name={results.communication_plan.send_whatsapp ? 'checkmark-circle' : 'close-circle'}
                  size={20}
                  color={results.communication_plan.send_whatsapp ? Colors.success : Colors.text.disabled}
                />
                <Text style={styles.commItemText}>WhatsApp notification</Text>
              </View>
              
              <View style={styles.commItem}>
                <Ionicons
                  name={results.communication_plan.send_calendar ? 'checkmark-circle' : 'close-circle'}
                  size={20}
                  color={results.communication_plan.send_calendar ? Colors.success : Colors.text.disabled}
                />
                <Text style={styles.commItemText}>Calendar invite (if follow-up needed)</Text>
              </View>
            </View>
            
            <View style={styles.costBox}>
              <Text style={styles.costLabel}>Estimated Cost:</Text>
              <Text style={styles.costValue}>
                ${results.communication_plan.estimated_cost.toFixed(4)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View style={[styles.footer, { paddingBottom: bottom + Spacing.lg }]}>
        <TouchableOpacity
          style={[styles.rejectButton, isRejecting && styles.buttonDisabled]}
          onPress={handleReject}
          disabled={isApproving || isRejecting}
        >
          {isRejecting ? (
            <ActivityIndicator color={Colors.error} />
          ) : (
            <>
              <Ionicons name="close-circle" size={20} color={Colors.error} />
              <Text style={styles.rejectButtonText}>Reject & Revise</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.approveButton, isApproving && styles.buttonDisabled]}
          onPress={handleApprove}
          disabled={isApproving || isRejecting}
        >
          {isApproving ? (
            <ActivityIndicator color={Colors.text.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={Colors.text.white} />
              <Text style={styles.approveButtonText}>Approve & Send</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background.primary,
    ...Shadows.sm,
  },
  backIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    letterSpacing: -0.3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.warning + '15',
    borderBottomWidth: 1,
    borderBottomColor: Colors.warning + '30',
  },
  statusText: {
    fontSize: FontSizes.sm,
    color: Colors.warning,
    fontWeight: FontWeights.medium,
  },
  content: {
    flex: 1,
  },
  section: {
    margin: Spacing.lg,
    padding: Spacing.xl,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.card,
    ...Shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  codeCard: {
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  codeText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
  },
  codeDesc: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  codeCharge: {
    fontSize: FontSizes.base,
    color: Colors.success,
    fontWeight: FontWeights.semibold,
  },
  codeConfidence: {
    fontSize: FontSizes.xs,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
  totalChargeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  totalChargeLabel: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  totalCharge: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.success,
  },
  helperText: {
    fontSize: FontSizes.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.md,
    fontStyle: 'italic',
  },
  summaryEditor: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    minHeight: 250,
    fontSize: FontSizes.base,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  summaryBox: {
    padding: Spacing.lg,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.sm,
    maxHeight: 300,
  },
  summaryText: {
    fontSize: FontSizes.base,
    lineHeight: 24,
    color: Colors.text.primary,
  },
  detailsBox: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.sm,
  },
  detailLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  detailItem: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.md,
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  warningItem: {
    color: Colors.warning,
    fontWeight: FontWeights.medium,
  },
  followupCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.sm,
  },
  followupNeeded: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.success,
    marginBottom: Spacing.sm,
  },
  followupNotNeeded: {
    fontSize: FontSizes.base,
    color: Colors.text.secondary,
  },
  followupTimeframe: {
    fontSize: FontSizes.base,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  followupReason: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  followupType: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.warning + '20',
    borderRadius: BorderRadius.xs,
  },
  urgencyText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.warning,
  },
  calendarNote: {
    fontSize: FontSizes.sm,
    color: Colors.text.tertiary,
    marginTop: Spacing.md,
    fontStyle: 'italic',
  },
  commPlanDescription: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  commPlanBox: {
    gap: Spacing.md,
  },
  commItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  commItemText: {
    fontSize: FontSizes.base,
    color: Colors.text.primary,
  },
  costBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  costLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  costValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text.primary,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    ...Shadows.lg,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.button,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.error,
    minHeight: 56,
  },
  rejectButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.error,
    letterSpacing: 0.2,
  },
  approveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.button,
    backgroundColor: Colors.success,
    minHeight: 56,
    ...Shadows.md,
  },
  approveButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text.white,
    letterSpacing: 0.2,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loadingText: {
    fontSize: FontSizes.base,
    color: Colors.text.secondary,
    marginTop: Spacing.xl,
    fontWeight: FontWeights.medium,
  },
  errorText: {
    fontSize: FontSizes.lg,
    color: Colors.text.secondary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    fontWeight: FontWeights.medium,
  },
  backButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.button,
  },
  backButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text.white,
  },
});
