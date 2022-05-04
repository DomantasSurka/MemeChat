import firebase from 'firebase/app';
import "firebase/auth";

export const auth =  firebase.initializeApp({
  apiKey: "AIzaSyCNSGnrKOUOPw3eeetvxWFwbbtKM2-dJCE",
  authDomain: "mmchat-2ce08.firebaseapp.com",
  projectId: "mmchat-2ce08",
  storageBucket: "mmchat-2ce08.appspot.com",
  messagingSenderId: "155548019977",
  appId: "1:155548019977:web:6f35e4fe65d516b061b7d8"
}).auth();