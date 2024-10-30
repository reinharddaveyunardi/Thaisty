import {Image, SafeAreaView, Text, TextInput, TouchableOpacity, View} from "react-native";
import React from "react";
import {LoginScreenStyle, Styles} from "@/style/Styles";
import {ColorsPallette} from "@/constants/Colors";
import {thisDeviceHeight, thisDeviceWidth} from "@/utils";
import CustomButton from "@/components/CustomButton";

export default function LoginScreen({navigation}: any) {
    return (
        <SafeAreaView>
            <View style={{backgroundColor: ColorsPallette.gray, height: "100%"}}>
                <View>
                    <Image source={require("@/assets/images/noodle.png")} style={{width: thisDeviceWidth, height: 390}} blurRadius={1} resizeMode="cover" />
                </View>
                <View
                    style={[
                        Styles.centerItem,
                        {
                            top: thisDeviceHeight / 4,
                            backgroundColor: ColorsPallette.gray,
                            width: "100%",
                            position: "absolute",
                            borderTopLeftRadius: 200,
                            paddingVertical: 50,
                        },
                    ]}
                >
                    <View style={[Styles.roundedBorder, Styles.centerItem, {width: thisDeviceWidth / 1.2, height: thisDeviceWidth}]}>
                        <View style={[LoginScreenStyle.formBox, Styles.boxGap, {width: "100%", height: "100%"}]}>
                            <View style={Styles.rightItem}>
                                <Text style={[LoginScreenStyle.title, Styles.textStyle]}>Login</Text>
                            </View>
                            <View style={[Styles.centerItem, Styles.boxGap, {height: "100%"}]}>
                                <View style={LoginScreenStyle.inputContainer}>
                                    <Text style={Styles.textStyle}>Email</Text>
                                    <TextInput
                                        placeholder="Enter your email"
                                        placeholderTextColor={ColorsPallette.white}
                                        style={[LoginScreenStyle.input, {color: ColorsPallette.white}]}
                                    />
                                </View>
                                <View style={LoginScreenStyle.inputContainer}>
                                    <Text style={Styles.textStyle}>Password</Text>
                                    <TextInput
                                        placeholder="Enter your password"
                                        placeholderTextColor={ColorsPallette.white}
                                        style={[LoginScreenStyle.input, {color: ColorsPallette.white}]}
                                        secureTextEntry={true}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[Styles.centerItem, {width: "80%"}]}>
                        <TouchableOpacity onPress={() => navigation.navigate("Main")} style={[Styles.button, Styles.centerItem]}>
                            <Text style={Styles.textStyle}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
