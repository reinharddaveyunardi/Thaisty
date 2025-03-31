import {Slot, Stack} from "expo-router";

export default function DashboardLayout() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="DashboardScreen" />
        </Stack>
    );
}
