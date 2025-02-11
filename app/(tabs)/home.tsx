import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import * as Location from 'expo-location'
import KakaoMap from '@/components/KakaoMap'
import SearchGym from '@/components/searchGym'

export default function Home() {
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [searchResult, setSearchResult] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  // 현재 위치 가져오기
  const getCurrentLocation = async () => {
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

  useEffect(() => {
    getCurrentLocation()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>헬스장을 등록해주세요!</Text>
      <SearchGym location={location} onSearchResult={setSearchResult} />
      {searchResult ? (
        <KakaoMap
          latitude={searchResult.latitude}
          longitude={searchResult.longitude}
        />
      ) : location ? (
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
    fontSize: 20,
    marginBottom: 10,
  },
})
