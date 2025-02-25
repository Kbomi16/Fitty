import * as Notifications from 'expo-notifications'

export const scheduleNotifications = async () => {
  const notificationSchedules = [
    { hour: 10, message: '🌅 굿모닝! 오늘도 헬스장 가야죠? 💪🏻' },
    { hour: 14, message: '오늘 운동을 완료했나요? 💪🏻' },
    { hour: 20, message: '오늘 운동을 완료했나요? 💪🏻' },
  ]

  for (const { hour, message } of notificationSchedules) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🏋️ 운동할 시간!',
        body: message,
        sound: 'default',
      },
      trigger: {
        type: 'daily',
        hour,
        minute: 0,
        repeats: true,
      } as Notifications.DailyTriggerInput,
    })
  }
}

// export const testNotification = async () => {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: '🚀 테스트 알림',
//       body: '테스트 알림입니다!',
//       sound: 'default',
//     },
//     trigger: null, // 즉시 실행
//   })
// }
