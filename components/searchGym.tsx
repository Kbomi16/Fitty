import React, { useState } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native'
import { KAKAO_MAP_JS_KEY } from 'react-native-dotenv'

type SearchGymProps = {
  location: { latitude: number; longitude: number } | null
  onSearchResult: (
    result: { latitude: number; longitude: number } | null
  ) => void
}

export default function SearchGym({
  location,
  onSearchResult,
}: SearchGymProps) {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const searchGym = async () => {
    if (!searchQuery) {
      Alert.alert('헬스장 이름을 입력하세요.')
      return
    }

    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
          searchQuery
        )}&x=${location?.longitude}&y=${location?.latitude}&radius=2000`,
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_MAP_JS_KEY}`,
          },
        }
      )
      const data = await response.json()

      if (data.documents.length > 0) {
        const firstResult = data.documents[0]
        onSearchResult({
          latitude: parseFloat(firstResult.y),
          longitude: parseFloat(firstResult.x),
        })
      } else {
        Alert.alert('검색 결과가 없습니다.')
      }
    } catch (error) {
      console.error('검색 중 오류 발생:', error)
    }
  }

  return (
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
  )
}

const styles = StyleSheet.create({
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
})
