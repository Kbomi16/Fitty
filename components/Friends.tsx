import React, { useMemo } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { ThemeType } from '@/utils/theme'
import { useTheme } from '@/contexts/ThemeProvider'
import { FontAwesome } from '@expo/vector-icons'

type FriendsProps = {
  friends: string[]
  // onAddFriend: () => void
}

export default function Friends({ friends }: FriendsProps) {
  const theme = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={styles.friendsContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>👥친구 목록</Text>
        <TouchableOpacity>
          <FontAwesome name="user-plus" size={30} color="#739fff" />
        </TouchableOpacity>
      </View>
      {friends.length > 0 ? (
        friends.map((friend, index) => (
          <View key={index} style={styles.friendsElement}>
            <Text style={styles.text}>{friend}</Text>
          </View>
        ))
      ) : (
        <View style={styles.nonFriendsContainer}>
          <Text style={styles.text}>친구가 없습니다. 친구를 추가해보세요!</Text>
        </View>
      )}
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
  })
