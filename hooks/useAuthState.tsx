import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { User } from 'firebase/auth'
import { auth } from '@/firebaseConfig'

export const useAuthState = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        router.push('/(tabs)')
      } else {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  return loading
}
