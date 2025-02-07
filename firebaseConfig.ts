// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyC-veKqqZ2iNDJQ267z12b1RoRJYLGe5SM',
  authDomain: 'fitty-3bee9.firebaseapp.com',
  projectId: 'fitty-3bee9',
  storageBucket: 'fitty-3bee9.firebasestorage.app',
  messagingSenderId: '153507038527',
  appId: '1:153507038527:web:76fc8ce05b3d7f477a7f8a',
  measurementId: 'G-J957HM0SHQ',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const db = getFirestore(app)
