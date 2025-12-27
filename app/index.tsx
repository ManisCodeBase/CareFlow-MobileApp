import { Redirect } from 'expo-router';

/**
 * Root index - redirects to doctor dashboard
 */
export default function Index() {
  return <Redirect href="/(doctor)/dashboard" />;
}
