import React, {useEffect, useState} from "react";
import {View, Text, FlatList, StyleSheet, RefreshControl, SafeAreaView, TouchableOpacity, StatusBar} from "react-native";
import {collection, getDocs, query, where} from "firebase/firestore";
import {firestore} from "@/config/firebase";
import {getUserId} from "@/services/SecureStore";
import {BahtFormat} from "@/utils/FormatCurrency";
import {Colors} from "@/constant/Colors";
import Skeleton from "@/components/ui/SkeletonLoading";

export default function OrderScreen({navigation}: any) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const onRefresh = React.useCallback(async () => {
        setLoading(true);
        const fetchOrders = async () => {
            setLoading(true);
            const userId = await getUserId();
            if (!userId) {
                console.log("User ID is not available");
                return;
            }
            try {
                const q = query(
                    collection(firestore, "orders"),
                    where("customerId", "==", userId),
                    where("status", "in", ["looking_for_driver", "pending", "accepted", "ongoing_to_customer", "driver_found"])
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setOrders(data);
                setLoading(false);
            } catch (e) {
                console.log("Error fetching orders:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
        setLoading(false);
    }, []);
    function taskStatus(status: string) {
        switch (status) {
            case "looking_for_driver":
                return "Mencari Driver";
            case "pending":
                return "Menunggu Konfirmasi";
            case "accepted":
                return "Diterima";
            case "rejected":
                return "Ditolak";
            case "ongoing_to_customer":
                return "Dalam Perjalanan";
            case "finished":
                return "Selesai";
            default:
                return status;
        }
    }
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const userId = await getUserId();
            if (!userId) {
                console.log("User ID is not available");
                return;
            }
            try {
                const q = query(
                    collection(firestore, "orders"),
                    where("customerId", "==", userId),
                    where("status", "in", ["looking_for_driver", "pending", "accepted", "ongoing_to_customer", "driver_found"])
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setOrders(data);
                setLoading(false);
            } catch (e) {
                console.log("Error fetching orders:", e);
            } finally {
                setLoading(false);
            }
        };
        const unsubscribe = navigation.addListener("focus", () => fetchOrders());
        return () => unsubscribe();
    }, []);

    // if (orders.length === 0 && !loading) {
    //     return (
    //         <View style={styles.center}>
    //             <Text>Belum ada pesanan</Text>
    //         </View>
    //     );
    // }
    const buttonHandler = (id: string) => {
        navigation.navigate(`OngoingOrder`, {orderId: id});
        console.log(orders[0].id);
    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={"dark-content"} />
            {loading ? (
                <View>
                    <Skeleton width={"100%"} height={100} speed="slow" borderRadius={8} />
                </View>
            ) : (
                <FlatList
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={() => onRefresh()} />}
                    data={orders}
                    style={{padding: 16}}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <View style={styles.card}>
                            <Text style={styles.title}>Status: {taskStatus(item.status)}</Text>
                            <Text>{item.id}</Text>
                            <Text>Alamat: {item.address}</Text>
                            <Text>Total: {BahtFormat(item.total)}</Text>
                            <Text>Driver: {item.driverName || "Driver not assigned"}</Text>
                            {item.status === "looking_for_driver" || item.status === "ongoing_to_customer" || item.status === "driver_found" ? (
                                <View>
                                    <TouchableOpacity
                                        onPress={() => buttonHandler(item.id)}
                                        style={{backgroundColor: Colors.primary, padding: 8, borderRadius: 4, marginTop: 8}}
                                    >
                                        <Text style={{color: "#fff"}}>Track</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: "#fff"},
    center: {flex: 1, justifyContent: "center", alignItems: "center"},
    card: {
        backgroundColor: "#f0f0f0",
        padding: 16,
        width: "100%",
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    title: {fontWeight: "bold", marginBottom: 4, fontSize: 16},
});
