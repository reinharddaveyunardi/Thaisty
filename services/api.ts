import {auth, firestore} from "@/config/firebase";
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {collection, doc, GeoPoint, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where} from "firebase/firestore";
import {format} from "date-fns";
export const getUserData = async ({userId}: {userId: any}) => {
    try {
        const userDoc = await getDoc(doc(firestore, "users", userId));
        if (userDoc.exists()) {
            const user = userDoc.data();
            return user;
        }
    } catch (error) {
        console.log("Error fetching user data:", error);
    }
};

export const RegisterCustomers = async ({email, password, fullName, allergies}: any) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, {
            displayName: fullName,
        });
        await setDoc(doc(firestore, "users", user.uid), {
            email: user.email,
            fullName,
            allergies,
            address: "",
            role: "customer",
            location: new GeoPoint(0, 0),
        });
    } catch (error) {
        console.log("Register error:", error);
    }
};

export const RegisterMerchant = async ({email, password, merchantName}: any) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, {
            displayName: merchantName,
        });
        await setDoc(doc(firestore, "users", user.uid), {
            email: user.email,
            merchantName,
            role: "merchant",
        });
    } catch (error) {
        console.log("Register error:", error);
    }
};

export const RegisterDriver = async ({email, password, driverName}: any) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, {
            displayName: driverName,
        });
        await setDoc(doc(firestore, "users", user.uid), {
            email: user.email,
            driverName,
            role: "driver",
        });
    } catch (error) {
        console.log("Register error:", error);
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
        console.log("Error fetching merchant:", error);
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

export const getOrders = async ({orderId}: {orderId: string}) => {
    try {
        const querySnapshot = await getDoc(doc(firestore, "orders", orderId));
        if (querySnapshot.exists()) {
            const order = querySnapshot.data();
            return order;
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export const getAllOrders = async () => {
    try {
        const querySnapshot = await getDocs(collection(firestore, "orders"));
        return querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export const updateDailyEarnings = async ({userId, amount, orderId}: {userId: string; amount: number; orderId: string}) => {
    const today = new Date();
    const dateString = today.toISOString().split("T")[0];
    const dailyEarningsRef = doc(firestore, "users", userId, "earnings", dateString);
    console.log("Fetching earnings from path:", `users/${userId}/earnings/${dateString}`);

    const snapShot = await getDoc(dailyEarningsRef);
    if (snapShot.exists()) {
        const existingData = snapShot.data();
        const currentAmount = existingData?.amount || 0;
        await updateDoc(dailyEarningsRef, {
            amount: currentAmount + amount,
            date: dateString,
            orderId: orderId,
        });
    } else {
        // Jika tidak ada data, buat entri baru dengan amount
        await setDoc(dailyEarningsRef, {amount: amount, date: dateString, orderId: orderId});
    }
};

export const getAvailableOrder = (callback: (orders: any[]) => void) => {
    try {
        const q = query(collection(firestore, "orders"), where("status", "==", "looking_for_driver"));
        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            callback(data);
        });

        return unsub;
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
};

export const fetchDailyEarnings = async ({userId}: {userId: string}) => {
    console.log("Fetching earnings for user:", userId);
    try {
        const today = format(new Date(), "yyyy-MM-dd");
        const earningsRef = doc(firestore, "users", userId, "earnings", today);

        const snapShot = await getDoc(earningsRef);

        if (snapShot.exists()) {
            const earningsData = snapShot.data();
            console.log("Earnings Data:", earningsData);
            return earningsData?.amount || 0; // assuming 'amount' field exists in the document
        } else {
            console.log("No earnings data for today");
            return 0; // No data found
        }
    } catch (error) {
        console.error("Error fetching daily earnings:", error);
        return 0;
    }
};

export const getNearbyDrivers = async () => {
    const q = query(collection(firestore, "users"), where("role", "==", "driver"));
    const snapshot = await getDocs(q);
    const drivers = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    return drivers;
};
