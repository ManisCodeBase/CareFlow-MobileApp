/**
 * Layout for Doctor's Clinical Workflow
 * Wraps all clinical screens
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function DoctorLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="patient/[id]" />
        <Stack.Screen
          name="recording/[appointmentId]"
          options={{
            animation: 'fade',
            gestureEnabled: false, // Prevent accidental swipe during recording
          }}
        />
        <Stack.Screen
          name="review/[consultationId]"
          options={{
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}
