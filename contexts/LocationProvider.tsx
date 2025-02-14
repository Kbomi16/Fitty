import React, { createContext, useState, useEffect, ReactNode } from 'react'
import * as Location from 'expo-location'

export type LocationContextType = {
  location: { latitude: number; longitude: number } | null
  hasPermission: boolean
  errorMsg: string
  setLocation: (location: { latitude: number; longitude: number }) => void
}

export const LocationContext = createContext<LocationContextType | undefined>(
  undefined
)

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const getPermissionAndLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('위치 권한을 허용해야 합니다.')
        setHasPermission(false)
        return
      }

      setHasPermission(true)
      const { coords } = await Location.getCurrentPositionAsync({})
      setLocation({ latitude: coords.latitude, longitude: coords.longitude })
    }

    getPermissionAndLocation()
  }, [])

  return (
    <LocationContext.Provider
      value={{ location, hasPermission, errorMsg, setLocation }}
    >
      {children}
    </LocationContext.Provider>
  )
}
