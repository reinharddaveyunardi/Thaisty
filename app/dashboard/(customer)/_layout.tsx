import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomerScreen from "./CustomerScreen";
import ChatStack from "./Chat/_layout";
import SearchScreen from "./Search/SearchScreen";
import ShopScreen from "./Search/Shop/[id]";
import FoodScreen from "./Search/Food/[id]";
import ProfileScreen from "./Profile/ProfileScreen";
import AllPreferenceFoods from "./Search/PreferenceFoods/AllPreferenceFoods";
import {CartProvider} from "@/contexts/CartProvider";
import SelectLocationScreen from "./SelectLocation/SelectLocationScreen";
import CheckoutScreen from "./Checkout/CheckoutScreen";
import OrderScreen from "./Orders/OrderScreen";
import OrderId from "./Orders/[orderId]";
import OrderStack from "./Orders/_layout";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function CustomerLayout() {
    return (
        <CartProvider>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={Home}
                    options={{
                        tabBarIcon: ({focused}) => <Ionicons name="home" size={24} color={focused ? "#44649c" : "#a0a0a0"} />,
                        tabBarActiveTintColor: "#44649c",
                    }}
                />
                <Tab.Screen
                    name="Chat"
                    component={ChatStack}
                    options={{
                        tabBarIcon: ({focused}) => <Ionicons name="chatbubbles" size={24} color={focused ? "#44649c" : "#a0a0a0"} />,
                        tabBarActiveTintColor: "#44649c",
                    }}
                />
                <Tab.Screen
                    name="Order"
                    component={OrderStack}
                    options={{
                        tabBarIcon: ({focused}) => <Ionicons name="bag" size={24} color={focused ? "#44649c" : "#a0a0a0"} />,
                        tabBarActiveTintColor: "#44649c",
                    }}
                />
            </Tab.Navigator>
        </CartProvider>
    );
}

function Home() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="HomeScreen" component={CustomerScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Shop" component={ShopScreen} />
            <Stack.Screen name="FoodDetail" component={FoodScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="SeeAllScreen" component={AllPreferenceFoods} />
            <Stack.Screen name="SelectLocationScreen" component={SelectLocationScreen} />
            <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
            <Stack.Screen name="OngoingOrder" component={OrderId} />
        </Stack.Navigator>
    );
}
