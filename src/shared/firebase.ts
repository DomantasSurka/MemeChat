import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";

import configs from "./configs";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: "AIzaSyCNSGnrKOUOPw3eeetvxWFwbbtKM2-dJCE",
    authDomain: "mmchat-2ce08.firebaseapp.com",
    projectId: "mmchat-2ce08",
    storageBucket: "mmchat-2ce08.appspot.com",
    messagingSenderId: "155548019977",
    appId: "1:155548019977:web:6f35e4fe65d516b061b7d8"
  };
const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

enableIndexedDbPersistence(db, { forceOwnership: false });
