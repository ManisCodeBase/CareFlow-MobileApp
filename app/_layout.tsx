import { Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

/**
 * Root layout component for the CareFlow app
 */
export default function RootLayout() {
  const router = useRouter();
  return (
    <GestureHandlerRootView>
      <Toaster />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(doctor)" options={{ headerShown: false }} />
        <Stack.Screen
          name="new-recording"
          options={{
            title: 'New Recording',
            presentation: 'modal',
            headerLeft: () => (
              <Ionicons name="close" size={24} color="black" onPress={() => router.back()} />
            ),
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
