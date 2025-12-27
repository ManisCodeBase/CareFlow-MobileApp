/**
 * Date & Time Formatting Utilities
 * Pure functions for date/time formatting
 */

/**
 * Get time-based greeting
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

/**
 * Format date as "Day, Mon DD"
 * Example: "Mon, Dec 23"
 */
export const formatDate = (date: Date = new Date()): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
};

/**
 * Format time as "HH:MM AM/PM"
 * Example: "2:30 PM"
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Format duration in seconds to "MM:SS"
 * Example: 125 seconds → "2:05"
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format duration in seconds to "M min S sec"
 * Example: 125 seconds → "2 min 5 sec"
 */
export const formatDurationLong = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs} sec`;
  if (secs === 0) return `${mins} min`;
  return `${mins} min ${secs} sec`;
};

/**
 * Check if a date/time has passed
 */
export const isTimePassed = (dateString: string): boolean => {
  return new Date(dateString) < new Date();
};

/**
 * Get relative time string
 * Example: "2 hours ago", "in 30 minutes"
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins === 0) return 'now';
  if (diffMins === 1) return 'in 1 minute';
  if (diffMins === -1) return '1 minute ago';
  if (diffMins > 0 && diffMins < 60) return `in ${diffMins} minutes`;
  if (diffMins < 0 && diffMins > -60) return `${Math.abs(diffMins)} minutes ago`;

  const diffHours = Math.round(diffMins / 60);
  if (diffHours === 1) return 'in 1 hour';
  if (diffHours === -1) return '1 hour ago';
  if (diffHours > 0 && diffHours < 24) return `in ${diffHours} hours`;
  if (diffHours < 0 && diffHours > -24) return `${Math.abs(diffHours)} hours ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return 'tomorrow';
  if (diffDays === -1) return 'yesterday';
  if (diffDays > 0) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
};

/**
 * Format date for display in consultation list
 * Example: "Dec 23, 2023"
 */
export const formatConsultationDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
