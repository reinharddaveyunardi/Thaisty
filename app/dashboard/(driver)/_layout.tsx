import {createStackNavigator} from "@react-navigation/stack";
import DriverScreen from "./DriverScreen";
import OrderList from "./Order/OrderList";
import OrderId from "./Order/[orderId]";
import SearchOrdersScreen from "./searchOrders/SearchOrder";

const Stack = createStackNavigator();
export default function DriverLayout() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="DriverScreen" component={DriverScreen} />
            <Stack.Screen name="OrderScreen" component={OrderList} />
            <Stack.Screen name="OrderDetail" component={OrderId} />
            <Stack.Screen name="SearchOrder" component={SearchOrdersScreen} />
        </Stack.Navigator>
    );
}
