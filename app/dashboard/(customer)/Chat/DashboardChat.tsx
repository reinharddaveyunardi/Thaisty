import {ChatData} from "@/data/ChatData";
import {useRouter} from "expo-router";
import React, {useState} from "react";
import {View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView} from "react-native";
const chatData = ChatData;

export default function DashboardChatScreen({navigation}: any) {
    const [chats, setChats] = useState(chatData);

    return (
        <SafeAreaView style={{backgroundColor: "#fff", flex: 1}}>
            <ScrollView>
                <View>
                    <TouchableOpacity
                        style={{flexDirection: "row", marginHorizontal: 16, paddingVertical: 12, alignItems: "center"}}
                        onPress={() => navigation.navigate(`ChatAiScreen`)}
                    >
                        <Image
                            source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s"}}
                            style={{width: 50, height: 50, borderRadius: 25, marginRight: 12}}
                        />
                        <View style={{flex: 1, borderBottomWidth: 0.5, borderBottomColor: "#ddd", paddingBottom: 8}}>
                            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                <Text style={{fontSize: 16, fontWeight: "bold"}}>AI</Text>
                                <Text style={{fontSize: 12, color: "#888"}}>09:20 PM</Text>
                            </View>
                            <Text style={{color: "#555"}} numberOfLines={1}>
                                "A"
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {chats.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{flexDirection: "row", marginHorizontal: 16, paddingVertical: 12, alignItems: "center"}}
                            onPress={() => navigation.navigate(`ChatScreen`, {chatId: item.id})}
                        >
                            <Image source={{uri: item.avatar}} style={{width: 50, height: 50, borderRadius: 25, marginRight: 12}} />
                            <View style={{flex: 1, borderBottomWidth: 0.5, borderBottomColor: "#ddd", paddingBottom: 8}}>
                                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                    <Text style={{fontSize: 16, fontWeight: "bold"}}>{item.name}</Text>
                                    <Text style={{fontSize: 12, color: "#888"}}>{item.time}</Text>
                                </View>
                                <Text style={{color: "#555"}} numberOfLines={1}>
                                    {item.lastMessage}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
