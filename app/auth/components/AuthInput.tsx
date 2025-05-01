import {View, Text, TextInput, TextInputProps, StyleSheet, TouchableOpacity, Dimensions} from "react-native";
import {Ionicons} from "@expo/vector-icons";

interface AuthInputProps extends TextInputProps {
    label?: string;
    placeholder?: string;
    forPassword?: boolean;
    triggerSecureTextEntry?: () => void;
    passwordStatus?: boolean;
    conditionBorder?: any;
}

export default function AuthInput({label, placeholder, forPassword, triggerSecureTextEntry, passwordStatus, ...rest}: AuthInputProps) {
    return (
        <View>
            {forPassword ? (
                <View>
                    {label && <Text style={{color: rest.conditionBorder ? "red" : "#000000"}}>{label}</Text>}
                    <View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                borderWidth: 1,
                                width: "100%",
                                maxWidth: Dimensions.get("screen").width,
                                borderColor: rest.conditionBorder ? "red" : "#000000",
                                borderRadius: 8,
                                height: 45,
                            }}
                        >
                            <View style={{flex: 1}}>
                                <TextInput
                                    {...rest}
                                    inputMode="text"
                                    placeholder={placeholder}
                                    placeholderTextColor={rest.conditionBorder ? "red" : "#000000"}
                                    style={[Styles.inputPassword]}
                                />
                            </View>
                            <View style={{paddingRight: 12}}>
                                <TouchableOpacity onPress={triggerSecureTextEntry}>
                                    <Ionicons
                                        name={passwordStatus ? "eye-off-outline" : "eye-outline"}
                                        size={24}
                                        color={rest.conditionBorder ? "red" : "#000000"}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {rest.conditionBorder && <Text style={{color: "red"}}>{label} is required</Text>}
                    </View>
                </View>
            ) : (
                <View style={{gap: 4}}>
                    {label && <Text style={{color: rest.conditionBorder ? "red" : "#000000"}}>{label}</Text>}
                    <View>
                        <TextInput
                            {...rest}
                            placeholder={placeholder}
                            placeholderTextColor={rest.conditionBorder ? "red" : "#000000"}
                            style={[Styles.input, {borderColor: rest.conditionBorder ? "red" : "#000000"}]}
                        />
                        {rest.conditionBorder && <Text style={{color: "red"}}>{label} is required</Text>}
                    </View>
                </View>
            )}
        </View>
    );
}

const Styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 8,
        width: "100%",
        padding: 12,
    },
    inputPassword: {
        borderRadius: 8,

        width: "90%",
        padding: 12,
    },
});
