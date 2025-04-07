import {initializeApp} from "firebase/app";
import {initializeAuth, getReactNativePersistence, getAuth} from "firebase/auth";
import {getFirestore} from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig = {
    apiKey: "AIzaSyA44tSs_hPTVOi7NnX9dAQHfHZrgAZPhsw",
    authDomain: "thaisty-bb641.firebaseapp.com",
    projectId: "thaisty-bb641",
    storageBucket: "thaisty-bb641.firebasestorage.app",
    messagingSenderId: "863075536836",
    appId: "1:863075536836:web:80ded8ae2676d7ed405e91",
    measurementId: "G-97LV8B4SP8",
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
if (!auth.app.options) {
    initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
}
export {firestore, auth};
