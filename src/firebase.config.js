import {getFirestore} from 'firebase/firestore'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDh6Yr4T2cvb2uE43yaDpa80Hcks3Gs3bY",
    authDomain: "house-marketplace-fire.firebaseapp.com",
    projectId: "house-marketplace-fire",
    storageBucket: "house-marketplace-fire.appspot.com",
    messagingSenderId: "287648806460",
    appId: "1:287648806460:web:f43f39a572d4199bdcf539"
};


initializeApp(firebaseConfig);

export const db = getFirestore();
