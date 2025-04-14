import {View, Text, SafeAreaView, TouchableOpacity} from "react-native";
import React, {useEffect, useState} from "react";
import NetInfo from "@react-native-community/netinfo";
import {useRouter} from "expo-router";

export default function OfflineScreen() {
    const [isConnected, setIsConnected] = useState(true);
    const router = useRouter();
    const onRetry = () => {
        NetInfo.addEventListener((state) => {
            if (state.isConnected) {
                setIsConnected(true);
            } else {
                setIsConnected(false);
            }
        });

        if (isConnected) {
            router.replace("/dashboard/DashboardScreen");
        } else {
            return;
        }
    };
    return (
        <SafeAreaView style={{flex: 1}}>
            <Text>You are Offline</Text>
            <Text>{isConnected ? "Connected" : "Disconnected"}</Text>
            {onRetry && (
                <TouchableOpacity onPress={onRetry}>
                    <Text>Retry</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}
