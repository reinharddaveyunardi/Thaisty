import {View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView} from "react-native";
import React, {useEffect} from "react";
import {Colors} from "@/constant/Colors";
import {Ionicons} from "@expo/vector-icons";
import {logout} from "@/hook/useAuth";
import {removeUserId} from "@/services/SecureStore";
import {useRouter} from "expo-router";

export default function ProfileScreen({navigation}: any) {
    const router = useRouter();
    const handleLogOut = async () => {
        router.replace("/auth/LoginScreen");
        await removeUserId();
        await logout();
    };
    // useEffect(() => {
    //     navigation.getParent()?.setOptions({tabBarStyle: {display: "none"}});

    //     return () => {
    //         navigation.getParent()?.setOptions({tabBarStyle: {backgroundColor: "#fff"}});
    //     };
    // }, [navigation]);

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={() => handleLogOut()}>
                <Text>Log out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
