import { FinalSignupFormData } from '@/app/(auth)/signup'
import { db, auth } from '@/firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'

// 유저 추가
export const addUser = async (userData: FinalSignupFormData): Promise<void> => {
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
