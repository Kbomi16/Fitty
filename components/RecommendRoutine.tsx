import { ExerciseCategory, Workout } from '@/@types/exercise'
import { getExercises } from '@/api/firebaseApi'
import React, { useEffect, useMemo, useState } from 'react'
import { Text, View, FlatList, StyleSheet } from 'react-native'
import { ThemeType } from '@/utils/theme'
import { useTheme } from '@/contexts/ThemeProvider'

export default function RecommendRoutine() {
  const theme = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const [exercises, setExercises] = useState<ExerciseCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [recommendedWorkouts, setRecommendedWorkouts] = useState<Workout[]>([])

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises()
        setExercises(data)

        // 현재 날짜를 기반으로 추천 운동 조합을 설정
        const today = new Date()
        const dayOfMonth = today.getDate()

        // 짝수 날짜는 "상체+유산소", 홀수 날짜는 "하체+유산소" 추천
        const isUpperBody = dayOfMonth % 2 === 0 // 짝수일 때 상체 운동

        // 운동 카테고리 필터링
        const upperBodyExercises =
          data.find((category) => category.name === '상체')?.workouts || []
        const lowerBodyExercises =
          data.find((category) => category.name === '하체')?.workouts || []
        const cardioExercises =
          data.find((category) => category.name === '유산소')?.workouts || []

        // 추천 운동 조합 설정
        const recommended = isUpperBody
          ? [
              ...upperBodyExercises.slice(0, 5),
              ...cardioExercises.slice(0, 2), // 상체 + 유산소
            ]
          : [
              ...lowerBodyExercises.slice(0, 5),
              ...cardioExercises.slice(0, 2), // 하체 + 유산소
            ]

        setRecommendedWorkouts(recommended)
      } catch (error) {
        console.error('운동 데이터 가져오기 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    )
  }

  const renderExerciseItem = ({ item }: { item: Workout }) => (
    <View style={styles.exerciseContainer}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      <Text style={styles.exerciseType}>{item.type}</Text>
      {item.reps && item.sets && (
        <Text style={styles.exerciseDetails}>
          {item.sets}세트 {item.reps}회
        </Text>
      )}
      {item.duration && (
        <Text style={styles.exerciseDetails}>시간: {item.duration}</Text>
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥오늘의 추천 운동</Text>

      <FlatList
        horizontal
        data={recommendedWorkouts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderExerciseItem}
        showsHorizontalScrollIndicator={true}
      />
    </View>
  )
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      padding: 10,
      marginTop: 20,
      height: 210,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.text,
    },
    exerciseContainer: {
      backgroundColor: theme.elementBg,
      borderRadius: 8,
      padding: 10,
      marginRight: 12,
      width: 100,
      height: 130,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    exerciseName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 5,
    },
    exerciseType: {
      fontSize: 14,
      color: '#666',
      marginVertical: 4,
    },
    exerciseDetails: {
      fontSize: 14,
      color: '#fff',
      backgroundColor: '#739fff',
      borderRadius: 100,
      textAlign: 'center',
      padding: 1,
      marginTop: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 18,
      color: '#333',
    },
  })
