import {StyleSheet, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Image, Text, RefreshControl, StatusBar, Button} from "react-native";
import React, {useCallback, useEffect, useRef, useState} from "react";
import RecommendedFoods from "@/components/ui/RecommendationSection";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constant/Colors";
import PromoBanner from "@/components/ui/PromoBanner";
import {getUserId} from "@/services/SecureStore";
import {auth} from "@/config/firebase";
import {onAuthStateChanged} from "firebase/auth";
import {getUserData} from "@/services/api";
import {useCart} from "@/contexts/CartProvider";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import BottomSheet, {BottomSheetModal, BottomSheetView, BottomSheetModalProvider, BottomSheetScrollView} from "@gorhom/bottom-sheet";

export default function CustomerScreen({navigation}: any) {
    const [refreshing, setRefreshing] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [userData, setUserData] = useState<any | null>(null);
    const {cart, getTotalPrice} = useCart();
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        const userId = await getUserId();
        const userData = await getUserData({userId: userId});
        setUserData(userData);
        setRefreshing(false);
    }, []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const handlePresentModalPress = useCallback(() => {
        bottomSheetRef.current?.snapToIndex(4);

        if (cart.length == 0) {
            bottomSheetRef.current?.close();
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const userId = await getUserId();

            if (!userId) {
                console.log("User ID not found");
                return;
            }

            const data = await getUserData({userId});
            setUserData(data);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        } finally {
            setIsChecked(true);
        }
    };
    useEffect(() => {
        if (!isChecked) fetchUserData();
        setIsChecked(true);
    }, []);

    const groupedCart = cart?.reduce((acc: any, item: any) => {
        const restaurant = item.restaurant;
        if (!acc[restaurant]) {
            acc[restaurant] = [];
        }
        acc[restaurant].push(item);
        return acc;
    }, {});

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff", height: " 100%"}}>
            <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
            <GestureHandlerRootView style={styles.container}>
                <ScrollView
                    stickyHeaderIndices={[1]}
                    style={{height: "100%", width: "100%", backgroundColor: "#fff"}}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
                >
                    <View style={{width: "100%", paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <View style={{height: 60, width: "auto", alignItems: "center", flexDirection: "row", gap: 12}}>
                            <TouchableOpacity activeOpacity={0.99} onPress={() => navigation.navigate("ProfileScreen")}>
                                <Image source={require("@/assets/images/profile.png")} style={{width: 50, height: 50, borderRadius: 50}} />
                            </TouchableOpacity>
                            <View style={{flexDirection: "column", gap: 2}}>
                                <TouchableOpacity activeOpacity={0.99} onPress={() => navigation.navigate("ProfileScreen")}>
                                    <Text>{userData?.fullName}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.99}
                                    onPress={() => navigation.navigate("SelectLocationScreen")}
                                    style={{flexDirection: "column", gap: 4, justifyContent: "center"}}
                                >
                                    <View style={{flexDirection: "row", alignItems: "center", gap: 8}}>
                                        <FontAwesome6 name="location-dot" size={16} color={Colors.primary} />
                                        <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                                            <Text>{userData?.address.length > 30 ? userData?.address.slice(0, 30) + "..." : null}</Text>
                                            <Ionicons name="chevron-down" size={16} color={Colors.primary} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity onPress={handlePresentModalPress}>
                                <Ionicons name="cart-outline" size={32} color="black" />
                                <View
                                    style={{
                                        position: "absolute",
                                        top: -5,
                                        right: -5,
                                        width: 24,
                                        height: 24,
                                        borderRadius: 50,
                                        backgroundColor: "#fff",
                                        display: cart?.length > 0 ? "flex" : "none",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 50,
                                            backgroundColor: Colors.danger,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text style={{color: "#fff"}}>
                                            {cart?.map((item: any) => item.quantity).reduce((a: number, b: number) => (a + b > 99 ? 99 : a + b), 0)}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
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

                <BottomSheetModalProvider>
                    <BottomSheet
                        index={-1}
                        snapPoints={[100, 200, 300, 400]}
                        ref={bottomSheetRef}
                        enablePanDownToClose
                        style={{shadowColor: "#000", shadowOffset: {width: 0, height: -1}, elevation: 5, zIndex: 2, shadowOpacity: 0.1}}
                    >
                        <BottomSheetScrollView style={styles.contentContainer}>
                            {cart.length > 0 ? (
                                groupedCart &&
                                Object.keys(groupedCart).map((restaurant, index) => (
                                    <View key={index}>
                                        <Text style={{fontSize: 16, fontWeight: "bold", marginBottom: 8}}>{restaurant}</Text>
                                        {groupedCart[restaurant].map((item: any, index: number) => {
                                            return (
                                                <View
                                                    key={`${restaurant}-${item.name}-${index}`}
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: 8,
                                                        marginLeft: 12,
                                                        paddingLeft: 12,
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                                                        <Image source={{uri: item.img}} style={{width: 60, height: 60, borderRadius: 10}} />
                                                        <View style={{flexDirection: "column", gap: 2}}>
                                                            <Text>{item.name}</Text>
                                                            <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                                                                <Text>{item.price}</Text>
                                                                <Text>x{item.quantity}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                ))
                            ) : (
                                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{color: Colors.primary, textAlign: "center"}}>No items in cart</Text>
                                </View>
                            )}
                        </BottomSheetScrollView>
                        {cart.length > 0 && (
                            <BottomSheetView style={{alignItems: "center", marginVertical: 16}}>
                                <TouchableOpacity
                                    style={{width: "90%", backgroundColor: Colors.primary, padding: 12, borderRadius: 10, alignItems: "center"}}
                                    onPress={() => {
                                        navigation.navigate("CheckoutScreen");
                                    }}
                                >
                                    <Text style={{color: "white"}}>Checkout</Text>
                                </TouchableOpacity>
                            </BottomSheetView>
                        )}
                    </BottomSheet>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
});
