import {ColorsPallette} from "@/constants/Colors";
import {View, TouchableOpacity, Text} from "react-native";
const TabBar = ({state, descriptors, navigation}: any) => {
    <View>
        {state.routes.map((route: any, index: any) => {
            const {options} = descriptors(route.key);
            const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
            const isFocused = state.index === index;

            const onPress = () => {
                const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                }
            };

            const onLongPress = () => {
                navigation.emit({
                    type: "tabLongPress",
                    target: route.key,
                });
            };

            return (
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityState={isFocused ? {selected: true} : {}}
                    accessibilityLabel={options.tabBarAccessibilityLabel}
                    testID={options.tabBarTestID}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    style={{flex: 1}}
                >
                    <Text style={{color: isFocused ? ColorsPallette.yellow : ColorsPallette.gray}}>{label}</Text>
                </TouchableOpacity>
            );
        })}
    </View>;
};

export default TabBar;
