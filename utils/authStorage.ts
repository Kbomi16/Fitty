import AsyncStorage from '@react-native-async-storage/async-storage'

// 토큰 저장
export const saveAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('authToken', token)
  } catch (error) {
    console.error('토큰 저장 실패:', error)
  }
}

// 토큰 불러오기
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('authToken')
    return token
  } catch (error) {
    console.error('토큰 불러오기 실패:', error)
    return null
  }
}

// 토큰 삭제
export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken')
  } catch (error) {
    console.error('토큰 삭제 실패:', error)
  }
}
