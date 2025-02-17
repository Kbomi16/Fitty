import { getUserData } from '@/api/firebaseApi'
import RecommendRoutine from '@/components/RecommendRoutine'
import { useAuth } from '@/contexts/AuthProvider'
import { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Calendar } from 'react-native-calendars'

export default function CalendarScreen() {
  const { user } = useAuth()
  const [completedDates, setCompletedDates] = useState<{
    [key: string]: { selected: boolean; marked: boolean; selectedColor: string }
  }>({})

  useEffect(() => {
    const fetchUserCompleteData = async () => {
      if (!user) return
      const userData = await getUserData(user.uid)

      if (userData?.completeDate) {
        // completeDate 문자열 -> 배열로 변환
        const dates = Array.isArray(userData.completeDate)
          ? userData.completeDate
          : [userData.completeDate]

        const formattedDates = dates.reduce(
          (
            acc: {
              [key: string]: {
                selected: boolean
                marked: boolean
                selectedColor: string
              }
            },
            date: string
          ) => {
            acc[date] = {
              selected: true,
              marked: false,
              selectedColor: '#739fff',
            }
            return acc
          },
          {}
        )
        setCompletedDates(formattedDates)
      } else {
        console.log('완료 날짜가 없음 또는 형식이 잘못됨')
      }
    }

    fetchUserCompleteData()
  }, [user])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌟운동 완료 기록</Text>
      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={completedDates}
          theme={{
            selectedDayBackgroundColor: '#739fff',
            selectedDayTextColor: '#fff',
            arrowColor: '#739fff',
            monthTextColor: '#5f6368',
            textDayFontSize: 18,
            textMonthFontSize: 20,
          }}
        />
      </View>
      <RecommendRoutine />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f8fc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    paddingStart: 10,
    marginTop: 20,
  },
  calendarContainer: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    padding: 10,
  },
})
