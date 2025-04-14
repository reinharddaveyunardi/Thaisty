import {View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView} from "react-native";
import {useAuth} from "@/contexts/AuthProvider";
import {auth, firestore} from "@/config/firebase";
import {collection, addDoc, serverTimestamp, getDoc, doc} from "firebase/firestore";
import {GeoPoint} from "firebase/firestore";
import {useCart} from "@/contexts/CartProvider";
import {useNavigation, useRouter} from "expo-router";
import {useEffect, useState} from "react";
import {Colors} from "@/constant/Colors";
import {getUserId} from "@/services/SecureStore";
import {BahtFormat} from "@/utils/FormatCurrency";
import {CalculateDeliveryPrice} from "@/utils/CalculateDeliveryPrice";
import {getDistance} from "geolib";
import {Ionicons} from "@expo/vector-icons";

export default function CheckoutScreen({navigation}: any) {
    const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>({latitude: 0, longitude: 0});
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [merchantData, setMerchantData] = useState<any | null>(null);
    const [merchantAddress, setMerchantAddress] = useState<string | null>(null);
    const [merchantLocation, setMerchantLocation] = useState<{latitude: number; longitude: number} | null>({latitude: 0, longitude: 0});
    const [userData, setUserData] = useState<any | null>(null);
    const {cart, clearCart} = useCart();
    const [distance, setDistance] = useState(0);

    const getUserLocationAndAddress = async () => {
        try {
            const userId = await getUserId();
            setUserId(userId);

            const merchantId = cart[0]?.merchantId;
            if (!userId || !merchantId) {
                return null;
            }

            console.log("🆔 merchantId:", merchantId);

            const merchantDoc = await getDoc(doc(firestore, "merchant", merchantId));
            if (merchantDoc.exists()) {
                const merchantData = merchantDoc.data();

                setMerchantData(merchantData);

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

            const userDoc = await getDoc(doc(firestore, "users", userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log("User Data:", userData);
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
            console.log("📍 Distance from haversine:", res);
            setDistance(res || 0);
        }
    }, []);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    useEffect(() => {
        console.log("📍 Distance:", distance);
    }, [distance]);
    const handleCheckout = async () => {
        try {
            const merchantId = cart[0].merchantId;

            const orderRef = await addDoc(collection(firestore, "merchant", merchantId, "orders"), {
                userId,
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
                createdAt: serverTimestamp(),
            });
            const orderId = orderRef.id;
            const orderRefId = await addDoc(collection(firestore, `orders`), {
                orderId: orderId,
                userId,
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
                createdAt: serverTimestamp(),
            });
            clearCart();
            console.log("mengrim id:");
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
        <SafeAreaView style={{padding: 16, flex: 1}}>
            <View style={{paddingHorizontal: 16, marginBottom: 16}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <FlatList
                style={{flex: 1, paddingHorizontal: 16}}
                data={cart}
                keyExtractor={(item) => item.name}
                renderItem={({item}) => (
                    <View style={styles.item}>
                        <Text>
                            {item.name} x {item.quantity}
                        </Text>
                        <Text>
                            {BahtFormat(item.price)} x {item.quantity}
                        </Text>
                    </View>
                )}
            />

            <View style={[styles.summary, {paddingHorizontal: 16, paddingBottom: 16}]}>
                <Text>Total: {BahtFormat(totalPrice)}</Text>
                <Text>Fee: {BahtFormat((totalPrice * 17) / 100 + CalculateDeliveryPrice(distance))}</Text>
                <Text>Alamat: {userAddress}</Text>
                <TouchableOpacity style={styles.button} onPress={handleCheckout}>
                    <Text style={styles.buttonText}>Pesan Sekarang</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16},
    item: {flexDirection: "row", justifyContent: "space-between", marginBottom: 8},
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
