import {View, Text, TextInput, TextInputProps, StyleSheet, Touchable, TouchableOpacity, Dimensions} from "react-native";
import React from "react";
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
                    {label && <Text>{label}</Text>}
                    <View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                borderWidth: 1,
                                width: "100%",
                                maxWidth: Dimensions.get("screen").width,
                                borderColor: "#000000",
                                borderRadius: 8,
                                height: 45,
                            }}
                        >
                            <View style={{flex: 1}}>
                                <TextInput
                                    {...rest}
                                    inputMode="text"
                                    placeholder={placeholder}
                                    placeholderTextColor={"#000000"}
                                    style={[Styles.inputPassword]}
                                />
                            </View>
                            <View style={{paddingRight: 12}}>
                                <TouchableOpacity onPress={triggerSecureTextEntry}>
                                    <Ionicons name={passwordStatus ? "eye-off-outline" : "eye-outline"} size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            ) : (
                <View>
                    {label && <Text>{label}</Text>}
                    <View>
                        <TextInput {...rest} placeholder={placeholder} placeholderTextColor={"#000000"} style={Styles.input} />
                    </View>
                </View>
            )}
        </View>
    );
}

const Styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 8,
        width: "100%",
        padding: 12,
        marginBottom: 12,
    },
    inputPassword: {
        borderRadius: 8,
        width: "90%",
        padding: 12,
    },
});
