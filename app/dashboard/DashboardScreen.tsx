import {View, Text, ActivityIndicator} from "react-native";
import React, {useEffect, useState} from "react";
import {useRouter} from "expo-router";
import {getUserId} from "@/services/SecureStore";
import {doc, getDoc} from "firebase/firestore";
import {auth, firestore} from "@/config/firebase";
import {onAuthStateChanged} from "firebase/auth";

export default function DashboardScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [userData, setUserData] = useState<any | null>(null);

    useEffect(() => {
        const checkUserSession = async () => {
            if (isChecked) return;

            try {
                const userId = await getUserId();
                if (!userId) {
                    router.replace("/auth/LoginScreen");
                    return;
                }
                const userDoc = await getDoc(doc(firestore, "users", userId));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsChecked(true);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsChecked(true);
            } else {
                checkUserSession();
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userData) {
            if (userData.type === "merchant") {
                router.replace("/dashboard/(merchant)/MerchantScreen");
            } else if (userData.type === "customer") {
                router.replace("/dashboard/(customer)/CustomerScreen");
            } else if (userData.type === "driver") {
                router.replace("/dashboard/(driver)/DriverScreen");
            }
        }
    }, [userData]);
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            {loading && <ActivityIndicator size="large" color={"#000000"} />}
            <Text>Loading..</Text>
        </View>
    );
}
