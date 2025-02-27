import React, { useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { UserDetail } from '@/@types/user'
import { getUserData, updateUserData } from '@/api/firebaseApi'
import { auth } from '@/firebaseConfig'
import { FontAwesome } from '@expo/vector-icons'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { router } from 'expo-router'
import { ThemeType } from '@/utils/theme'
import { useTheme } from '@/contexts/ThemeProvider'
import Friends from '@/components/Friends'

export default function MyPage() {
  const theme = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const [userData, setUserData] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [nickname, setNickname] = useState<string>('')
  const [bio, setBio] = useState<string>('')
  const [friends, setFriends] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const data = await getUserData(user.uid)
          if (data) {
            setUserData(data)
            setNickname(data.nickname)
            setBio(data.bio || '')
            setFriends(data.friends || [])
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

  const handleSaveProfile = async () => {
    if (!userData) return

    try {
      if (auth.currentUser)
        await updateUserData(auth.currentUser.uid, { nickname, bio })
      setUserData((prev) => (prev ? { ...prev, nickname, bio } : prev))
      setIsEditing(false)
      Alert.alert('저장 완료', '프로필이 업데이트 되었습니다.')
    } catch (error) {
      Alert.alert('오류', '프로필 업데이트 중 오류가 발생했습니다.')
    }
  }

  const handleLogout = async () => {
    await auth.signOut()
    Alert.alert('로그아웃', '로그인이 필요해요!')
    router.push('/login')
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#739fff" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👤내 정보</Text>

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
              <PrimaryButton
                onPress={isEditing ? handleSaveProfile : handleEditToggle}
              >
                {isEditing ? '저장' : '프로필 편집'}
              </PrimaryButton>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.separator} />
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text style={{ color: 'gray', fontSize: 16 }}>로그아웃</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.text}>사용자 정보를 찾을 수 없습니다.</Text>
      )}
      <Friends friends={friends} setFrineds={setFriends} />
    </ScrollView>
  )
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
      flexGrow: 1,
    },
    profileContainer: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: theme.elementBg,
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
      paddingHorizontal: 30,
    },
    heading: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      color: '#739fff',
    },
    text: {
      fontSize: 16,
      color: theme.grayText,
      marginTop: 5,
    },
    input: {
      fontSize: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#739fff',
      marginBottom: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      color: theme.text,
    },
    buttonContainer: {
      marginTop: 20,
      width: '100%',
      alignItems: 'center',
    },
    separator: {
      borderBottomWidth: 2,
      borderBottomColor: '#f0f0f0',
      width: '100%',
      marginBottom: 15,
    },
    logoutButton: {
      width: '100%',
      maxWidth: 300,
      paddingVertical: 14,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.borderColor,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.text,
      paddingStart: 10,
      marginTop: 20,
    },
  })
