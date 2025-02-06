import Button from '@/components/ui/Button'
import { commonStyles } from '@/styles/commonStyles'
import { Link, router } from 'expo-router'
import { View, TextInput, StyleSheet, Text, Image } from 'react-native'

export default function Login() {
  return (
    <View style={commonStyles.container}>
      <Link href="/">
        <Image
          source={require('../../assets/images/fullLogo_bgRemoved.png')}
          style={styles.image}
        />
      </Link>
      <Text style={styles.title}>로그인</Text>
      <TextInput
        placeholder="이메일"
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput placeholder="비밀번호" secureTextEntry style={styles.input} />

      <Button title="로그인" onPress={() => router.push('/')} />

      <Text style={styles.footerText}>
        회원이 아니신가요?
        <Text style={styles.linkText} onPress={() => router.push('/signup')}>
          회원가입하러 가기
        </Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a4a4a',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    maxWidth: 300,
    height: 40,
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    marginBottom: 16,
    borderRadius: 100,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#739fff',
    width: '100%',
    maxWidth: 300,
    paddingVertical: 14,
    borderRadius: 100,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#6b7280',
  },
  linkText: {
    color: '#739fff',
    fontWeight: 'bold',
  },
})
