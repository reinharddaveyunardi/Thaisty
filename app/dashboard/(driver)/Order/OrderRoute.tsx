import {View, Text, ActivityIndicator, SafeAreaView, TouchableOpacity, BackHandler, Image} from "react-native";
import {useEffect, useState} from "react";
import MapView, {Marker} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import {Colors} from "@/constant/Colors";
import {getOrders, getUserData, updateDailyEarnings} from "@/services/api";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import {updateDoc, doc, increment, deleteDoc} from "firebase/firestore";
import {firestore} from "@/config/firebase";
import {Ionicons} from "@expo/vector-icons";
import {useDriverLocation} from "@/contexts/DriverLocationProvider";
import {useRouter} from "expo-router";
import {getUserId} from "@/services/SecureStore";
import {CalculateDeliveryPrice} from "@/utils/CalculateDeliveryPrice";
export default function OrderRoute({route, navigation}: any) {
    const router = useRouter();
    const {location} = useDriverLocation();
    const [orderData, setOrderData] = useState<any | null>(null);
    const [driverData, setDriverData] = useState<any | null>(null);
    const {orderId} = route.params;
    const paramsOrderId = orderId;
    const [status, setStatus] = useState<"ongoing_to_customer" | "ongoing_to_restaurant" | "driver_found">("driver_found");
    const [distance, setDistance] = useState(0);
    const [backPressed, setBackPressed] = useState(false);

    useEffect(() => {
        const backAction = () => {
            if (backPressed) {
                BackHandler.exitApp();
                return true;
            } else {
                setBackPressed(true);
                setTimeout(() => setBackPressed(false), 2000);
                return true;
            }
        };
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", backAction);
        };
    }, [backPressed]);

    useEffect(() => {
        if (!paramsOrderId) {
            const fetchUserData = async () => {
                try {
                    const userId = await getUserId();
                    const userData = await getUserData({userId: userId});
                    setDriverData(userData);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchUserData();
        }

        const loadOrderData = async () => {
            try {
                const orderData = await getOrders({orderId: paramsOrderId ? paramsOrderId : driverData?.currentOrderId});
                setOrderData({
                    ...orderData,
                    merchantLocation: {
                        latitude: orderData?.merchantLocation.latitude,
                        longitude: orderData?.merchantLocation.longitude,
                    },
                });
            } catch (error) {
                console.error("Failed to fetch order data:", error);
            }
        };
        loadOrderData();
    }, []);
    const updateOrderStatus = async (orderId: string, status: string, chatId?: string) => {
        try {
            const orderRef = doc(firestore, "orders", orderId);
            const userId = await getUserId();
            if (!userId) {
                console.error("User ID not found");
                return;
            }
            const driverRef = doc(firestore, "users", userId);
            await updateDoc(orderRef, {status});
            if (status === "finished") {
                await updateDoc(driverRef, {trips: increment(1)});
                await updateDoc(driverRef, {currentOrderId: ""});
                const dailyEarnings = orderData?.fee;
                if (isNaN(Number(dailyEarnings))) {
                    console.log("dailyEarnings bukan angka yang valid");
                } else {
                    console.log("dailyEarnings valid:", Number(dailyEarnings));
                }
                router.replace("/dashboard/DriverScreen");
                await updateDailyEarnings({userId, amount: orderData?.fee, orderId});
                if (!chatId) return;
                await deleteDoc(doc(firestore, "chats", chatId));
            } else if (status === "ongoing_to_customer") {
                await updateDoc(orderRef, {status: status});
                setStatus(status);
            } else {
                await updateDoc(driverRef, {trips: increment(0)});
                await updateDoc(driverRef, {currentOrderId: ""});
                await updateDoc(orderRef, {driverId: ""});
                await updateDoc(orderRef, {driverName: ""});
                router.replace("/dashboard/DriverScreen");
            }
        } catch (error) {
            console.error("❌ Failed to update order status:", error);
        }
    };
    if (!location || !location.latitude || !location.longitude || !orderData?.merchantLocation) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="large" />
                <Text>Loading Map...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <MapView
                mapType="standard"
                style={{flex: 1}}
                region={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0001,
                    longitudeDelta: 0.0009,
                }}
                followsUserLocation
                customMapStyle={[
                    {featureType: "transit", elementType: "labels", stylers: [{visibility: "off"}]},
                    {featureType: "road", elementType: "labels", stylers: [{visibility: "on"}]},
                ]}
                showsBuildings
                showsCompass={false}
                userLocationUpdateInterval={1000}
                legalLabelInsets={{bottom: 20, left: 20, right: 20, top: 20}}
            >
                <MapViewDirections
                    apikey="AIzaSyBoHxlKMQIhIeWkUTz7VsqwPgrnBe-F9M0"
                    strokeWidth={4}
                    onReady={(result) => setDistance(result.distance)}
                    precision="high"
                    strokeColor={Colors.primary}
                    destination={status === "driver_found" ? orderData?.merchantLocation : orderData?.customerLocation}
                    origin={location}
                    geodesic
                    mode="DRIVING"
                />
                <Marker coordinate={location} title="Driver">
                    <Image source={require("@/assets/images/motorbike.png")} style={{width: 40, height: 40}} />
                </Marker>
                {status === "driver_found" ? (
                    <Marker coordinate={orderData?.merchantLocation} title="Merchant" />
                ) : (
                    <Marker coordinate={{latitude: orderData?.customerLocation._lat, longitude: orderData?.customerLocation._long}} title="Customer">
                        <Image source={require("@/assets/images/me.png")} style={{width: 40, height: 40}} />
                    </Marker>
                )}
            </MapView>
            <BottomSheet snapPoints={[150, 300]} index={1}>
                <BottomSheetView style={{padding: 16, height: "100%"}}>
                    <View>
                        <View>
                            <Text>{distance > 1 ? `${distance.toFixed(2)} km` : `${(distance * 1000).toFixed(0)} m`}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("ChatScreen", {chatId: orderData?.chatId})}>
                                <Text>Start Chat</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", bottom: 0}}>
                        {status === "driver_found" ? (
                            <TouchableOpacity
                                onPress={async () => {
                                    await updateOrderStatus(orderId, "ongoing_to_customer");
                                }}
                                style={{backgroundColor: Colors.primary, padding: 12, borderRadius: 8, alignItems: "center", justifyContent: "center"}}
                            >
                                <Text style={{color: Colors.white, textAlign: "center"}}>Confirm Pickup</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={async () => {
                                    await updateOrderStatus(orderId, "finished", orderData?.chatId);
                                }}
                                style={{backgroundColor: Colors.primary, padding: 12, borderRadius: 8, alignItems: "center", justifyContent: "center"}}
                            >
                                <Text style={{color: Colors.white, textAlign: "center"}}>Finish Order</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={async () => {
                                await updateOrderStatus(orderId, "looking_for_driver");
                            }}
                            style={{backgroundColor: Colors.danger, padding: 12, borderRadius: 8}}
                        >
                            <Ionicons name="close" size={24} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </SafeAreaView>
    );
}
