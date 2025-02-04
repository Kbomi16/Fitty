import { Link } from 'expo-router'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

export default function index() {
  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync()
      setTimeout(async () => {
        await SplashScreen.hideAsync()
      }, 2000)
    }

    prepare()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>안녕하세요!</Text>
      <Link href="/setting" style={styles.text}>
        go to setting
      </Link>
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
