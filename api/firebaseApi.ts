import { FinalSignupFormData } from '@/app/(auth)/signup'
import { db } from '@/firebaseConfig'
import { addDoc, collection } from 'firebase/firestore'

// 유저 추가
export const addUser = async (userData: FinalSignupFormData): Promise<void> => {
  await addDoc(collection(db, 'users'), userData)
}
