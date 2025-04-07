import {View, Text, FlatList, TouchableOpacity, StyleSheet} from "react-native";
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

export default function CheckoutScreen({navigation}: any) {
    const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>({latitude: 0, longitude: 0});
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const router = useRouter();
    const getUserLocationAndAddress = async () => {
        try {
            const userId = await getUserId();
            setUserId(userId);
            if (!userId) {
                console.log("User ID is not available");
                return null;
            }
            const userDoc = await getDoc(doc(firestore, "users", userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserData(userData);
                setUserLocation(userData.location);
                setUserAddress(userData.address);
            } else {
                console.log("User document not found");
                return null;
            }
        } catch (error) {
            console.log("Error fetching user location and address:", error);
            return null;
        }
    };
    useEffect(() => {
        getUserLocationAndAddress();
    }, []);
    const {cart, clearCart} = useCart();

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
            await addDoc(collection(firestore, "orders"), {
                orderId: orderRef.id,
                userId,
                customerName: userData.fullName,
                items: cart.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total: totalPrice,
                merchantId,
                location: userLocation && userLocation.longitude !== undefined ? new GeoPoint(userLocation.latitude, userLocation.longitude) : null,
                address: userAddress,
                status: "looking_for_driver",
                createdAt: serverTimestamp(),
            });

            clearCart();
            navigation.goBack();
        } catch (err) {
            console.log("Checkout failed:", err);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={cart}
                keyExtractor={(item) => item.name}
                renderItem={({item}) => (
                    <View style={styles.item}>
                        <Text>
                            {item.name} x {item.quantity}
                        </Text>
                        <Text>Rp{item.price * item.quantity}</Text>
                    </View>
                )}
            />
            <View style={styles.summary}>
                <Text>Total: {BahtFormat(totalPrice)}</Text>
                <Text>Alamat: {userAddress}</Text>
                <TouchableOpacity style={styles.button} onPress={handleCheckout}>
                    <Text style={styles.buttonText}>Pesan Sekarang</Text>
                </TouchableOpacity>
            </View>
        </View>
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
