import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>안녕하세요!</Text>
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
