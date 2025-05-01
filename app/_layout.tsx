import {AuthProvider} from "@/contexts/AuthProvider";
import {Stack} from "expo-router";
import {SafeAreaView} from "react-native";

export default function RootLayout() {
    return (
        <AuthProvider>
            <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
                <Stack screenOptions={{headerShown: false}} />
            </SafeAreaView>
        </AuthProvider>
    );
}
