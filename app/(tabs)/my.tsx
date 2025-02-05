import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function my() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>프로필 화면</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
  },
})
