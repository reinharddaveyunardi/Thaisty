import {StyleSheet, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Image, Text, RefreshControl, StatusBar} from "react-native";
import React, {useEffect, useState} from "react";
import RecommendedFoods from "@/components/ui/RecommendationSection";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constant/Colors";
import PromoBanner from "@/components/ui/PromoBanner";
import {getUserId} from "@/services/SecureStore";
import {useRouter} from "expo-router";
import {auth, firestore} from "@/config/firebase";
import {doc, getDoc} from "firebase/firestore";
import {onAuthStateChanged, User} from "firebase/auth";
import {getUserData} from "@/services/api";

export default function CustomerScreen({navigation}: any) {
    const [refreshing, setRefreshing] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [userData, setUserData] = useState<any | null>(null);
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        const userId = await getUserId();
        const userData = await getUserData({userId: userId});
        setUserData(userData);
        setRefreshing(false);
    }, []);

    useEffect(() => {
        const checkUserSession = async () => {
            if (isChecked) return;
            try {
                const userId = await getUserId();
                const userData = await getUserData({userId: userId});
                setUserData(userData);
            } catch (error) {
                console.log(error);
            } finally {
                setIsChecked(true);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsChecked(true);
            } else {
                checkUserSession();
            }
        });

        return () => unsubscribe();
    }, [userData]);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff", height: " 100%"}}>
            <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
            <ScrollView
                stickyHeaderIndices={[1]}
                style={{height: "100%", width: "100%", backgroundColor: "#fff"}}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate("ProfileScreen")}
                    style={{width: "100%", paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}
                >
                    <View style={{height: 60, width: "auto", alignItems: "center", flexDirection: "row", gap: 12}}>
                        <View>
                            <Image source={require("@/assets/images/profile.png")} style={{width: 50, height: 50, borderRadius: 50}} />
                        </View>
                        <View style={{flexDirection: "column", gap: 4, justifyContent: "center"}}>
                            <Text>{userData?.fullName}</Text>
                            <View style={{flexDirection: "row", alignItems: "center", gap: 8}}>
                                <FontAwesome6 name="location-dot" size={16} color={Colors.primary} />
                                <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                                    <Text>{userData?.address_one}</Text>
                                    <Ionicons name="chevron-down" size={16} color={Colors.primary} />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Ionicons name="cart-outline" size={24} color="black" />
                    </View>
                </TouchableOpacity>
                <View
                    style={{
                        height: 60,
                        backgroundColor: "#fff",
                        paddingBottom: 16,
                        width: "100%",
                        shadowColor: "#000",
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.1,
                        shadowRadius: 1,
                        paddingHorizontal: 16,
                        borderBottomLeftRadius: 16,
                        borderBottomRightRadius: 16,
                        paddingVertical: 12,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Search")}
                        style={{flexDirection: "row", width: "100%", alignItems: "center", borderWidth: 0.2, borderRadius: 10, paddingHorizontal: 10}}
                    >
                        <Ionicons name="search" size={24} color="black" />
                        <View style={{alignItems: "flex-start", height: 40, justifyContent: "center"}}>
                            <Text>Search Thailand Restaurant</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{paddingHorizontal: 16}}>
                    <View style={{marginTop: 16}}>
                        <PromoBanner />
                    </View>
                    <View style={{marginTop: 16}}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8}}>
                            <Text style={{fontSize: 16}}>Preference Foods</Text>
                            <TouchableOpacity>
                                <View>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("SeeAllScreen")}
                                        style={{flexDirection: "row", alignItems: "center", gap: 4}}
                                    >
                                        <Text style={{color: Colors.primary}}>See All</Text>
                                        <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <RecommendedFoods navigation={navigation} userPreferences={userData?.allergies} />
                    </View>
                    {/* <View>
                        <FilterFood navigation={navigation} />
                    </View> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
