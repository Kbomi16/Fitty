import { signupSchema } from '@/constants/signupSchema'
import { Link, router } from 'expo-router'
import { View, TextInput, StyleSheet, Text, Image, Alert } from 'react-native'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { signupUser } from '@/api/firebaseApi'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { useTheme } from '@/contexts/ThemeProvider'
import { useMemo } from 'react'
import { ThemeType } from '@/utils/theme'

type SignupFormData = z.infer<typeof signupSchema>
export type FinalSignupFormData = Omit<SignupFormData, 'confirmPassword'>

export default function Signup() {
  const theme = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'all',
  })

  const mutation = useMutation<void, Error, FinalSignupFormData>({
    mutationFn: signupUser,
    onSuccess: () => {
      Alert.alert('회원가입 성공!', '이제 Fitty를 사용할 수 있어요.')
      router.push('/login')
    },
    onError: (error: Error) => {
      console.error(error)
      Alert.alert('회원가입 실패!', '다시 시도해주세요.')
    },
  })

  const onSubmit = (data: SignupFormData) => {
    const { confirmPassword, ...userData } = data
    mutation.mutate(userData)
  }

  return (
    <View style={styles.container}>
      <Link href="/">
        <Image
          source={require('../../assets/images/fullLogo_bgRemoved.png')}
          style={styles.image}
        />
      </Link>
      <Text style={styles.title}>회원가입</Text>
      <TextInput
        placeholder="닉네임"
        style={styles.input}
        keyboardType="email-address"
        {...register('nickname')}
        onChangeText={(text) => setValue('nickname', text)}
      />
      {errors.nickname && (
        <Text style={styles.errorText}>{errors.nickname.message}</Text>
      )}
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
      <TextInput
        placeholder="비밀번호 확인"
        secureTextEntry
        style={styles.input}
        {...register('confirmPassword')}
        onChangeText={(text) => setValue('confirmPassword', text)}
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
      )}

      <PrimaryButton onPress={handleSubmit(onSubmit)}>회원가입</PrimaryButton>

      <Text style={styles.footerText}>
        이미 계정이 있으신가요?
        <Text style={styles.linkText} onPress={() => router.push('/login')}>
          로그인하러 가기
        </Text>
      </Text>
    </View>
  )
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: 100,
      backgroundColor: theme.background,
    },
    image: {
      width: 300,
      height: 200,
      resizeMode: 'contain',
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.title,
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
      backgroundColor: theme.background,
      color: theme.text,
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
