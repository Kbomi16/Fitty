import { queryClient } from '@/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { Image } from 'react-native'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function RootLayout() {
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
        <Stack.Screen name="(tabs)/home" options={{ headerShown: false }} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Stack>
    </QueryClientProvider>
  )
}
