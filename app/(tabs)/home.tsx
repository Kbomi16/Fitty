import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native'
import * as Location from 'expo-location'
import KakaoMap from '@/components/KakaoMap'
import { KAKAO_REST_API_KEY } from 'react-native-dotenv'

export default function Home() {
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [searchResults, setSearchResults] = useState<
    Array<{
      latitude: number
      longitude: number
      place_name: string
    }>
  >([])
  const [searchQuery, setSearchQuery] = useState<string>('')

  // 현재 위치 가져오기
  const getCurrentLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({})
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      })
    } catch (error) {
      console.error('위치 정보를 가져오는 데 실패했습니다:', error)
    }
  }

  // 헬스장 검색
  const searchGym = async () => {
    if (searchQuery && location) {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${searchQuery}&x=${location.longitude}&y=${location.latitude}&radius=2000`,
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
          },
        }
      )
      const data = await response.json()
      if (data.documents.length > 0) {
        const results = data.documents.map(
          (doc: { y: number; x: number; place_name: string }) => ({
            latitude: doc.y,
            longitude: doc.x,
            place_name: doc.place_name,
          })
        )
        setSearchResults(results)
      } else {
        alert('검색 결과가 없습니다.')
      }
    }
  }

  const handleSelectResult = (item: {
    latitude: number
    longitude: number
  }) => {
    setLocation({ latitude: item.latitude, longitude: item.longitude })
    setSearchResults([])
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>헬스장을 등록해주세요!</Text>
      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="헬스장 이름 입력"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.button} onPress={searchGym}>
            <Text style={styles.buttonText}>검색</Text>
          </TouchableOpacity>
        </View>
      </View>

      {searchResults.length > 0 && (
        <View style={styles.resultList}>
          <Text style={styles.resultListTitle}>검색 결과:</Text>
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                onPress={() => handleSelectResult(item)}
              >
                <View style={styles.resultItem}>
                  <Text style={styles.resultItemText}>{item.place_name}</Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>
      )}

      {location ? (
        <KakaoMap latitude={location.latitude} longitude={location.longitude} />
      ) : (
        <Text>위치를 가져오는 중입니다...</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fd',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
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
  resultList: {
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
  },
  resultListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  resultItemText: {
    fontSize: 16,
  },
})
