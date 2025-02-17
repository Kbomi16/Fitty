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
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { ExerciseCategory, Workout } from '@/@types/exercise'

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

// 운동 데이터를 카테고리별로 가져오는 함수
export const getExercises = async (): Promise<ExerciseCategory[]> => {
  try {
    const exercisesSnapshot = await getDocs(collection(db, 'exercises'))
    const exercisesList: ExerciseCategory[] = []

    // Firebase에서 받아온 운동 데이터를 각 카테고리별로 나누어서 처리
    exercisesSnapshot.forEach((doc) => {
      const data = doc.data()
      const categoryName = doc.id // 문서 ID를 카테고리명으로 사용
      const workouts = data.workouts || []

      // 카테고리별 운동 목록 생성
      const categoryWorkouts: Workout[] = workouts.map((workout: Workout) => ({
        name: workout.name,
        type: workout.type,
        sets: workout.sets,
        reps: workout.reps,
        duration: workout.duration,
      }))

      exercisesList.push({
        name: categoryName, // 카테고리 이름 (상체, 하체, 유산소)
        workouts: categoryWorkouts,
      })
    })

    return exercisesList
  } catch (error) {
    console.error('운동 데이터 가져오기 실패:', error)
    throw error
  }
}
