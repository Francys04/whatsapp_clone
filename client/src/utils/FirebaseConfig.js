// set up firebase, copy from console firebase code to initialise

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDgEUCWQalWi_yiXxuA_JrHLwCYq1G3l1Q",
  authDomain: "whatsup-clone-c1933.firebaseapp.com",
  projectId: "whatsup-clone-c1933",
  storageBucket: "whatsup-clone-c1933.appspot.com",
  messagingSenderId: "1024671386453",
  appId: "1:1024671386453:web:0e770056c09eae0ac67ddc",
  measurementId: "G-K6H21JGRG7",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
