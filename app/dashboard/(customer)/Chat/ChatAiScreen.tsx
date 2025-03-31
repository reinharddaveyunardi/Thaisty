import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    Image,
    Animated,
} from "react-native";
import React, {useState, useEffect, useRef} from "react";
import {GeminiAi} from "@/addon/geminiAi";
import Ionicons from "@expo/vector-icons/Ionicons";
import {foodData} from "@/data/FoodData";

export default function ChatAiScreen({navigation}: any) {
    const [messages, setMessages] = useState<{sender: string; text: string}[]>([]);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const dotAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: "none"}});

        return () => {
            navigation.getParent()?.setOptions({tabBarStyle: {backgroundColor: "#fff"}});
        };
    }, [navigation]);

    const handleSend = async () => {
        if (prompt.trim() === "") return;

        const newMessages = [...messages, {sender: "👤", text: prompt}, {sender: "🤖", text: ""}];
        setMessages(newMessages);
        setPrompt("");
        setLoading(true);

        try {
            const result = await GeminiAi({prompt});
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1].text = result;
                return updatedMessages;
            });
        } catch (error) {
            console.error("Error fetching AI response:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
            <View style={{borderBottomWidth: 0.2, padding: 16}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                        <Text>Go Back</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 28}}>
                    <Text>AI</Text>
                    <Text style={{fontWeight: "bold"}}>Powered by Gemini</Text>
                    <Image
                        source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s"}}
                        style={{width: 14, height: 14}}
                    />
                </View>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
                <ScrollView style={styles.chatContainer}>
                    {messages.map((msg, index) => (
                        <View key={index} style={msg.sender === "👤" ? styles.userBubble : styles.aiBubble}>
                            <Text>{msg.text || (msg.sender === "🤖" ? "..." : "")}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View style={[styles.inputContainer]}>
                    <TextInput style={styles.input} placeholder="Ketik sesuatu..." value={prompt} onChangeText={setPrompt} />
                    <Button title="Kirim" onPress={handleSend} disabled={loading} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: "#fff",
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

//listkan makanan popoler dari thailand
