import {auth, firestore} from "@/config/firebase";
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    GeoPoint,
    getDoc,
    getDocs,
    increment,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
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
    try {
        const locationRef = doc(firestore, "users", userId);
        await setDoc(
            locationRef,
            {
                location: new GeoPoint(latitude, longitude),
                address: address,
            },
            {merge: true}
        );
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
    try {
        const today = format(new Date(), "yyyy-MM-dd");
        const earningsRef = doc(firestore, "users", userId, "earnings", today);

        const snapShot = await getDoc(earningsRef);

        if (snapShot.exists()) {
            const earningsData = snapShot.data();
            return earningsData?.amount || 0;
        } else {
            return 0;
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

export const getSavedAddress = async ({userId}: {userId: any}) => {
    try {
        const querySnapshot = await getDocs(collection(firestore, "users", userId, "savedAddress"));
        const savedAddresses = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return savedAddresses;
    } catch (error) {
        console.log("Error fetching user data:", error);
        return [];
    }
};

export const deleteSavedAddress = async ({userId, addressId}: {userId: any; addressId: any}) => {
    try {
        await deleteDoc(doc(firestore, "users", userId, "savedAddress", addressId));
    } catch (error) {
        console.log("Error deleting saved address:", error);
    }
};

export const getMenuIngredients = async ({menuId, merchantId}: {menuId: any; merchantId: any}) => {
    try {
        const ingredientsRef = collection(firestore, "merchant", merchantId, "menus", menuId, "ingredients");
        const snapshot = await getDocs(ingredientsRef);
        const res = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        return res;
    } catch (error) {
        console.log("Error fetching menu ingredients:", error);
    }
};

export const sendMessage = async ({chatId, senderId, text, type}: {chatId: any; senderId: any; text: string; type: string}) => {
    await addDoc(collection(firestore, "chats", chatId, "messages"), {
        type,
        senderId,
        text,
        sentAt: serverTimestamp(),
    });
    console.log("Message sent successfully");
};

export const listenToMessages = ({chatId, callback}: {chatId: any; callback: any}) => {
    const q = query(collection(firestore, "chats", chatId, "messages"), orderBy("sentAt", "asc"));
    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        callback(messages);
    });
};

export const fetchIncomeData = async ({userId, timeFrame}: {userId: any; timeFrame: any}) => {
    const today = new Date();
    let days = 7;

    if (timeFrame === "monthly") days = 30;
    else if (timeFrame === "3months") days = 90;
    else if (timeFrame === "6months") days = 180;

    const earnings: number[] = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        const docRef = doc(firestore, "users", userId, "earnings", dateStr);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const amount = docSnap.data()?.amount || 0;
            earnings.push(amount);
        } else {
            earnings.push(0);
        }
    }

    return earnings;
};

export const addProduct = async ({merchantId, product}: {merchantId: string; product: any}) => {
    try {
        if (!merchantId) throw new Error("Merchant ID is missing");

        const productsRef = collection(firestore, "merchant", merchantId, "products");
        const ref = await addDoc(productsRef, product);
        if (!ref?.id) {
            const fallbackDocRef = doc(productsRef);
            await setDoc(fallbackDocRef, product);
        }

        console.log("✅ Product added with ID:", ref.id);
        return ref.id;
    } catch (error) {
        console.error("❌ Failed to add product:", error);
        throw error;
    }
};

export const Topup = async ({userId, amount, method}: {userId: string; amount: number; method: string}) => {
    try {
        const userRef = doc(firestore, "users", userId);
        const historyTopupRef = collection(firestore, "users", userId, "historyTopup");
        const q = query(historyTopupRef, limit(1));
        const existingHistory = await getDocs(q);
        let status = "confirmed";
        if (!existingHistory.empty || existingHistory.empty) {
            await addDoc(historyTopupRef, {
                amount,
                createdAt: serverTimestamp(),
                method: method,
                status: "confirmed",
            });
        }
        if (!userRef) {
            if (status === "confirmed") await setDoc(userRef, {balance: amount}, {merge: true});
        }
        if (status === "confirmed") await updateDoc(userRef, {balance: increment(amount)});
    } catch (error) {
        throw error;
    }
};
