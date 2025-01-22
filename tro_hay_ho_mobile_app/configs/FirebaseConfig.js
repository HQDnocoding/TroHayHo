// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCd2RBPW62qDNIGx5OtTh1DkGaV_g8RO48",
    authDomain: "trohayho.firebaseapp.com",
    databaseURL: "https://trohayho-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "trohayho",
    storageBucket: "trohayho.firebasestorage.app",
    messagingSenderId: "749755699600",
    appId: "1:749755699600:web:a4aa277ee74fe3bd3e2315",
    measurementId: "G-0HD0TMMH5S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db=getDatabase()
export {app,db}