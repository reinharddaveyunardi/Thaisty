import {View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar} from "react-native";
import {firestore} from "@/config/firebase";
import {collection, addDoc, serverTimestamp, getDoc, doc, updateDoc} from "firebase/firestore";
import {GeoPoint} from "firebase/firestore";
import {useCart} from "@/contexts/CartProvider";
import {useEffect, useState} from "react";
import {Colors} from "@/constant/Colors";
import {BahtFormat} from "@/utils/FormatCurrency";
import {CalculateDeliveryPrice} from "@/utils/CalculateDeliveryPrice";
import {getDistance} from "geolib";
import {Ionicons} from "@expo/vector-icons";
import DashedLine from "@/components/ui/Dashline";
import Skeleton from "@/components/ui/SkeletonLoading";

export default function CheckoutScreen({navigation, route}: any) {
    const {customerId} = route.params;
    const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>({latitude: 0, longitude: 0});
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [merchantAddress, setMerchantAddress] = useState<string | null>(null);
    const [merchantLocation, setMerchantLocation] = useState<{latitude: number; longitude: number} | null>({latitude: 0, longitude: 0});
    const [userData, setUserData] = useState<any | null>(null);
    const {cart, clearCart} = useCart();
    const [distance, setDistance] = useState(0);

    const getUserLocationAndAddress = async () => {
        try {
            const merchantId = cart[0]?.merchantId;
            if (!customerId || !merchantId) {
                return null;
            }
            const merchantDoc = await getDoc(doc(firestore, "merchant", merchantId));
            if (merchantDoc.exists()) {
                const merchantData = merchantDoc.data();
                const loc = merchantData.location;
                if (loc instanceof GeoPoint) {
                    setMerchantLocation({latitude: loc.latitude, longitude: loc.longitude});
                } else {
                    console.warn("🚨 Merchant location is not a GeoPoint:", loc);
                }
                setMerchantAddress(merchantData.address);
            } else {
                console.log("❌ Merchant document not found");
            }

            const userDoc = await getDoc(doc(firestore, "users", customerId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserData(userData);
                setUserLocation(userData.location);
                setUserAddress(userData.address);
            } else {
                console.log("❌ User document not found");
            }
        } catch (error) {
            console.log("💥 Error fetching user location and address:", error);
        }
    };

    useEffect(() => {
        if (cart.length > 0) {
            getUserLocationAndAddress();
        }
    }, [cart]);
    useEffect(() => {
        if (userLocation && merchantLocation) {
            const res = getDistance(userLocation, merchantLocation);
            setDistance(res || 0);
        }
    }, []);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const handleCheckout = async () => {
        try {
            let balance = userData?.balance;
            let totalAll = totalPrice + (totalPrice * 17) / 100 + CalculateDeliveryPrice(distance);
            await updateDoc(doc(firestore, "users", customerId), {
                balance: balance - totalAll,
            });
            const merchantId = cart[0].merchantId;
            const orderRef = await addDoc(collection(firestore, "merchant", merchantId, "orders"), {
                customerId,
                items: [
                    {
                        name: cart[0].name,
                        quantity: cart[0].quantity,
                        price: cart[0].price,
                    },
                ],
                total: totalPrice,
                location: userLocation && userLocation.longitude !== undefined ? new GeoPoint(userLocation.latitude, userLocation.longitude) : null,
                address: userAddress,
                customerName: userData.fullName,
                status: "pending",
                driverId: "",
                createdAt: serverTimestamp(),
            });
            const chatRef = await addDoc(collection(firestore, "chats"), {
                orderId: orderRef.id,
                participants: [customerId],
                createdAt: serverTimestamp(),
                lastMessage: "",
            });
            const orderRefId = await addDoc(collection(firestore, `orders`), {
                orderId: orderRef.id,
                chatId: chatRef.id,
                customerId: customerId,
                customerName: userData.fullName,
                items: cart.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                fee: (totalPrice * 17) / 100 + CalculateDeliveryPrice(distance),
                total: totalPrice,
                merchantId,
                merchantLocation:
                    merchantLocation?.latitude !== undefined && merchantLocation?.longitude !== undefined
                        ? new GeoPoint(merchantLocation.latitude, merchantLocation.longitude)
                        : null,
                merchantAddress: merchantAddress,
                customerLocation: userLocation && userLocation.longitude !== undefined ? new GeoPoint(userLocation.latitude, userLocation.longitude) : null,
                customerAddress: userAddress,
                status: "looking_for_driver",
                driverId: "",
                createdAt: serverTimestamp(),
            });

            clearCart();
            navigation.navigate("OngoingOrder", {orderId: orderRefId.id});
        } catch (err) {
            console.log("Checkout failed:", err);
        }
    };
    useEffect(() => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: "none"}});

        return () => {
            navigation.getParent()?.setOptions({tabBarStyle: {backgroundColor: "#fff"}});
        };
    }, [navigation]);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View
                style={{
                    paddingHorizontal: 16,
                    marginBottom: 16,
                    height: 50,
                    width: "100%",
                    borderBottomRightRadius: 16,
                    borderBottomLeftRadius: 16,
                    backgroundColor: "#fff",
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    justifyContent: "center",
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <FlatList
                style={{flex: 1, paddingHorizontal: 16}}
                data={cart}
                scrollEnabled={cart.length > 1}
                keyExtractor={(item) => item.name}
                renderItem={({item, index}) => (
                    <View style={{gap: 8}}>
                        <View style={styles.item}>
                            <Text>
                                {index + 1}. {item.name} x {item.quantity}
                            </Text>
                            <Text>
                                {BahtFormat(item.price)} x {item.quantity}
                            </Text>
                        </View>
                        <DashedLine />
                    </View>
                )}
            />

            <View
                style={[
                    styles.summary,
                    {
                        paddingHorizontal: 16,
                        paddingBottom: 16,
                        maxWidth: "100%",
                        backgroundColor: "#fff",
                        borderTopRightRadius: 16,
                        borderTopLeftRadius: 16,
                        elevation: 5,
                        shadowColor: "#000",
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.25,
                        shadowRadius: 3,
                        paddingVertical: 16,
                    },
                ]}
            >
                <View style={{width: "auto", padding: 8}}>
                    <Text>Total Item: {BahtFormat(totalPrice)}</Text>
                </View>
                <View style={{width: "auto", padding: 8}}>
                    <Text>Fee: {BahtFormat((totalPrice * 17) / 100 + CalculateDeliveryPrice(distance))}</Text>
                </View>
                <View style={{width: "auto", padding: 8}}>{!userLocation ? <Skeleton width={100} height={20} /> : <Text>Address: {userAddress}</Text>}</View>
                <View style={{width: "auto", paddingHorizontal: 8}}>
                    <DashedLine />
                </View>
                <View style={{width: "auto", padding: 8}}>
                    <Text>Total: {BahtFormat(totalPrice + (totalPrice * 17) / 100 + CalculateDeliveryPrice(distance))}</Text>
                </View>
                <View
                    style={{
                        backgroundColor: userData?.balance < totalPrice + (totalPrice * 17) / 100 + CalculateDeliveryPrice(distance) ? Colors.danger : "white",
                        width: "auto",
                        padding: 8,
                        borderRadius: 8,
                    }}
                >
                    {!userData ? <Skeleton width={100} height={20} /> : <Text>Balance: {BahtFormat(userData.balance)}</Text>}
                </View>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor:
                                cart.length === 0 || !userData || userData?.balance < totalPrice + (totalPrice * 17) / 100 + CalculateDeliveryPrice(distance)
                                    ? "#ccc"
                                    : Colors.primary,
                        },
                    ]}
                    onPress={handleCheckout}
                    disabled={cart.length === 0 || !userData || userData?.balance < totalPrice}
                >
                    <Text style={styles.buttonText}>
                        {userData?.balance < totalPrice + (totalPrice * 17) / 100 + CalculateDeliveryPrice(distance)
                            ? `Need ${BahtFormat(totalPrice + (totalPrice * 17) / 100 + CalculateDeliveryPrice(distance) - userData.balance)} to `
                            : ""}
                        Checkout{" "}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16},
    item: {flexDirection: "row", justifyContent: "space-between"},
    summary: {marginTop: 16},
    button: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        alignItems: "center",
    },
    buttonText: {color: "white", fontSize: 16},
});
