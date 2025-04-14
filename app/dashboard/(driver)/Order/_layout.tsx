import {createStackNavigator} from "@react-navigation/stack";
import OrderId from "./[orderId]";
import OrderRoute from "./OrderRoute";

const Stack = createStackNavigator();
export default function DriverLayout() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="OrderDetail" component={OrderId} />
            <Stack.Screen name="OrderRoute" component={OrderRoute} />
        </Stack.Navigator>
    );
}
