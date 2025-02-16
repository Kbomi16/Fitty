import { LoginFormData } from '@/app/(auth)/login'
import { FinalSignupFormData } from '@/app/(auth)/signup'
import { db, auth } from '@/firebaseConfig'
import { UserDetail } from '@/@types/user'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

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
    await setDoc(doc(db, 'users', user.uid), {
      nickname: userData.nickname,
      email: userData.email,
      bio: '',
      friends: [],
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

// 사용자 정보 가져오기
export const getUserData = async (uid: string): Promise<UserDetail | null> => {
  try {
    const userDocRef = doc(db, 'users', uid) // 'users' 컬렉션에서 uid에 해당하는 문서 참조
    const docSnap = await getDoc(userDocRef) // 문서 가져오기

    if (docSnap.exists()) {
      return docSnap.data() as UserDetail // UserDetail 타입으로 반환
    } else {
      console.log('사용자 정보를 찾을 수 없습니다.')
      return null
    }
  } catch (error) {
    console.error('사용자 정보 로드 실패:', error)
    return null
  }
}

// 사용자 정보 업데이트
export const updateUserData = async (
  uid: string,
  updates: { nickname?: string; bio?: string }
) => {
  try {
    const userDocRef = doc(db, 'users', uid)
    await updateDoc(userDocRef, updates)
    console.log('사용자 정보 업데이트 완료:', updates)
  } catch (error) {
    console.error('사용자 정보 업데이트 실패:', error)
    throw error
  }
}
