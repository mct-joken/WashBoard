import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtVI76j1wkjUQytFmDaQSQ_iPQhcXbVOI",
  authDomain: "test-d52ce.firebaseapp.com",
  projectId: "test-d52ce",
  storageBucket: "test-d52ce.appspot.com",
  messagingSenderId: "410733720001",
  appId: "1:410733720001:web:2751f65c06d37d642a7f40",
};

export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
