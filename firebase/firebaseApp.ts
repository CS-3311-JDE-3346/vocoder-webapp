// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhtKEScp7RBsW19X6Eoqbk-POrKPoxBug",
  authDomain: "vocoder-webapp.firebaseapp.com",
  projectId: "vocoder-webapp",
  storageBucket: "vocoder-webapp.appspot.com",
  messagingSenderId: "894681891502",
  appId: "1:894681891502:web:b73530ef1407edbef7e33f",
  measurementId: "G-SEE2VP4G2P"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const initFbase = () => {
  return app;
}