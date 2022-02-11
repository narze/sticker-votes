// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwRxrSU_b7mhyFrmO2-Ntbv5-Uwh4ZHgA",
  authDomain: "sticker-vote.firebaseapp.com",
  projectId: "sticker-vote",
  storageBucket: "sticker-vote.appspot.com",
  messagingSenderId: "18514044187",
  appId: "1:18514044187:web:e3364a7625e056866b1fbe",
  measurementId: "G-EYET7NWVMK",
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
// export const analytics = getAnalytics(firebaseApp)
export const db = getFirestore()
