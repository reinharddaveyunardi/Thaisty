import {getAuth, getIdTokenResult, User} from "firebase/auth";

export const checkTokenValidity = async () => {
    try {
        const auth = getAuth();
        const user: User | null = auth.currentUser;

        if (!user) {
            console.log("❌ User belum login.");
            return false;
        }
        const idTokenResult = await getIdTokenResult(user);
        const expiryTime = new Date(idTokenResult.expirationTime).getTime();
        const currentTime = new Date().getTime();

        if (currentTime < expiryTime) {
            console.log("✅ Token masih valid.");
            return true;
        } else {
            console.log("⏳ Token sudah expired.");
            return false;
        }
    } catch (error) {
        console.error("⚠️ Gagal mengecek token:", error);
        return false;
    }
};
