import {View, Text, FlatList, TouchableOpacity, Button, SafeAreaView, ScrollView} from "react-native";
import QRCode from "react-native-qrcode-svg";
import {useEffect, useState} from "react";
import {firestore} from "@/config/firebase";
import {getUserId} from "@/services/SecureStore";
import {useRouter} from "expo-router";
import {doc, setDoc, GeoPoint, getDoc} from "firebase/firestore";
import {getUserData} from "@/services/api";
import Skeleton from "@/components/ui/SkeletonLoading";
import {Ionicons} from "@expo/vector-icons";

export default function MerchantScreen({navigation}: any) {
    const [orders, setOrders] = useState<any[]>([]);
    const [userData, setUserData] = useState<any | null>(null);
    const [merchantId, setMerchantId] = useState<any | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchMerchantData = async () => {
            const id = await getUserId();
            setMerchantId(id);
            if (!id) return;
            const q = doc(firestore, "merchant", id);
            const snapshot = await getDoc(q);
            if (!snapshot.exists()) {
                const userData = await getUserData({userId: id});
                setUserData(userData);
                await setDoc(
                    q,
                    {
                        name: userData?.fullName,
                        location: GeoPoint,
                    },
                    {merge: true}
                );
            }
        };

        fetchMerchantData();
    }, []);

    const renderItem = ({item}: {item: any}) => (
        <View>
            <Text>{item.customerName}</Text>
            <Text>Total: Rp {item.total?.toLocaleString()}</Text>
            <Text>Status: {item.status}</Text>

            <View>
                <TouchableOpacity>
                    <Text>Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text>Detail</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={{}}>
            <View
                style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "white",
                    paddingHorizontal: 10,
                    elevation: 5,
                    shadowColor: "#000",
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                }}
            >
                <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <ScrollView style={{padding: 16}}>
                <Text>📦 Order Masuk</Text>
                <Text>Generate QR Code</Text>
                {merchantId ? <QRCode value={merchantId} /> : <Skeleton width={200} height={200} />}
            </ScrollView>
        </SafeAreaView>
    );
}
