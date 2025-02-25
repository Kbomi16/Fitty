# 🏋🏻Fitty

피트니스 관리 애플리케이션

피트니스 관리 앱 **Fitty**는 여러분이 헬스장을 등록하고, 헬스장에 도착하면 인증을 완료할 수 있는 피트니스 동반자입니다! 🏋️‍♂️

## 📍deploy

[expo go 앱을 통해 테스트해보세요!](<https://expo.dev/preview/update?message=%E2%9C%A8%20feat%3A%20%EC%95%8C%EB%A6%BC%20%EA%B5%AC%ED%98%84%20(%2311)%0A%0A*%20%F0%9F%92%84%20style%3A%20input%20border%20%ED%81%AC%EA%B8%B0%20%EC%88%98%EC%A0%95%0A%0A*%20%E2%9C%A8%20feat%3A%20%EC%95%8C%EB%A6%BC%20%EA%B5%AC%ED%98%84%0A%0A*%20%E2%9C%85%20test%3A%20%EC%95%8C%EB%A6%BC%20%ED%85%8C%EC%8A%A4%ED%8A%B8%20%EC%8B%9C%EA%B0%84%20%EC%A1%B0%EC%A0%95&updateRuntimeVersion=1.0.0&createdAt=2025-02-25T15%3A32%3A15.490Z&slug=exp&projectId=e425239e-3be5-45d8-8997-bd3611f46083&group=350366de-2711-453d-9ff6-311f05f6ef9f>)

## 📍**개발 기간**

2024.02 ~

## 📍**주요 기능**

### 1️⃣ **헬스장 인증**

- 카카오 맵 API를 통해 현재 사용자 위치를 기반으로 근처 헬스장을 검색할 수 있습니다.
- 헬스장 등록: 사용자는 자신의 헬스장을 등록할 수 있습니다.
- 반경 50m 내 인증: 사용자가 설정한 헬스장 반경 내에 들어가면 인증을 완료할 수 있습니다.

### 2️⃣ **운동 루틴 설정**

- 운동 기록: 사용자는 각 운동의 세트, 반복 횟수 등을 추천받고, 목표를 달성할 수 있습니다.

### 3️⃣ **알림 시스템**

- Firebase Cloud Messaging (FCM)을 사용하여 운동 루틴에 대한 알림을 푸시 알림으로 전달합니다.

## 📍**기술 스택**

- React Native, Firebase, React Query, Expo, Kakao Map

### TODO

- 운동 루틴 추천 받기, 알림 시스템, 친구 추가
