import {Text, View} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import Login from "./get-started/Login";
import DashboardScreen from "./dashboard/DashboardScreen";
import LoginScreen from "./get-started/Login";
import {Ionicons} from "@expo/vector-icons";
import {Tabs} from "expo-router";
import TabBar from "@/components/TabBar";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const GetStarted = function GetStarted() {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const Main = function Main() {
    return (
        <NavigationContainer independent={true}>
            <Tab.Navigator>
                <Tab.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{headerShown: false, tabBarIcon: () => <Ionicons name="home-outline" size={24} color="black" />}}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default function Index() {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
                <Stack.Screen name="Main" component={Main} options={{headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
