import { useState, useEffect } from 'react'
import * as Location from 'expo-location'

export default function useCurrentLocation() {
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  useEffect(() => {
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

    getCurrentLocation()
  }, [])

  return { location, setLocation } // setLocation 반환해서 외부에서 변경 가능하게 함
}
