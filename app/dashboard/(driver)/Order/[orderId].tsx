import {View, Text, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, Image} from "react-native";
import React, {useEffect, useState} from "react";
import {Ionicons} from "@expo/vector-icons";
import {getMerchant, getOrders, getUserData} from "@/services/api";
import MapViewDirections from "react-native-maps-directions";
import MapView, {Marker} from "react-native-maps";
import {Colors} from "@/constant/Colors";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {doc, getDoc, onSnapshot, setDoc, updateDoc} from "firebase/firestore";
import {getUserId} from "@/services/SecureStore";
import {auth, firestore} from "@/config/firebase";
import {CalculateDeliveryPrice} from "@/utils/CalculateDeliveryPrice";
import {useDriverLocation} from "@/contexts/DriverLocationProvider";
import {calculateDelta} from "@/utils/CalculateDelta";

export default function OrderId({route, navigation}: any) {
    const {orderId} = route.params;
    const [orderData, setOrderData] = useState<any | null>(null);
    const {latDelta, longDelta} = calculateDelta(
        orderData?.merchantLocation.latitude,
        orderData?.merchantLocation.longitude,
        orderData?.customerLocation.latitude,
        orderData?.customerLocation.longitude
    );
    const [driverData, setDriverData] = useState<any | null>(null);
    const [destination, setDestination] = useState<"Restaurant" | "Customer">("Customer");
    const [merchantName, setMerchantName] = useState<any | null>(null);
    const [distance, setDistance] = useState(0);
    const {location} = useDriverLocation();

    const handleAccept = async (orderId: string) => {
        const driverId = await getUserId();
        await updateDoc(doc(firestore, "orders", orderId), {
            status: "driver_found",
            driverId: driverId,
            driverName: driverData.fullName,
        });
        if (!driverId) return;
        const driverRef = doc(firestore, "users", driverId);
        const driverSnap = await getDoc(driverRef);
        if (driverSnap.exists() && driverSnap.data().role === "driver") {
            const {currentOrderId} = driverSnap.data();
            if (!currentOrderId) {
                await updateDoc(driverRef, {
                    currentOrderId: orderId,
                });
                // await setDoc(doc(firestore, "orders", orderId), {
                //     driverId: driverId,
                //     status: "ongoing_to_restaurant",
                // });
            } else {
                console.log("Driver sedang dalam perjalanan, tolak order");
            }
        }
        navigation.navigate("OrderRoute", {orderId: orderId});
    };

    useEffect(() => {
        const loadOrderData = async () => {
            try {
                const orderData = await getOrders({orderId});
                setOrderData(orderData);
                if (orderData?.merchantId) {
                    const merchantDoc = await getMerchant({merchantId: orderData?.merchantId});
                    setMerchantName(merchantDoc?.name);
                }
            } catch (error) {
                console.error("Failed to fetch order data:", error);
            }
        };
        const loadDriverData = async () => {
            try {
                const userId = await getUserId();
                const driverData = await getUserData({userId});
                setDriverData(driverData);
            } catch (error) {
                console.error("Failed to fetch driver data:", error);
            }
        };
        loadDriverData();
        loadOrderData();
    }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            const getMerchantName = async () => {
                if (!orderData?.merchantId) return;
                try {
                    const merchantName = await getMerchant({merchantId: orderData?.merchantId});
                    setMerchantName(merchantName);
                } catch (error) {
                    console.error("Failed to fetch merchant name:", error);
                }
            };
            getMerchantName();
        });

        return () => unsubscribe();
    }, [orderData, navigation]);
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <View
                style={{
                    backgroundColor: "#fff",
                    padding: 16,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowOffset: {width: 0, height: 2},
                    shadowRadius: 4,
                    elevation: 3,
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <ScrollView style={{flex: 1}}>
                <View
                    style={{
                        position: "absolute",
                        top: 20,
                        zIndex: 10,
                        width: "90%",
                        flexDirection: "row",
                        alignSelf: "center",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <View style={{backgroundColor: "rgba(255,255,255,0.8)", padding: 8, borderRadius: 10, width: "90%", gap: 8}}>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                            <Text>Location: </Text>
                            <Text>
                                {orderData?.customerAddress
                                    ? orderData?.customerAddress.length > 20 || Dimensions.get("window").width < 400
                                        ? orderData?.customerAddress.slice(0, 20) + "..."
                                        : orderData?.customerAddress
                                    : "Unknown Location"}
                            </Text>
                        </View>
                        <View style={{width: "100%", height: 1, backgroundColor: "rgba(0,0,0,0.1)"}} />
                        <View>
                            <Text>Looking for {destination} location</Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => setDestination(destination === "Customer" ? "Restaurant" : "Customer")}>
                            <Ionicons name="swap-horizontal" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    {location && orderData?.customerLocation && orderData?.merchantLocation ? (
                        <MapView
                            style={{width: "100%", height: Dimensions.get("window").height}}
                            followsUserLocation={true}
                            region={{latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.002, longitudeDelta: 0.0009}}
                        >
                            <MapViewDirections
                                origin={{latitude: location.latitude, longitude: location.longitude}}
                                destination={
                                    destination === "Customer"
                                        ? {latitude: orderData?.customerLocation._lat, longitude: orderData?.customerLocation._long}
                                        : {latitude: orderData?.merchantLocation._lat, longitude: orderData?.merchantLocation._long}
                                }
                                apikey="AIzaSyBoHxlKMQIhIeWkUTz7VsqwPgrnBe-F9M0"
                                precision="high"
                                onReady={(res) => {
                                    setDistance(res.distance);
                                }}
                                strokeColor={Colors.primary}
                                strokeWidth={2}
                            />
                            <Marker coordinate={location} title="Driver">
                                <Image source={require("@/assets/images/motorbike.png")} style={{width: 40, height: 40}} />
                            </Marker>
                        </MapView>
                    ) : (
                        <View>
                            <Text>Loading Map...</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
            <BottomSheet snapPoints={[Dimensions.get("window").height - 500]} index={1} topInset={0} enablePanDownToClose={false} enableOverDrag={false}>
                <BottomSheetScrollView contentContainerStyle={{padding: 16, gap: 8, justifyContent: "space-between", height: "100%"}}>
                    <View>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                            <Text style={{fontSize: 16}}>Name:</Text>
                            <Text style={{fontSize: 16, fontWeight: "bold"}}>{orderData?.customerName}</Text>
                        </View>
                        <View style={{width: "100%", height: 1, backgroundColor: "rgba(0,0,0,0.1)"}} />
                        <View>
                            <Text style={{fontSize: 16, fontWeight: "bold"}}>{merchantName}</Text>
                            {orderData?.items.map((item: any, index: number) => (
                                <View key={index} style={{marginLeft: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                    <Text>{item.name}</Text>
                                    <Text>{item.quantity}x</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View>
                        <Text>Distance: {Math.round(distance)} km</Text>
                        <TouchableOpacity
                            disabled={orderData?.merchantLocation || orderData?.customerLocation ? false : true}
                            style={{
                                backgroundColor: orderData?.merchantLocation || orderData?.customerLocation ? Colors.primary : "lightgray",
                                padding: 10,
                                borderRadius: 10,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => handleAccept(orderId)}
                        >
                            <Text style={{color: "white", fontSize: 16, fontWeight: "bold"}}>Accept Order ฿{orderData?.fee}</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>
        </SafeAreaView>
    );
}
