import {View, Text, ActivityIndicator, SafeAreaView} from "react-native";
import React, {useEffect, useState} from "react";
import {Stack, useRouter} from "expo-router";
import {useAuth} from "@/contexts/AuthProvider";
import {getUserData} from "@/services/api";
import {getUserId} from "@/services/SecureStore";

export default function DashboardScreen() {
    const router = useRouter();
    const authState = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const checkAuth = async () => {
            const userId = await getUserId();
            const userData = await getUserData({userId});
            const userRole = userData?.role;
            console.log("First Try, User role:", userRole);
            if (!userId) {
                router.push("/auth/LoginScreen");
            } else if (!userRole) {
                console.log("User role not found, still trying...");
                const userId = await getUserId();
                const userData = await getUserData({userId});
                const userRole = userData?.role;
                console.log("Second Try, User role:", userRole);
                if (userRole === "customer") {
                    router.replace("/dashboard/CustomerScreen");
                } else if (userRole === "merchant") {
                    router.replace("/dashboard/MerchantScreen");
                } else if (userRole === "driver") {
                    router.replace("/dashboard/DriverScreen");
                } else {
                    router.replace("/auth/LoginScreen");
                }
            } else if (userRole === "customer") {
                router.replace("/dashboard/CustomerScreen");
            } else if (userRole === "merchant") {
                router.replace("/dashboard/MerchantScreen");
            } else if (userRole === "driver") {
                router.replace("/dashboard/DriverScreen");
            } else {
                router.replace("/auth/LoginScreen");
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    if (authState === null || authState.loading) {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: "#fff", height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <ActivityIndicator />
                    <Text>Please wait</Text>
                </View>
            </SafeAreaView>
        );
    }
    return <Stack />;
}
