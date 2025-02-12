import React, { useEffect, useState } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { auth, db } from '@/firebaseConfig'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import PrimaryButton from '@/components/ui/PrimaryButton'

export default function Home() {
  const [completedToday, setCompletedToday] = useState(false)

  const handleCompleteWorkout = async () => {
    const user = auth.currentUser
    if (!user) {
      Alert.alert('로그인 필요', '로그인 후에 운동 인증을 완료할 수 있습니다.')
      return
    }

    const today = new Date()
    const dateString = today.toISOString().split('T')[0] // 'YYYY-MM-DD'

    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        completeDate: dateString,
      })
      setCompletedToday(true)
      Alert.alert('인증 완료', '오늘 운동 인증이 완료되었습니다!')
    } catch (error) {
      console.error('운동 인증 저장 오류:', error)
      Alert.alert('인증 실패', '다시 시도해주세요.')
    }
  }

  useEffect(() => {
    const checkCompletion = async () => {
      const user = auth.currentUser
      if (user) {
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)
        if (userDoc.exists()) {
          const { completeDate } = userDoc.data()
          const today = new Date().toISOString().split('T')[0]
          if (completeDate === today) {
            setCompletedToday(true)
          }
        }
      }
    }

    checkCompletion()
  }, [])

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/fullLogo_bgRemoved.png')}
        style={styles.image}
      />
      <Text style={styles.title}>오늘 헬스를 완료했나요?</Text>
      <Text style={styles.text}>아래 버튼을 눌러 인증을 완료하세요!</Text>
      {completedToday ? (
        <Text style={styles.completedText}>오늘 운동 인증 완료하셨습니다!</Text>
      ) : (
        <PrimaryButton onPress={handleCompleteWorkout}>
          운동 인증 버튼
        </PrimaryButton>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#739fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedText: {
    fontSize: 18,
    color: 'green',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
})
