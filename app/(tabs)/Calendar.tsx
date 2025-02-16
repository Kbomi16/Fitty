import { getUserData } from '@/api/firebaseApi'
import { useAuth } from '@/contexts/AuthProvider'
import { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Calendar } from 'react-native-calendars'

export default function CalendarScreen() {
  const { user } = useAuth()
  const [completedDates, setCompletedDates] = useState<{
    [key: string]: { marked: boolean; dotColor?: string }
  }>({})

  useEffect(() => {
    const fetchUserWorkoutData = async () => {
      if (!user) return
      const userData = await getUserData(user.uid)

      console.log('Fetched workout data:', userData) // 🔎 디버깅 로그

      if (userData?.completeDate) {
        const formattedDates = userData.completeDate.reduce(
          (
            acc: { [key: string]: { marked: boolean; dotColor: string } },
            date: string
          ) => {
            acc[date] = { marked: true, dotColor: 'blue' }
            return acc
          },
          {}
        )
        setCompletedDates(formattedDates)
      }
    }

    fetchUserWorkoutData()
  }, [user])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>운동 완료 기록</Text>
      <Calendar
        markedDates={completedDates}
        theme={{
          todayTextColor: 'red',
          selectedDayBackgroundColor: '#739fff',
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
})
