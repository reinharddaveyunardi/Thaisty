import {getFirestore} from "@firebase/firestore";
import {initializeApp, getApps, deleteApp, FirebaseApp} from "firebase/app";
import {initializeAuth, getReactNativePersistence, getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

let app: FirebaseApp | null = null;

export async function initFirebase(
    config: object
): Promise<{firestore: ReturnType<typeof getFirestore>; auth: ReturnType<typeof getAuth>; storage: ReturnType<typeof getStorage>}> {
    if (getApps().length > 0) {
        await deleteApp(getApps()[0]);
    }

    app = initializeApp(config);
    let auth = getAuth(app);
    if (!auth.app.options) {
        initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
        });
    }

    const firestore = getFirestore(app);
    const storage = getStorage(app);

    return {firestore, auth, storage};
}

export function getFirebaseApp() {
    if (!app) {
        throw new Error("Firebase app is not initialized");
    }
    return app;
}

export function getFirebaseFirestore() {
    return getFirestore(getFirebaseApp());
}

export function getFirebaseAuth() {
    return getAuth(getFirebaseApp());
}

export function getFirebaseStorage() {
    return getStorage(getFirebaseApp());
}
