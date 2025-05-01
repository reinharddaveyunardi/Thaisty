import {createDrawerNavigator} from "@react-navigation/drawer";
import MerchantScreen from "./MerchantScreen";
import {Colors} from "@/constant/Colors";
import {Feather, Ionicons} from "@expo/vector-icons";
import ProductsScreen from "./Products/Products";
import {ProductsLayout} from "./Products/_layout";

const Drawer = createDrawerNavigator();

export default function MerchantLayout() {
    return (
        <Drawer.Navigator screenOptions={{headerShown: false}}>
            <Drawer.Screen
                name="Dashboard"
                component={MerchantScreen}
                options={{
                    drawerActiveBackgroundColor: Colors.primarySemiTrasnparent,
                    drawerActiveTintColor: "#fff",
                    drawerIcon: () => <Ionicons name="home" size={16} color={Colors.primary} />,
                    drawerInactiveTintColor: Colors.primary,
                    drawerLabelStyle: {
                        color: Colors.primary,
                    },
                    drawerInactiveBackgroundColor: "#fff",
                    headerPressOpacity: 0,
                }}
            />
            <Drawer.Screen
                name="Products"
                component={ProductsLayout}
                options={{
                    headerShown: false,
                    drawerActiveBackgroundColor: Colors.primarySemiTrasnparent,
                    drawerActiveTintColor: "#fff",
                    drawerIcon: () => <Feather name="package" size={16} color={Colors.primary} />,
                    drawerInactiveTintColor: Colors.primary,
                    drawerLabelStyle: {
                        color: Colors.primary,
                    },
                    drawerInactiveBackgroundColor: "#fff",
                    headerPressOpacity: 0,
                }}
            />
        </Drawer.Navigator>
    );
}
