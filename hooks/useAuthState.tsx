import { useEffect, useState } from 'react'
import { auth } from '@/firebaseConfig'
import { getAuthToken, removeAuthToken } from '@/utils/authStorage'
import { router } from 'expo-router'
import { User } from 'firebase/auth'

export const useAuthState = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        // 유저가 인증되어 있으면 토큰 갱신 시도
        try {
          const token = await user.getIdToken(true)
          if (token) {
            await getAuthToken()
            router.push('/(tabs)')
          }
        } catch (error) {
          console.error('토큰 갱신 실패:', error)
          await removeAuthToken()
          router.push('/login')
        }
      } else {
        setLoading(false)
        await removeAuthToken()
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [])

  return loading
}
