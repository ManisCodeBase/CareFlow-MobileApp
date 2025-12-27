/**
 * Workflow Service
 * 
 * Handles LangGraph multi-agent workflow operations:
 * - Start post-consultation automation workflow
 * - Check workflow status and results
 * - Approve/reject communication plans (HITL)
 * 
 * @module WorkflowService
 */

import { API_BASE_URL } from '@/constants/api';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface BillingCode {
  code: string;
  description: string;
  code_type: 'CPT' | 'ICD-10';
  charge: number;
  confidence: number;
}

export interface BillingData {
  cpt_codes: BillingCode[];
  icd10_codes: BillingCode[];
  total_charge: number;
  confidence: number;
  notes?: string;
}

export interface PatientSummary {
  html_content: string;
  key_points: string[];
  medications: string[];
  instructions: string[];
  warnings: string[];
}

export interface FollowUpPlan {
  needed: boolean;
  reason?: string;
  suggested_timeframe?: string;
  appointment_type?: 'routine' | 'urgent' | 'lab_review' | 'medication';
  urgency?: 'low' | 'medium' | 'high';
}

export interface CommunicationPlan {
  send_email: boolean;
  send_whatsapp: boolean;
  send_calendar: boolean;
  email_subject: string;
  email_body_html: string;
  whatsapp_message: string;
  estimated_cost: number;
}

export interface WorkflowStartResponse {
  consultation_id: string;
  workflow_thread_id: string;
  status: string;
  message: string;
}

export interface WorkflowStatusResponse {
  consultation_id: string;
  workflow_thread_id: string;
  current_node: string | null;
  approval_status: 'pending' | 'approved' | 'rejected' | null;
  completed: boolean;
  errors: string[];
  results: {
    billing_generated?: boolean;
    summary_generated?: boolean;
    followup_analyzed?: boolean;
    email_sent?: boolean;
    whatsapp_sent?: boolean;
    billing_data?: BillingData;
    patient_summary?: PatientSummary;
    followup_plan?: FollowUpPlan;
    communication_plan?: CommunicationPlan;
  };
}

export interface ApprovalRequest {
  notes?: string;
}

export interface ApprovalResponse {
  consultation_id: string;
  approval_status: string;
  message: string;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Start the multi-agent workflow for a completed consultation
 * 
 * This triggers the LangGraph workflow which will:
 * 1. Validate SOAP note quality
 * 2. Supervisor agent reviews for completeness
 * 3. Run 3 AI agents in parallel:
 *    - Billing Coder: Generate CPT/ICD-10 codes
 *    - Summary Generator: Create patient-friendly summary
 *    - Follow-up Analyzer: Determine follow-up needs
 * 4. Build communication plan (email, WhatsApp, calendar)
 * 5. PAUSE at human approval checkpoint (HITL)
 * 6. Wait for doctor approval via API
 * 
 * @param consultationId - UUID of the completed consultation
 * @returns Workflow thread ID and status
 * @throws Error if API call fails
 */
export async function startConsultationWorkflow(
  consultationId: string
): Promise<WorkflowStartResponse> {
  console.log(`🚀 Starting workflow for consultation ${consultationId}`);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/consultations/${consultationId}/process`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to start workflow: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('✅ Workflow started successfully:', data);
    console.log(`   Thread ID: ${data.workflow_thread_id}`);
    console.log(`   Status: ${data.status}`);
    
    return data;
  } catch (error) {
    console.error('❌ Error starting workflow:', error);
    throw error;
  }
}

/**
 * Get the current status and results of a workflow
 * 
 * Retrieves:
 * - Current workflow node
 * - Approval status (pending/approved/rejected)
 * - Generated billing codes
 * - Patient summary (HTML + structured data)
 * - Follow-up recommendations
 * - Communication plan
 * - Execution results (email/WhatsApp sent status)
 * 
 * @param consultationId - UUID of the consultation
 * @returns Complete workflow state and results
 * @throws Error if workflow not found or API call fails
 */
export async function getWorkflowStatus(
  consultationId: string
): Promise<WorkflowStatusResponse> {
  console.log(`📊 Fetching workflow status for consultation ${consultationId}`);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/consultations/${consultationId}/workflow-status`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to get workflow status: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('📈 Workflow status retrieved:', {
      current_node: data.current_node,
      approval_status: data.approval_status,
      completed: data.completed,
      has_billing: !!data.results.billing_data,
      has_summary: !!data.results.patient_summary,
      has_followup: !!data.results.followup_plan,
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error getting workflow status:', error);
    throw error;
  }
}

/**
 * Approve the communication plan and resume workflow
 * 
 * This will:
 * 1. Resume the LangGraph workflow from the human approval checkpoint
 * 2. Execute the communication plan:
 *    - Send email with PDF summary (SendGrid)
 *    - Send WhatsApp message (Twilio)
 *    - Send calendar invite if follow-up needed
 * 3. Save all results to database
 * 4. Mark workflow as completed
 * 
 * @param consultationId - UUID of the consultation
 * @param notes - Optional notes from the doctor about the approval
 * @returns Approval confirmation
 * @throws Error if API call fails
 */
export async function approveWorkflow(
  consultationId: string,
  notes?: string
): Promise<ApprovalResponse> {
  console.log(`✅ Approving workflow for consultation ${consultationId}`);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/consultations/${consultationId}/approve`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes } as ApprovalRequest),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to approve workflow: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('✅ Workflow approved successfully:', data);
    console.log('   📧 Email sent to patient');
    console.log('   💬 WhatsApp notification sent');
    
    return data;
  } catch (error) {
    console.error('❌ Error approving workflow:', error);
    throw error;
  }
}

/**
 * Reject the communication plan and request revisions
 * 
 * This will loop the workflow back to the communication plan builder
 * to regenerate the plan based on the doctor's feedback.
 * 
 * @param consultationId - UUID of the consultation
 * @param notes - Required notes explaining why the plan was rejected
 * @returns Rejection confirmation
 * @throws Error if API call fails or notes are empty
 */
export async function rejectWorkflow(
  consultationId: string,
  notes: string
): Promise<ApprovalResponse> {
  if (!notes || notes.trim().length === 0) {
    throw new Error('Rejection notes are required');
  }

  console.log(`❌ Rejecting workflow for consultation ${consultationId}`);
  console.log(`   Reason: ${notes}`);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/consultations/${consultationId}/reject`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes } as ApprovalRequest),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to reject workflow: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('🔄 Workflow rejected, plan will be rebuilt:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Error rejecting workflow:', error);
    throw error;
  }
}

/**
 * Check if a consultation has a pending workflow approval
 * 
 * Utility function to check if a workflow exists and is waiting
 * for human approval.
 * 
 * @param consultationId - UUID of the consultation
 * @returns True if workflow is pending approval, false otherwise
 */
export async function hasWorkflowPendingApproval(
  consultationId: string
): Promise<boolean> {
  try {
    const status = await getWorkflowStatus(consultationId);
    return status.approval_status === 'pending' && !status.completed;
  } catch (error) {
    // Workflow doesn't exist or error occurred
    console.log('ℹ️ No pending approval for consultation:', consultationId);
    return false;
  }
}

/**
 * Get all consultations with pending workflow approvals
 * 
 * Filters a list of consultations to find those with workflows
 * waiting for doctor approval.
 * 
 * @param consultationIds - Array of consultation UUIDs to check
 * @returns Array of consultation IDs with pending approvals
 */
export async function getPendingWorkflows(
  consultationIds: string[]
): Promise<string[]> {
  const pending: string[] = [];
  
  // Check each consultation in parallel
  const checks = consultationIds.map(async (id) => {
    const isPending = await hasWorkflowPendingApproval(id);
    if (isPending) {
      pending.push(id);
    }
  });
  
  await Promise.all(checks);
  
  console.log(`📋 Found ${pending.length} workflows pending approval`);
  return pending;
}
