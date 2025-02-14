import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native'
import KakaoMap from '@/components/KakaoMap'
import { KAKAO_REST_API_KEY } from 'react-native-dotenv'
import { auth, db } from '@/firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'
import { router } from 'expo-router'
import { useLocation } from '@/hooks/useLocation'

export default function RegisterGym() {
  const { location, setLocation } = useLocation()
  const [searchResults, setSearchResults] = useState<
    Array<{ latitude: number; longitude: number; place_name: string }>
  >([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [animation] = useState(new Animated.Value(0))

  const searchGym = async () => {
    if (searchQuery && location) {
      setLoading(true)
      try {
        const response = await fetch(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=${searchQuery}&x=${location.longitude}&y=${location.latitude}&radius=2000`,
          {
            headers: {
              Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
            },
          }
        )
        const data = await response.json()
        setLoading(false)

        if (data.documents.length > 0) {
          const results = data.documents.map(
            (doc: { y: number; x: number; place_name: string }) => ({
              latitude: doc.y,
              longitude: doc.x,
              place_name: doc.place_name,
            })
          )
          setSearchResults(results)

          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start()
        } else {
          alert('검색 결과가 없습니다.')
        }
      } catch (error) {
        setLoading(false)
        console.error('검색 중 오류 발생:', error)
      }
    }
  }

  const handleSelectResult = async (item: {
    latitude: number
    longitude: number
    place_name: string
  }) => {
    setLocation({ latitude: item.latitude, longitude: item.longitude }) // setLocation 사용
    setSearchResults([])

    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()

    const user = auth.currentUser
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        myGym: {
          name: item.place_name,
          latitude: item.latitude,
          longitude: item.longitude,
        },
      })

      Alert.alert(`${item.place_name}이(가) 등록되었습니다!`)
      router.push('/(tabs)/home')
    } catch (error) {
      console.error('헬스장 등록 오류:', error)
      alert('헬스장 등록에 실패했습니다.')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>헬스장을 등록해주세요!</Text>
      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="헬스장 이름으로 검색하세요."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.button} onPress={searchGym}>
            <Text style={styles.buttonText}>검색</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#739fff" />
      ) : (
        searchResults.length > 0 && (
          <Animated.View style={[styles.overlay, { opacity: animation }]}>
            <TouchableWithoutFeedback onPress={() => setSearchResults([])}>
              <View style={styles.modalBackground} />
            </TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.resultList,
                {
                  transform: [
                    {
                      translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [100, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.resultListTitle}>💪🏻검색 결과</Text>
              <FlatList
                data={searchResults}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback
                    onPress={() => handleSelectResult(item)}
                  >
                    <View style={styles.resultItem}>
                      <Text style={styles.resultItemText}>
                        {item.place_name}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              />
            </Animated.View>
          </Animated.View>
        )
      )}

      {location ? (
        <KakaoMap
          latitude={location.latitude}
          longitude={location.longitude}
          height={500}
        />
      ) : (
        <Text>위치를 가져오는 중입니다...</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f8f9fd',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  searchContainer: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    height: 50,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
  button: {
    backgroundColor: '#739fff',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 10,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  resultList: {
    width: '100%',
    maxHeight: '70%',
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  resultListTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#739fff',
  },
  resultItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  resultItemText: {
    fontSize: 16,
  },
})
