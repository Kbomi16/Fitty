import { getUserData } from '@/api/firebaseApi'
import RecommendRoutine from '@/components/RecommendRoutine'
import { useAuth } from '@/contexts/AuthProvider'
import { ThemeType } from '@/utils/theme'
import { useState, useEffect, useMemo } from 'react'
import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { useTheme } from '@/contexts/ThemeProvider'

export default function CalendarPage() {
  const theme = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const isDark = useColorScheme()

  const { user } = useAuth()
  const [completedDates, setCompletedDates] = useState<{ [key: string]: any }>(
    {}
  )

  useEffect(() => {
    const fetchUserCompleteData = async () => {
      if (!user) return
      const userData = await getUserData(user.uid)

      if (userData?.completed) {
        const dates = Array.isArray(userData.completed)
          ? userData.completed
          : [userData.completed]

        console.log(dates)

        const formattedDates = dates.reduce(
          (acc: { [key: string]: any }, date: string) => {
            acc[date] = {
              selected: true,
              marked: false,
              selectedColor: '#fff',
              customStyles: {
                container: {
                  backgroundColor: isDark === 'dark' ? '#000' : '#739fff',
                  borderRadius: 100,
                },
                text: {
                  color: '#fff',
                },
              },
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
  }, [user, theme])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌟운동 완료 기록</Text>
      <View style={styles.calendarContainer}>
        <Calendar
          style={{ backgroundColor: 'transparent' }}
          markedDates={completedDates}
          markingType="custom"
          theme={{
            calendarBackground: 'transparent',
            selectedDayBackgroundColor: '#739fff',
            selectedDayTextColor: '#fff',
            todayTextColor: '#739fff',
            dayTextColor: '#000',
            textSectionTitleColor: '#000',
            arrowColor: '#000',
            monthTextColor: '#000',
            textDisabledColor: '#555555',
            textDayFontSize: 18,
            textMonthFontSize: 20,
          }}
        />
      </View>
      <RecommendRoutine />
    </View>
  )
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.text,
      paddingStart: 10,
      marginTop: 20,
    },
    calendarContainer: {
      width: '100%',
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: theme.elementBg,
      color: '#000',
      padding: 10,
    },
  })
