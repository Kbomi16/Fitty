import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View, Alert } from 'react-native'
import { auth, db } from '@/firebaseConfig'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import PrimaryButton from '@/components/ui/PrimaryButton'
import useCurrentLocation from '@/hooks/useCurrentLocation'
import { getDistance } from '@/utils/getDistance'

export default function Home() {
  const [completedToday, setCompletedToday] = useState(false) // 오늘 운동 인증 여부
  const [gymLocation, setGymLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null) // 헬스장 위치 정보
  const { location } = useCurrentLocation() // 현재 위치 가져오기

  // 헬스장 정보 세팅
  const fetchGymLocation = async (myGym: {
    latitude: string
    longitude: string
  }) => {
    if (myGym && myGym.latitude && myGym.longitude) {
      setGymLocation({
        latitude: parseFloat(myGym.latitude),
        longitude: parseFloat(myGym.longitude),
      })
    } else {
      console.error('헬스장 위치 정보가 부족합니다.')
    }
  }

  // 운동 인증 버튼
  const handleCompleteWorkout = async () => {
    const user = auth.currentUser
    if (!user) {
      Alert.alert('로그인 필요', '로그인 후에 운동 인증을 완료할 수 있습니다.')
      return
    }

    if (!location) {
      Alert.alert(
        '위치 확인 중',
        '현재 위치를 가져오는 중입니다. 잠시만 기다려주세요.'
      )
      return
    }

    if (!gymLocation) {
      Alert.alert('헬스장 위치 정보 없음', '헬스장 위치를 불러올 수 없습니다.')
      return
    }

    // 현재 위치와 헬스장 간의 거리 계산
    const distance = getDistance(
      location.latitude,
      location.longitude,
      gymLocation.latitude,
      gymLocation.longitude
    )

    // 헬스장 50m 이내일 때만 인증 가능
    if (distance > 50) {
      Alert.alert(
        '위치 확인 필요',
        '헬스장 50m 이내에서 인증 버튼을 눌러주세요.'
      )
      return
    }

    const today = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'

    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, { completeDate: today })
      setCompletedToday(true)
      Alert.alert('인증 완료', '오늘 운동 인증이 완료되었습니다!')
    } catch (error) {
      console.error('운동 인증 저장 오류:', error)
      Alert.alert('인증 실패', '다시 시도해주세요.')
    }
  }

  // 사용자 정보를 받아서 헬스장 정보를 가져오기
  const fetchUserGymLocation = async () => {
    const user = auth.currentUser
    if (user) {
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      if (userDoc.exists()) {
        const { myGym } = userDoc.data() // 사용자의 myGym 정보 가져오기
        if (myGym) {
          fetchGymLocation(myGym) // myGym의 위치 정보 가져오기
        }
      }
    }
  }

  // 사용자가 오늘 운동 인증을 했는지 확인하는 함수
  const checkCompletion = async () => {
    const user = auth.currentUser
    if (user) {
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      if (userDoc.exists()) {
        const { completeDate } = userDoc.data()
        const today = new Date().toISOString().split('T')[0]
        if (completeDate === today) {
          setCompletedToday(true) // 오늘 이미 운동 인증을 했다면 완료 상태로 설정
        }
      }
    }
  }

  useEffect(() => {
    fetchUserGymLocation()
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
