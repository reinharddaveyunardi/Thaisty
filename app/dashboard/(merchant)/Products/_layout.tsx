import {createStackNavigator} from "@react-navigation/stack";
import ProductsScreen from "./Products";
import AddProducts from "./AddProducts";

const Stack = createStackNavigator();

export function ProductsLayout() {
    return (
        <Stack.Navigator initialRouteName="Products">
            <Stack.Screen name="Products" component={ProductsScreen} options={{headerShown: false}} />
            <Stack.Screen name="AddProduct" component={AddProducts} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}
