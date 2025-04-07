import {firestore} from "@/config/firebase";
import {collection, doc, GeoPoint, getDoc, getDocs, setDoc} from "firebase/firestore";

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

export const getFood = async () => {
    try {
        const querySnapshot = await getDocs(collection(firestore, "foods"));
        return querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        console.error("Error fetching food:", error);
        throw error;
    }
};

export const getMerchant = async ({merchantId}: {merchantId: any}) => {
    try {
        const merchantDoc = await getDoc(doc(firestore, "merchant", merchantId));
        if (merchantDoc.exists()) {
            const merchant = merchantDoc.data();
            return merchant;
        }
    } catch (error) {
        console.log(error);
    }
};

export const getRestaurant = async () => {
    try {
        const querySnapshot = await getDocs(collection(firestore, "merchant"));
        return querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        console.error("Error fetching food:", error);
        throw error;
    }
};

export const getMerchantMenu = async ({merchantId}: {merchantId: any}) => {
    try {
        const querySnapshot = await getDocs(collection(firestore, `merchant/${merchantId}/menus`));
        return querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        console.error("Error fetching menu:", error);
        throw error;
    }
};

export const saveUserLocation = async ({userId, latitude, longitude, address}: {userId: any; latitude: any; longitude: any; address: any}) => {
    console.log("Try to Saving location");
    try {
        console.log("Saving location to", userId);
        const locationRef = doc(firestore, "users", userId);
        console.log("SetDoc");
        await setDoc(
            locationRef,
            {
                location: new GeoPoint(latitude, longitude),
                address: address,
            },
            {merge: true}
        );
        console.log("Location saved successfully");
    } catch (e) {
        console.log(e);
    }
};
