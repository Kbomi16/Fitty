import { Stack } from 'expo-router'
import { Image } from 'react-native'

export default function RootLayout() {
  return (
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
  )
}
