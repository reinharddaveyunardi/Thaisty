import {AuthProvider} from "@/contexts/AuthProvider";
import {Stack} from "expo-router";

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack screenOptions={{headerShown: false}} />
        </AuthProvider>
    );
}
