import {View, Text, SafeAreaView, TouchableOpacity, ScrollView, StyleSheet, Image, RefreshControl, Dimensions, StatusBar} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {useRouter} from "expo-router";
import {getUserId, removeUserId} from "@/services/SecureStore";
import {logout} from "@/hook/useAuth";
import {fetchDailyEarnings, getAllOrders, getAvailableOrder, getOrders, getUserData} from "@/services/api";
import Skeleton from "@/components/ui/SkeletonLoading";
import {Colors} from "@/constant/Colors";
import {Ionicons} from "@expo/vector-icons";
import {BahtFormat} from "@/utils/FormatCurrency";

export default function DriverScreen({navigation}: any) {
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [dailyEarnings, setDailyEarnings] = useState<any>(null);
    const [availableOrders, setAvailableOrders] = useState<any | null>(null);
    const router = useRouter();

    const onRefresh = useCallback(async () => {
        setIsLoading(true);
        setRefreshing(true);
        const userId = await getUserId();
        const userData = await getUserData({userId: userId});
        setUserData(userData);
        setRefreshing(false);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const fetchUserData = async () => {
            const userId = await getUserId();
            const userData = await getUserData({userId: userId});
            setUserData(userData);
            setIsLoading(false);
        };
        fetchUserData();
        const unsubscribe = navigation.addListener("focus", () => {
            fetchUserData();
        });

        return () => unsubscribe();
    }, []);
    useEffect(() => {
        const unsub = getAvailableOrder((orders) => {
            setAvailableOrders(orders);
        });
        return () => unsub && unsub();
    }, []);
    useEffect(() => {
        const getOrderInformation = async () => {
            try {
                const currentOrderId = userData?.currentOrderId;

                if (!currentOrderId) {
                    setOrder(null);
                    return;
                }

                const fetchedOrder = await getOrders({orderId: currentOrderId});
                if (fetchedOrder?.status === "completed" || !fetchedOrder) {
                    setOrder(null);
                } else {
                    setOrder(fetchedOrder);
                }
            } catch (error) {
                console.error("Failed to fetch order data:", error);
            }
        };

        getOrderInformation();
    }, [userData?.currentOrderId]);

    useEffect(() => {
        console.log("Nyala");
        const fetchEarnings = async () => {
            const userId = await getUserId();
            if (!userId) return;
            console.log("fetching");
            const earnings = await fetchDailyEarnings({userId: userId});
            console.log("udah fetch");
            setDailyEarnings(earnings);
            console.log("Earnings:", earnings);
        };

        fetchEarnings();
    }, [userData]);
    const handleLogout = () => {
        console.log("Logging out...");
        removeUserId();
        logout();
        router.replace("/auth/LoginScreen");
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff", gap: 12}}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
            <ScrollView
                style={{flex: 1}}
                stickyHeaderIndices={[0]}
                contentContainerStyle={{gap: 12}}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={{zIndex: 0}}>
                    <View style={{height: 200, width: "100%", backgroundColor: Colors.primary}} />
                </View>
                <View
                    style={{
                        height: 150,
                        width: "90%",
                        borderRadius: 30,
                        backgroundColor: Colors.white,
                        position: "absolute",
                        top: 130,

                        zIndex: 10,
                        alignSelf: "center",
                        shadowColor: "#000",
                        shadowOffset: {width: 0, height: 4},
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 5,
                    }}
                >
                    <View style={{height: "100%", paddingHorizontal: 16, paddingVertical: 24}}>
                        <View style={{flex: 1, flexDirection: "row", gap: 12}}>
                            <View style={{flex: 1, justifyContent: "center"}}>
                                {isLoading ? (
                                    <Skeleton height={100} borderRadius={20} />
                                ) : (
                                    <Image source={require("@/assets/images/profile.png")} style={{width: 100, height: 100, borderRadius: 20}} />
                                )}
                            </View>
                            <View style={{flex: 2, justifyContent: "space-around"}}>
                                {isLoading ? (
                                    <Skeleton height={16} borderRadius={20} />
                                ) : (
                                    <Text style={{fontSize: 16, fontWeight: "bold"}}>{userData?.fullName}</Text>
                                )}
                                <View style={{width: "100%", height: 1, backgroundColor: Colors.primary}} />
                                <View>
                                    {isLoading ? (
                                        <Skeleton height={40} borderRadius={8} speed="normal" />
                                    ) : (
                                        <View
                                            style={{
                                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                                padding: 8,
                                                borderRadius: 12,
                                                width: "auto",
                                                alignItems: "center",
                                                flexDirection: "row",
                                                justifyContent: "space-around",
                                            }}
                                        >
                                            <View style={{alignItems: "center"}}>
                                                <Text style={{fontSize: 18}}>{userData?.trips}</Text>
                                                <Text style={{fontSize: 12}}>{userData?.trips === 1 || 0 ? "Trip" : "Trips"}</Text>
                                            </View>
                                            <View style={{width: 1, height: 30, backgroundColor: "rgba(0, 0, 0, 0.1)"}} />
                                            <View style={{alignItems: "center"}}>
                                                <Text style={{fontSize: 18}}>{BahtFormat(dailyEarnings)}</Text>
                                                <Text style={{fontSize: 12}}>Earnings</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{top: "150%", zIndex: 55, position: "absolute", width: "100%"}}>
                    <View
                        style={{
                            padding: 16,
                            backgroundColor: "#fff",
                            width: "90%",
                            shadowColor: "#000",
                            shadowOffset: {width: 0, height: 4},
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                            elevation: 5,
                            alignSelf: "center",
                            borderRadius: 20,
                        }}
                    >
                        {userData?.currentOrderId ? (
                            <TouchableOpacity
                                onPress={() => navigation.navigate("OrderRoute", {orderId: userData?.currentOrderId})}
                                style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}
                            >
                                <View>
                                    <View style={{flexDirection: "row", gap: 12, alignItems: "center", justifyContent: "space-between"}}>
                                        <Text style={{fontSize: 16, fontWeight: "bold"}}>You need to finish your current order</Text>
                                    </View>
                                    <View style={{gap: 2, flexDirection: "column"}}>
                                        <Text style={{fontSize: 11}}>Customer: {order?.customerName}</Text>
                                        <Text style={{fontSize: 11}}>Address: {order?.customerAddress}</Text>
                                        <Text style={{fontSize: 11}}>Total: {BahtFormat(order?.fee)}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Ionicons name="chevron-forward" size={24} color="black" />
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => navigation.navigate("SearchOrder")}
                                style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}
                            >
                                <View>
                                    <View style={{flexDirection: "row", gap: 12, alignItems: "center", justifyContent: "space-between"}}>
                                        <Text>Search Order</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center", gap: 2}}>
                                        <Text style={{fontSize: 11}}>Order Available:</Text>
                                        <Text style={{fontSize: 11, justifyContent: "center"}}>{availableOrders?.length}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Ionicons name="chevron-forward" size={24} color="black" />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <View style={{top: "200%", zIndex: 55, position: "absolute", width: "100%"}}>
                    <TouchableOpacity onPress={handleLogout}>
                        <Text>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
