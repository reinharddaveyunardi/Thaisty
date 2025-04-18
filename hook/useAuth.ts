import {auth} from "@/config/firebase";
import {ValidationMessages} from "@/constant/Messages";
import {removeItemFromAsyncStorage, saveItemToAsyncStorage} from "@/services/AsyncStorage";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {setDoc, doc} from "firebase/firestore";
import {firestore as db} from "@/config/firebase";
import {getUserId, saveUserId} from "@/services/SecureStore";

type loginProps = {
    email: string;
    password: string;
};

export const login = async ({email, password}: loginProps) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userId = user.uid;
        console.log("[DEBUG LOGIN] Login successful. User ID:", userId);
        await saveUserId(userId);
        const storedUserId = await getUserId();
        console.log("[DEBUG LOGIN] Retrieved User ID from SecureStore:", storedUserId);

        if (!storedUserId) {
            console.warn("[WARNING LOGIN] Failed to store user ID!");
        }
    } catch (error: any) {
        let errorMessage = ValidationMessages.stillFailed;
        switch (error.code) {
            case "auth/invalid-email":
                errorMessage = ValidationMessages.invalidEmail;
                break;
            case "auth/invalid-credential":
                errorMessage = ValidationMessages.invalidCredentials;
                break;
            case "auth/missing-password":
                errorMessage = ValidationMessages.passwordRequired;
                break;
            case "auth/missing-email":
                errorMessage = ValidationMessages.emailRequired;
                break;
            case "auth/wrong-password":
                errorMessage = ValidationMessages.invalidPassword;
                break;
        }
        console.error("[ERROR] Login failed:", errorMessage);
        throw new Error(errorMessage);
    }
};

type UserRegister = {
    email: string;
    password: string;
    fullName: string;
    allergies: any;
    address_one: string;
    address_two: string;
};

export const register = async ({email, password, fullName, allergies, address_one, address_two}: UserRegister) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
            fullName,
            email,
            allergies: allergies,
            address_one: address_one,
            address_two: address_two,
            createdAt: new Date(),
        });
        updateProfile(user, {displayName: fullName});
        console.log("User registered:", user.email);
    } catch (error: any) {
        console.error("Error registering user:", error.message);
        throw new Error(error.message);
    }
};

export const logout = async () => {
    try {
        await auth.signOut();
        await removeItemFromAsyncStorage("keepLogin");
        await removeItemFromAsyncStorage("email");
        console.log("User logged out successfully!");
    } catch (error: any) {
        console.error("Error logging out:", error.message);
        throw new Error(error.message);
    }
};
