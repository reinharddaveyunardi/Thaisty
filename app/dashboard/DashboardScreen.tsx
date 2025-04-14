import {View, Text, ActivityIndicator, SafeAreaView} from "react-native";
import React, {useEffect, useState} from "react";
import {Stack, useRouter} from "expo-router";
import {useAuth} from "@/contexts/AuthProvider";
import {getUserData} from "@/services/api";
import {getUserId} from "@/services/SecureStore";

export default function DashboardScreen() {
    const router = useRouter();
    const authState = useAuth();
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const userId = await getUserId();
            if (!userId) {
                router.push("/auth/LoginScreen");
                return;
            }
            const userData = await getUserData({userId});
            const role = userData?.role;
            setUserRole(role);

            if (!role) {
                console.log("User role not found, still trying...");
                return;
            }
            if (role === "customer") {
                router.replace("/dashboard/CustomerScreen");
            } else if (role === "merchant") {
                router.replace("/dashboard/MerchantScreen");
            } else if (role === "driver") {
                router.replace("/dashboard/DriverScreen");
            } else {
                router.replace("/auth/LoginScreen");
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    if (loading || authState.loading) {
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
