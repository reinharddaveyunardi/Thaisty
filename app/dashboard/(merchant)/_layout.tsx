import {Stack} from "expo-router";

export default function MerchantLayout() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="MerchantScreen" />
        </Stack>
    );
}
