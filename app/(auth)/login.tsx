import Button from '@/components/ui/Button'
import { loginSchema } from '@/constants/loginSchema'
import { commonStyles } from '@/styles/commonStyles'
import { Link, router } from 'expo-router'
import { View, TextInput, StyleSheet, Text, Image, Alert } from 'react-native'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '@/api/firebaseApi'
import { useAuthState } from '@/hooks/useAuthState'
import { UserCredential } from 'firebase/auth'

export type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const loading = useAuthState()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'all',
  })

  const mutation = useMutation<UserCredential, Error, LoginFormData>({
    mutationFn: loginUser,
    onSuccess: () => {
      Alert.alert('로그인 성공!', '오늘 운동을 완료하세요.')
      router.push('/(tabs)')
    },
    onError: (error: Error) => {
      console.error(error)
      Alert.alert('로그인 실패!', '이메일 또는 비밀번호를 확인해주세요.')
    },
  })

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data)
  }

  if (loading) {
    return (
      <View style={commonStyles.container}>
        <Text>로딩 중...</Text>
      </View>
    )
  }

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
        {...register('email')}
        onChangeText={(text) => setValue('email', text)}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      <TextInput
        placeholder="비밀번호"
        secureTextEntry
        style={styles.input}
        {...register('password')}
        onChangeText={(text) => setValue('password', text)}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      <Button title="로그인" onPress={handleSubmit(onSubmit)} />

      <Text style={styles.footerText}>
        계정이 없으신가요?
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
    marginBottom: 8,
    borderRadius: 100,
    backgroundColor: '#ffffff',
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
  errorText: { color: 'red', marginBottom: 8 },
})
