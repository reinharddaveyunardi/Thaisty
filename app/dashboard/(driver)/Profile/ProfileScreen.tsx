import {View, Text, Dimensions, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, Image} from "react-native";
import React, {useEffect, useState} from "react";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@/constant/Colors";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {logout} from "@/hook/useAuth";
import {getUserId, removeUserId} from "@/services/SecureStore";
import {router} from "expo-router";
import {getUserData} from "@/services/api";
import Income from "../components/Income";

export default function ProfileScreen({navigation}: any) {
    const [userData, setUserData] = useState<any | null>(null);
    useEffect(() => {
        const fetchUserData = async () => {
            const userId = await getUserId();
            const userData = await getUserData({userId});
            setUserData(userData);
        };
        fetchUserData();
    }, []);
    const insets = useSafeAreaInsets();

    const handleLogout = () => {
        removeUserId();
        logout();
        router.replace("/auth/LoginScreen");
    };
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
            <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
            <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: Colors.primary}} stickyHeaderIndices={[0]}>
                <View
                    style={{
                        paddingHorizontal: 10,
                        zIndex: 999,
                        width: 54,
                        left: 10,
                        alignItems: "center",
                        top: insets.top + 20,
                        paddingTop: 10,
                        padding: 10,
                        paddingBottom: insets.bottom,
                        position: "absolute",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: "rgba(255,255,255,.1)",
                            borderRadius: 50,
                            width: 40,
                            height: 40,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={{width: "100%", height: 200, backgroundColor: Colors.primary}} />
                <View
                    style={{
                        width: "100%",
                        height: Dimensions.get("screen").height - 200,
                        bottom: 0,
                        backgroundColor: "white",
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: -10,
                        },
                        elevation: 10,
                        zIndex: 888,
                        shadowRadius: 6,
                        shadowOpacity: 0.25,
                    }}
                >
                    <View style={{paddingHorizontal: 30, marginTop: -50, flexDirection: "row", alignItems: "flex-end"}}>
                        <View
                            style={{
                                backgroundColor: Colors.white,
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                justifyContent: "center",
                                alignItems: "center",
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: -5,
                                },
                                elevation: 10,
                                zIndex: 1,
                                shadowRadius: 6,
                                shadowOpacity: 0.25,
                            }}
                        >
                            <TouchableOpacity>
                                <Image source={require("@/assets/images/profile.png")} style={{width: 90, height: 90, borderRadius: 50}} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text>{userData?.fullName}</Text>
                        </View>
                    </View>
                    <View style={{paddingHorizontal: 16, marginTop: 20}}>
                        <Income />
                    </View>
                    <View style={{alignItems: "center"}}>
                        <TouchableOpacity
                            onPress={() => handleLogout()}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 4,
                                width: "90%",
                                backgroundColor: "red",
                                padding: 16,
                                borderRadius: 10,
                                marginTop: 20,
                            }}
                        >
                            <Text style={{color: "white"}}>Log out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
