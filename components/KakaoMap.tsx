import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import { KAKAO_MAP_JS_KEY } from 'react-native-dotenv'

type KakaoMapProps = {
  latitude: number
  longitude: number
}

export default function KakaoMap({ latitude, longitude }: KakaoMapProps) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_JS_KEY}&libraries=services"></script>
        <style>
          body { margin: 0; padding: 0; height: 100%; }
          html { height: 100%; }
          #map { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          window.onload = function() {
            const mapContainer = document.getElementById('map');
            const mapOption = {
              center: new kakao.maps.LatLng(${latitude}, ${longitude}),
              level: 3
            };
            const map = new kakao.maps.Map(mapContainer, mapOption);

            // 마커 추가
            const markerPosition = new kakao.maps.LatLng(${latitude}, ${longitude});
            const marker = new kakao.maps.Marker({
              position: markerPosition
            });
            marker.setMap(map);
          };
        </script>
      </body>
    </html>
  `

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoad={() => console.log('WebView loaded successfully')}
        onError={(e) => console.error('WebView error: ', e.nativeEvent)}
        onMessage={(event) => console.log(event.nativeEvent.data)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 500,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
})
