import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Alert,
  Image,
} from 'react-native'
import { ThemeType } from '@/utils/theme'
import { useTheme } from '@/contexts/ThemeProvider'
import { FontAwesome } from '@expo/vector-icons'
import {
  getUserByNickname,
  getUserData,
  updateUserData,
} from '@/api/firebaseApi'
import { auth } from '@/firebaseConfig'
import PrimaryButton from './ui/PrimaryButton'

type FriendsProps = {
  friends: string[]
  setFrineds: Dispatch<SetStateAction<string[]>>
  // onAddFriend: () => void
}

export default function Friends({ friends, setFrineds }: FriendsProps) {
  const theme = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const [modalVisible, setModalVisible] = useState(false)
  const [search, setSearch] = useState('')

  const handleAddFriend = () => {
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSearch('')
  }

  // Firebase에 친구 추가
  const handleAddFriendToList = async () => {
    const trimmedSearch = search.trim()
    if (!trimmedSearch) {
      Alert.alert('검색어를 입력해주세요.')
      return
    }

    try {
      const user = await getUserByNickname(trimmedSearch.toLowerCase())
      if (!user) {
        Alert.alert('사용자를 찾을 수 없습니다.', '닉네임을 다시 확인해주세요.')
        return
      }

      if (friends.includes(user.nickname)) {
        Alert.alert('이미 친구로 등록되어 있습니다.')
        return
      }

      if (auth.currentUser) {
        const currentUser = await getUserData(auth.currentUser.uid)

        await updateUserData(auth.currentUser.uid, {
          friends: [...friends, user.nickname],
        })

        setFrineds((prev) => [...prev, user.nickname])

        if (currentUser?.nickname) {
          await updateUserData(user.uid!, {
            friends: [...(user.friends ?? []), currentUser.nickname],
          })
        }

        Alert.alert(
          '친구 추가 성공!',
          `${user.nickname}님과 친구가 되었습니다!`
        )
        handleCloseModal()
      }
    } catch (error) {
      console.error('친구 추가 중 오류:', error)
      Alert.alert('친구 추가 실패', '잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <View style={styles.friendsContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>👥친구 목록</Text>
        <TouchableOpacity onPress={handleAddFriend}>
          <FontAwesome name="user-plus" size={30} color="#739fff" />
        </TouchableOpacity>
      </View>
      {friends.length > 0 ? (
        friends.map((friend, index) => (
          <View key={index} style={styles.friendsElement}>
            <Image
              source={require('../assets/images/faceLogo.png')}
              style={styles.profileImage}
            />
            <Text style={styles.text}>{friend}</Text>
          </View>
        ))
      ) : (
        <View style={styles.nonFriendsContainer}>
          <Text style={styles.text}>친구가 없습니다. 친구를 추가해보세요!</Text>
        </View>
      )}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>👥친구 추가</Text>
                <TextInput
                  style={styles.input}
                  placeholder="닉네임으로 검색하세요"
                  value={search}
                  onChangeText={setSearch}
                />
                <PrimaryButton onPress={handleAddFriendToList}>
                  추가하기
                </PrimaryButton>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    friendsContainer: {
      paddingTop: 20,
      marginBottom: 20,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    friendsElement: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.elementBg,
      padding: 20,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 5,
      gap: 10,
    },
    text: {
      fontSize: 16,
      color: theme.secondaryText,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.text,
      paddingStart: 10,
      marginTop: 20,
    },
    nonFriendsContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      width: '100%',
      backgroundColor: theme.elementBg,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: theme.elementBg,
      borderRadius: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.text,
    },
    input: {
      width: '100%',
      padding: 10,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      backgroundColor: theme.elementBg,
      color: theme.text,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: '#f0f0f0',
    },
  })
