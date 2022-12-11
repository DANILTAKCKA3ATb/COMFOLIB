// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAsMk_rKPTINgEOH8MGzrKlrxquq8ekpRo',
    authDomain: 'comfolib.firebaseapp.com',
    projectId: 'comfolib',
    storageBucket: 'comfolib.appspot.com',
    messagingSenderId: '524169685117',
    appId: '1:524169685117:web:b296b0b15f70291990a914',
    measurementId: 'G-4LTK7P0K8F',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
