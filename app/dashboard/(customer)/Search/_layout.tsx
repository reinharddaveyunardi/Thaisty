import {createStackNavigator} from "@react-navigation/stack";
import SearchScreen from "./SearchScreen";

const Stack = createStackNavigator();
export default function SearchLayout() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SearchScreen" options={{headerShown: false}} component={SearchScreen} />
        </Stack.Navigator>
    );
}
