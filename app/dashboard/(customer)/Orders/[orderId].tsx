import {View, Text, SafeAreaView, ActivityIndicator, Image, TouchableOpacity, Dimensions} from "react-native";
import {useEffect, useState} from "react";
import MapView, {Marker} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import {getNearbyDrivers, getOrders, getUserData} from "@/services/api";
import {Colors} from "@/constant/Colors";
import {Ionicons} from "@expo/vector-icons";
import {Stack, useRouter} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {doc, updateDoc} from "firebase/firestore";
import {firestore} from "@/config/firebase";
import {EstimatedTimeArrival} from "@/utils/EstimatedTimeArrival";

export default function OrderId({route, navigation}: any) {
    const {orderId} = route.params;
    const [order, setOrder] = useState<any>(null);
    const [driverData, setDriverData] = useState<any>(null);
    const [distance, setDistance] = useState(0);
    const [driversNearby, setDriversNearby] = useState<any[]>([]);
    const [status, setStatus] = useState<"ongoing_to_customer" | "ongoing_to_restaurant" | "driver_found" | "looking_for_driver" | "finished">(
        "looking_for_driver"
    );
    const insets = useSafeAreaInsets();
    const router = useRouter();

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const order = await getOrders({orderId});
                setOrder(order);
                if (order?.driverId === "") {
                    setStatus("looking_for_driver");
                } else {
                    const driverData = await getUserData({userId: order?.driverId});
                    setDriverData(driverData);
                }
                if (order?.status === "looking_for_driver") {
                    const drivers = await getNearbyDrivers();
                    setDriversNearby(drivers);
                }
            } catch (err) {
                console.error("Error fetching order data:", err);
            }
        };

        fetchOrderData();
        const intervalId = setInterval(fetchOrderData, 5000);

        return () => clearInterval(intervalId);
    }, [orderId]);

    useEffect(() => {
        if (order?.status === "ongoing_to_customer") {
            setStatus("ongoing_to_customer");
        } else if (order?.status === "driver_found") {
            setStatus("driver_found");
            const update = async () => {
                if (!order?.customerId || !order?.driverId) {
                    console.warn("Customer ID atau Driver ID masih kosong. Gagal update participants.");
                    return;
                }

                await updateDoc(doc(firestore, "chats", order?.chatId), {
                    participants: [order.customerId, order.driverId],
                });
            };
            update();
        } else if (order?.status === "looking_for_driver") {
            setStatus("looking_for_driver");
        } else if (order?.status == "finished") {
            router.replace("/dashboard/DashboardScreen");
        }
    }, [order?.status]);
    useEffect(() => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: "none"}});

        return () => {
            navigation.getParent()?.setOptions({tabBarStyle: {backgroundColor: "#fff"}});
        };
    }, [navigation]);
    if (!order || !orderId) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="large" color={"#000000"} />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (status === "looking_for_driver") {
        return (
            <View style={{flex: 1}}>
                <View style={{position: "absolute", top: insets.top, left: 16, zIndex: 1}}>
                    <TouchableOpacity
                        style={{backgroundColor: "white", borderRadius: 50, padding: 8}}
                        onPress={() => {
                            router.replace("/dashboard/DashboardScreen");
                        }}
                    >
                        <Ionicons name="chevron-back" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <MapView
                    style={{flex: 1}}
                    showsUserLocation={true}
                    onMapReady={() => console.log("Map is ready")}
                    region={{
                        latitude: order?.customerLocation?._lat,
                        longitude: order?.customerLocation?._long,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    {driversNearby.map((driver, index) => {
                        const lat = driver?.location?._lat;
                        const lng = driver?.location?._long;
                        if (lat == null || lng == null) return null;

                        return (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: lat,
                                    longitude: lng,
                                }}
                                anchor={{x: 0, y: 0}}
                                flat={true}
                            >
                                <Image source={require("@/assets/images/motorbike.png")} style={{width: 40, height: 40}} />
                            </Marker>
                        );
                    })}
                </MapView>
            </View>
        );
    }
    if (status === "driver_found") {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Text>🍜 Makanan sedang disiapkan oleh merchant...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (status === "ongoing_to_customer") {
        return (
            <GestureHandlerRootView>
                <View style={{flex: 1}}>
                    <View style={{position: "absolute", top: insets.top, left: 16, zIndex: 1}}>
                        <TouchableOpacity
                            style={{backgroundColor: "white", borderRadius: 50, padding: 8}}
                            onPress={() => {
                                navigation.goBack();
                            }}
                        >
                            <Ionicons name="chevron-back" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <MapView
                        style={{flex: 1}}
                        initialRegion={{
                            latitude: driverData?.location?._lat || 0,
                            longitude: driverData?.location?._long || 0,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker coordinate={{latitude: driverData?.location?._lat || 0, longitude: driverData?.location?._long || 0}}>
                            <Image source={require("@/assets/images/motorbike.png")} style={{width: 40, height: 40}} />
                        </Marker>
                        <Marker coordinate={{latitude: order?.customerLocation?._lat || 0, longitude: order?.customerLocation?._long || 0}}>
                            <Image source={require("@/assets/images/me.png")} style={{width: 40, height: 40}} />
                        </Marker>
                        {(order?.customerLocation?._lat && order?.customerLocation?._long && driverData?.location?._lat && driverData?.location?._long && (
                            <MapViewDirections
                                mode="DRIVING"
                                onReady={(e) => setDistance(e.distance)}
                                origin={{latitude: driverData?.location?._lat || 0, longitude: driverData?.location?._long || 0}}
                                destination={{latitude: order?.customerLocation?._lat || 0, longitude: order?.customerLocation?._long || 0}}
                                apikey="AIzaSyBoHxlKMQIhIeWkUTz7VsqwPgrnBe-F9M0"
                                strokeWidth={4}
                                strokeColor={Colors.primary}
                            />
                        )) || <ActivityIndicator size="large" color={"#000000"} />}
                    </MapView>
                    <BottomSheet
                        snapPoints={[Dimensions.get("window").height - 500]}
                        index={1}
                        topInset={0}
                        enablePanDownToClose={false}
                        enableOverDrag={false}
                    >
                        <BottomSheetScrollView contentContainerStyle={{padding: 16, gap: 8, justifyContent: "space-between", height: "100%"}}>
                            <View>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                                    <Text style={{fontSize: 16}}>Name:</Text>
                                    <Text style={{fontSize: 16, fontWeight: "bold"}}>{driverData?.fullName}</Text>
                                </View>
                                <View>
                                    <Text>{EstimatedTimeArrival(distance, driverData?.averageSpeed)}</Text>
                                </View>
                                <View style={{width: "100%", height: 1, backgroundColor: "rgba(0,0,0,0.1)"}} />
                            </View>
                        </BottomSheetScrollView>
                    </BottomSheet>
                </View>
            </GestureHandlerRootView>
        );
    }
    return <Stack />;
}
