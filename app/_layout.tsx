import { useAuthState } from '@/hooks/useAuthState'
import { queryClient } from '@/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { Image, Text } from 'react-native'

export default function RootLayout() {
  const loading = useAuthState()

  if (loading) {
    return <Text>로딩 중...</Text>
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  )
}
