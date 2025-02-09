import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { UserDetail } from '@/types/user'
import { getUserData } from '@/api/firebaseApi'
import { auth } from '@/firebaseConfig'
import { FontAwesome } from '@expo/vector-icons'
import Button from '@/components/ui/PrimaryButton'

export default function MyPage() {
  const [userData, setUserData] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [nickname, setNickname] = useState<string>('')
  const [bio, setBio] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const data = await getUserData(user.uid)
          if (data) {
            setUserData(data)
            setNickname(data.nickname)
            setBio(data.bio || '')
          } else {
            console.log('사용자 데이터가 없습니다.')
          }
          setIsLoading(false)
        } else {
          console.log('로그인되지 않았습니다.')
          setIsLoading(false)
        }
      })
      return () => unsubscribe()
    }

    fetchData()
  }, [])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    console.log('Profile saved:', nickname, bio)
    // Add logic to save the updated data to Firebase
  }

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('로그아웃 성공')
      })
      .catch((error) => {
        console.error('로그아웃 실패:', error)
      })
  }

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
        <View style={styles.profileContainer}>
          <Image
            source={require('../../assets/images/faceLogo.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.heading}>
              <FontAwesome name="user" size={20} color="#739fff" /> 닉네임
            </Text>
            {isEditing ? (
              <TextInput
                value={nickname}
                onChangeText={setNickname}
                style={styles.input}
              />
            ) : (
              <Text style={styles.text}>{userData.nickname}</Text>
            )}

            <Text style={styles.heading}>
              <FontAwesome name="envelope" size={20} color="#739fff" /> 이메일
            </Text>
            <Text style={styles.text}>{userData.email}</Text>

            <Text style={styles.heading}>
              <FontAwesome name="info-circle" size={20} color="#739fff" /> 한 줄
              소개
            </Text>
            {isEditing ? (
              <TextInput
                value={bio}
                onChangeText={setBio}
                style={styles.input}
              />
            ) : (
              <Text style={styles.text}>
                {userData.bio || '자기소개가 없습니다.'}
              </Text>
            )}

            <View style={styles.buttonContainer}>
              <Button
                title={isEditing ? '저장' : '프로필 편집'}
                onPress={isEditing ? handleSaveProfile : handleEditToggle}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.separator} />
            <Button title="로그아웃" onPress={handleLogout} />
          </View>
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
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  profileContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  profileDetails: {
    width: '100%',
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#739fff',
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#739fff',
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  separator: {
    borderBottomWidth: 3,
    borderBottomColor: '#000',
    marginVertical: 10,
  },
})
