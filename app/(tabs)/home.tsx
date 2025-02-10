import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import * as Location from 'expo-location'
import KakaoMap from '@/components/KakaoMap'

export default function Home() {
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  useEffect(() => {
    const getCurrentLocation = async () => {
      // 현재 위치 가져오기
      try {
        const { coords } = await Location.getCurrentPositionAsync({})
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        })
      } catch (error) {
        console.error('위치 정보를 가져오는 데 실패했습니다:', error)
      }
    }

    getCurrentLocation()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>안녕하세요!</Text>
      {location ? (
        <KakaoMap latitude={location.latitude} longitude={location.longitude} />
      ) : (
        <Text>위치를 가져오는 중입니다...</Text>
      )}
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
})
