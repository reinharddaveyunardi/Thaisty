import {View, Text} from "react-native";
import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import OrderScreen from "./OrderScreen";
import ReceiptScreen from "./ReceiptScreen";
import OrderId from "./[orderId]";
import CustomerScreen from "../CustomerScreen";

const Stack = createStackNavigator();
export default function OrderStack() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="OrderScreen" component={OrderScreen} />
            <Stack.Screen name="Receipt" component={ReceiptScreen} />
            <Stack.Screen name="OngoingOrder" component={OrderId} />
            <Stack.Screen name="CustomerScreen" component={CustomerScreen} />
        </Stack.Navigator>
    );
}
