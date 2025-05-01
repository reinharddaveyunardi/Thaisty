import {createStackNavigator} from "@react-navigation/stack";
import DriverScreen from "./DriverScreen";
import OrderId from "./Order/[orderId]";
import SearchOrdersScreen from "./SearchOrders/SearchOrder";
import OrderRoute from "./Order/OrderRoute";
import {DriverLocationProvider} from "@/contexts/DriverLocationProvider";
import ProfileScreen from "./Profile/ProfileScreen";
import ChatScreen from "./Order/Chat";
import ScanBarcodeScreen from "./Scan/ScanBarcodeScreen";

const Stack = createStackNavigator();
export default function DriverLayout() {
    return (
        <DriverLocationProvider>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="DriverScreen" component={DriverScreen} />
                <Stack.Screen name="OrderDetail" component={OrderId} />
                <Stack.Screen name="OrderRoute" component={OrderRoute} />
                <Stack.Screen name="SearchOrder" component={SearchOrdersScreen} />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} />
                <Stack.Screen name="ScanScreen" component={ScanBarcodeScreen} />
            </Stack.Navigator>
        </DriverLocationProvider>
    );
}
