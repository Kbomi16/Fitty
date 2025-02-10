import React, { useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet, Alert } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import KakaoMap from '@/components/KakaoMap'

export default function Home() {
  // 서울의 위도와 경도
  const seoulLatitude = 37.5665
  const seoulLongitude = 126.978

  // 사용자 위치 권한 요청 및 위치 가져오기
  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync()
      setTimeout(async () => {
        await SplashScreen.hideAsync()
      }, 2000)
    }

    prepare()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>안녕하세요!</Text>
      <KakaoMap latitude={seoulLatitude} longitude={seoulLongitude} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fd',
  },
  text: {
    fontSize: 24,
  },
  success: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
  },
})
