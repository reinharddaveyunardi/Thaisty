import {initializeApp} from "firebase/app";
import {initializeAuth, getReactNativePersistence, getAuth} from "firebase/auth";
import {getFirestore} from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_DOMAIN_AUTH",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID",
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
