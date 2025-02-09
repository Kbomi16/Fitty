import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { onAuthStateChanged } from 'firebase/auth'
import { UserDetail } from '@/types/user'
import { getUserData } from '@/api/firebaseApi'
import { auth } from '@/firebaseConfig'

export default function MyPage() {
  const [userData, setUserData] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('onAuthStateChanged called', user) // 인증 상태 확인 로그

        if (user) {
          console.log('사용자 인증됨:', user.uid) // 인증된 사용자 로그
          const data = await getUserData(user.uid)
          console.log('Firestore에서 받은 사용자 데이터:', data) // Firestore에서 받은 데이터 확인

          if (data) {
            setUserData(data)
          } else {
            console.log('사용자 데이터가 없습니다.') // 데이터가 없을 때의 로그
          }
          setIsLoading(false)
        } else {
          console.log('로그인되지 않았습니다.') // 인증되지 않은 경우 로그
          setIsLoading(false)
        }
      })

      // 언마운트 시에 인증 상태 체크를 취소하는 함수 반환
      return () => unsubscribe()
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#739fff" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {userData ? (
        <View>
          <Text style={styles.text}>닉네임: {userData.nickname}</Text>
          <Text style={styles.text}>이메일: {userData.email}</Text>
        </View>
      ) : (
        <Text style={styles.text}>사용자 정보를 찾을 수 없습니다.</Text>
      )}
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
    fontSize: 18,
    marginBottom: 10,
  },
})
