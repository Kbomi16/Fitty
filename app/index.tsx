import React, { useEffect } from 'react'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { router } from 'expo-router'
import { View, StyleSheet, Text, Image, Alert } from 'react-native'
import * as Location from 'expo-location'

export default function Start() {
  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          '위치 권한 필요',
          '앱을 사용하려면 위치 권한이 필요합니다.',
          [{ text: '확인', onPress: () => requestLocationPermission() }]
        )
      } else {
        return
      }
    }

    requestLocationPermission()
  }, [])

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/fullLogo_bgRemoved.png')}
        style={styles.image}
      />
      <Text style={styles.title}>🏋️ Fitty에 오신 것을 환영합니다!</Text>
      <Text style={styles.description}>
        헬스장 등록 후 위치 인증으로 운동 기록을 관리해 보세요.
      </Text>
      <PrimaryButton onPress={() => router.push('/login')}>
        시작하기
      </PrimaryButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 200,
    backgroundColor: '#f8f9fd',
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#457b9d',
    textAlign: 'center',
    marginBottom: 20,
  },
})
