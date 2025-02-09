import { Link } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet, Alert } from 'react-native'
import * as Location from 'expo-location'
import * as SplashScreen from 'expo-splash-screen'

export default function index() {
  const [userLocation, setUserLocation] =
    useState<Location.LocationObjectCoords | null>(null) // 타입 명시
  const [gymLocation, setGymLocation] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
  }) // 헬스장 예시 위치
  const [isInRadius, setIsInRadius] = useState(false)

  // 사용자 위치 권한 요청 및 위치 가져오기
  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('위치 권한을 허용해주세요!')
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setUserLocation(location.coords) // userLocation 상태 업데이트
    }

    getLocationPermission()

    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync()
      setTimeout(async () => {
        await SplashScreen.hideAsync()
      }, 2000)
    }

    prepare()
  }, [])

  // 거리 계산 (두 위치 간의 거리)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (degree: number) => degree * (Math.PI / 180)

    const R = 6371e3 // 지구 반지름 (미터)
    const φ1 = toRad(lat1)
    const φ2 = toRad(lat2)
    const Δφ = toRad(lat2 - lat1)
    const Δλ = toRad(lon2 - lon1)

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const distance = R * c // 거리 (미터)
    return distance
  }

  // "확인" 버튼 클릭 시
  const handleCheckIn = () => {
    if (userLocation) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        gymLocation.latitude,
        gymLocation.longitude
      )

      // 50m 내에 있으면 헬스 목표 완료 처리
      if (distance <= 50) {
        setIsInRadius(true)
        Alert.alert('헬스 목표를 완료했습니다!')
      } else {
        Alert.alert(
          '헬스장의 반경 내에 있지 않습니다. 50m 이내에서 확인 버튼을 눌러주세요.'
        )
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>안녕하세요!</Text>

      {/* 사용자 위치 정보 표시 */}
      {userLocation && (
        <Text style={styles.text}>
          현재 위치: {userLocation.latitude.toFixed(4)},
          {userLocation.longitude.toFixed(4)}
        </Text>
      )}

      {/* 헬스장 위치 정보 표시 */}
      <Text style={styles.text}>
        헬스장 위치: {gymLocation.latitude.toFixed(4)},
        {gymLocation.longitude.toFixed(4)}
      </Text>

      {/* 50m 이내 확인 버튼 */}
      <Button title="확인" onPress={handleCheckIn} />

      {/* 완료 여부 표시 */}
      {isInRadius && <Text style={styles.success}>헬스 목표 완료!</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
