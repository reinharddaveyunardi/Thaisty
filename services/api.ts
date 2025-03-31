import {firestore} from "@/config/firebase";
import {doc, getDoc} from "firebase/firestore";

export const getUserData = async ({userId}: {userId: any}) => {
    try {
        const userDoc = await getDoc(doc(firestore, "users", userId));
        if (userDoc.exists()) {
            const user = userDoc.data();
            return user;
        }
    } catch (error) {
        console.log(error);
    }
};
