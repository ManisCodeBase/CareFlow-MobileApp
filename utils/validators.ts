/**
 * Validation Utilities
 * Pure functions for data validation
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (US format)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

/**
 * Validate medical record number format
 */
export const isValidMRN = (mrn: string): boolean => {
  // Format: #XXXX (4+ digits)
  return /^#\d{4,}$/.test(mrn);
};

/**
 * Validate age (1-150)
 */
export const isValidAge = (age: number): boolean => {
  return age >= 1 && age <= 150;
};

/**
 * Validate duration (must be positive)
 */
export const isValidDuration = (seconds: number): boolean => {
  return seconds > 0;
};

/**
 * Check if string is empty or whitespace
 */
export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Check if value is a valid number
 */
export const isNumeric = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Sanitize text input (remove extra whitespace)
 */
export const sanitizeText = (text: string): string => {
  return text.trim().replace(/\s+/g, ' ');
};

/**
 * Validate audio file URI
 */
export const isValidAudioUri = (uri: string | null | undefined): boolean => {
  if (!uri) return false;
  return uri.startsWith('file://') || uri.startsWith('http://') || uri.startsWith('https://');
};

/**
 * Validate consultation status
 */
export const isValidConsultationStatus = (status: string): boolean => {
  const validStatuses = ['processing', 'completed', 'failed'];
  return validStatuses.includes(status);
};

/**
 * Validate appointment status
 */
export const isValidAppointmentStatus = (status: string): boolean => {
  const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
  return validStatuses.includes(status);
};
