import {createStackNavigator} from "@react-navigation/stack";
import DashboardChat from "./DashboardChat";
import ChatAiScreen from "./ChatAiScreen";
import ChatScreen from "./[id]/ChatScreen";

const Stack = createStackNavigator();

export default function Layout() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="DashboardChat" options={{}} component={DashboardChat} />
            <Stack.Screen name="ChatAiScreen" component={ChatAiScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>
    );
}
