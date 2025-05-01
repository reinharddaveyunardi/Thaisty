import {firestore} from "@/config/firebase";
import {getUserId} from "@/services/SecureStore";
import {query, collection, where, onSnapshot} from "firebase/firestore";
import {useEffect, useState} from "react";
import {View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView} from "react-native";
export default function DashboardChatScreen({navigation}: any) {
    const [chats, setChats] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        let unsubscribe: () => void;

        const loadChat = async () => {
            const userId = await getUserId();

            if (!userId) return;

            const q = query(
                collection(firestore, "orders"),
                where("customerId", "==", userId),
                where("status", "in", ["ongoing_to_customer", "ongoing_to_merchant"])
            );

            unsubscribe = onSnapshot(q, (snapshot) => {
                const activeOrders = snapshot.docs.map((doc) => {
                    const data = doc.data();

                    return {
                        id: data.driverId,
                        chatId: data.chatId,
                        name: data.driverName || "Driver",
                        avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.driverName || "Driver"),
                        lastMessage: data.lastMessage || "",
                        time: "Aktif",
                        isAI: false,
                        orderId: data.orderId,
                    };
                });

                const withAI = [
                    {
                        id: "ai",
                        name: "AI",
                        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s",
                        lastMessage: '"A"',
                        time: "09:20 PM",
                        isAI: true,
                    },
                    ...activeOrders,
                ];

                setChats(withAI);
            });
        };

        loadChat();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return (
        <SafeAreaView style={{backgroundColor: "#fff", flex: 1}}>
            <ScrollView>
                <View>
                    {chats.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{flexDirection: "row", marginHorizontal: 16, paddingVertical: 12, alignItems: "center"}}
                            onPress={() =>
                                item.isAI
                                    ? navigation.navigate("ChatAiScreen")
                                    : navigation.navigate("ChatScreen", {
                                          chatId: item.chatId,
                                          orderId: item.orderId,
                                      })
                            }
                        >
                            <Image source={{uri: item.avatar}} style={{width: 50, height: 50, borderRadius: 25, marginRight: 12}} />
                            <View style={{flex: 1, borderBottomWidth: 0.5, borderBottomColor: "#ddd", paddingBottom: 8}}>
                                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                    <Text style={{fontSize: 16, fontWeight: "bold"}}>{item.name}</Text>
                                    <Text style={{fontSize: 12, color: "#888"}}>{item.time}</Text>
                                </View>
                                <Text style={{color: "#555"}} numberOfLines={1}>
                                    {item.lastMessage !== userId ? item.lastMessage : "You: " + item.lastMessage}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
