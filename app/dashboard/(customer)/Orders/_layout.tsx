import {View, Text} from "react-native";
import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import OrderScreen from "./OrderScreen";
import ReceiptScreen from "./ReceiptScreen";
import OrderId from "./[orderId]";
import CustomerScreen from "../CustomerScreen";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import History from "./History";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
export default function OrderStack() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="OrderScreen" component={OrderTabs} />
            <Stack.Screen name="Receipt" component={ReceiptScreen} />
            <Stack.Screen name="OngoingOrder" component={OrderId} />
            <Stack.Screen name="CustomerScreen" component={CustomerScreen} />
        </Stack.Navigator>
    );
}

function OrderTabs() {
    return (
        <Tab.Navigator tabBarPosition="top" initialRouteName="Ongoing">
            <Tab.Screen name="Ongoing" component={OrderScreen} />
            <Tab.Screen name="History" component={History} />
        </Tab.Navigator>
    );
}
