import { AuthProvider } from '@/contexts/AuthProvider'
import { LocationProvider } from '@/contexts/LocationProvider'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import { queryClient } from '@/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { Image, useColorScheme } from 'react-native'

export default function RootLayout() {
  const theme = useColorScheme()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <LocationProvider>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: theme === 'dark' ? '#121212' : '#fff',
                },
                headerTintColor: theme === 'dark' ? '#fff' : '#000',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerTitle: 'Fitty',
                headerLeft: () => (
                  <Image
                    source={require('../assets/images/faceLogo_bgRemoved.png')}
                    style={{ width: 40, height: 40, marginLeft: 130 }}
                  />
                ),
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="registerGym" />
              <Stack.Screen
                name="(tabs)/home"
                options={{ headerShown: false }}
              />
            </Stack>
          </LocationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
