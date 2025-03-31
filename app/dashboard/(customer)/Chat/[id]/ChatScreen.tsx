import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TextInput,
    Button,
    KeyboardAvoidingView,
    Platform,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import React, {useEffect, useState} from "react";
import {useLocalSearchParams, useRouter} from "expo-router";
import {ChatData} from "@/data/ChatData";
import {Ionicons} from "@expo/vector-icons";

export default function ChatScreen({route, navigation}: any) {
    const {chatId} = route.params;
    const router = useRouter();
    const chat = ChatData.find((item) => item.id === chatId);
    const [prompt, setPrompt] = useState("");
    useEffect(() => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: "none"}});

        return () => {
            navigation.getParent()?.setOptions({tabBarStyle: {backgroundColor: "#fff"}});
        };
    }, [navigation]);

    if (!chat) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Chat tidak ditemukan.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
            <View style={{borderBottomWidth: 0.2, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <View>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <TouchableOpacity onPress={() => router.back()} style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                            <Ionicons name="chevron-back" size={24} color="black" />
                            <Text>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: "row", width: "100%", alignItems: "center", gap: 4, paddingHorizontal: 28, justifyContent: "space-between"}}>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                            <Text>{chat.name}</Text>
                            <Text style={{fontWeight: "bold"}}>Chat</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <Image source={{uri: chat.avatar}} style={{width: 38, height: 38, borderRadius: 50}} />
                </View>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
                <ScrollView style={styles.chatContainer}>
                    {chat.chats.map((msg, index) => (
                        <View key={index} style={msg.sender === "customer" ? styles.userBubble : styles.aiBubble}>
                            <Text>{msg.message}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Ketik sesuatu..." value={prompt} onChangeText={setPrompt} />
                    <Button title="Kirim" onPress={() => {}} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    errorText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "red",
    },
    chatContainer: {
        flex: 1,
        padding: 20,
    },
    userBubble: {
        alignSelf: "flex-end",
        backgroundColor: "#DCF8C6",
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: "80%",
    },
    aiBubble: {
        alignSelf: "flex-start",
        backgroundColor: "#E0E0E0",
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: "80%",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        width: "100%",
        padding: 10,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        height: 40,
        width: "80%",
        borderRadius: 5,
        marginRight: 10,
    },
});
