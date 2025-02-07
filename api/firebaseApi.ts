import { LoginFormData } from '@/app/(auth)/login'
import { FinalSignupFormData } from '@/app/(auth)/signup'
import { db, auth } from '@/firebaseConfig'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'

// 회원가입
export const signupUser = async (
  userData: FinalSignupFormData
): Promise<void> => {
  try {
    // Firebase Authentication에 유저 등록
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    )
    const user = userCredential.user

    // Firestore에 유저 정보 저장
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      nickname: userData.nickname,
      email: userData.email,
    })
  } catch (error) {
    console.error('회원가입 실패:', error)
    throw error
  }
}

// 로그인
export const loginUser = async (
  userData: LoginFormData
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    )
    return userCredential
  } catch (error) {
    console.error('로그인 실패:', error)
    throw error
  }
}
