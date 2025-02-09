import Button from '@/components/ui/PrimaryButton'
import { router } from 'expo-router'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'

export default function Start() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/fullLogo_bgRemoved.png')}
        style={styles.image}
      />
      <Text style={styles.title}>🏋️ Fitty에 오신 것을 환영합니다!</Text>
      <Text style={styles.description}>
        헬스장 등록 후 위치 인증으로 운동 기록을 관리해 보세요.
      </Text>
      <Button title="시작하기" onPress={() => router.push('/login')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 200,
    backgroundColor: '#f8f9fd',
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#457b9d',
    textAlign: 'center',
    marginBottom: 20,
  },
})
