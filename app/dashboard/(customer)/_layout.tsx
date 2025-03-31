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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function CustomerLayout() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: "absolute",
                    height: 60,
                    width: "85%",
                    elevation: 1,
                    marginBottom: "3%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                    marginHorizontal: 30,
                    shadowColor: "#000",
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                    borderWidth: 0.2,
                    zIndex: 99,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({focused}) => <Ionicons name="home" size={24} color={focused ? "#44649c" : "#a0a0a0"} />,
                    headerPressOpacity: 0,
                    headerPressColor: "#fff",
                }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatStack}
                options={{
                    tabBarIcon: ({focused}) => <Ionicons name="chatbubbles" size={24} color={focused ? "#44649c" : "#a0a0a0"} />,
                }}
            />
        </Tab.Navigator>
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
        </Stack.Navigator>
    );
}
