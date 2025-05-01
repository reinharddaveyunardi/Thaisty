import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    Image,
    Keyboard,
} from "react-native";
import {useState, useEffect} from "react";
import {GeminiAi} from "@/addon/geminiAi";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useHeaderHeight} from "@react-navigation/elements";
import {Colors} from "@/constant/Colors";

export default function ChatAiScreen({navigation}: any) {
    const [messages, setMessages] = useState<{sender: string; text: string}[]>([]);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const headerHeight = useHeaderHeight();
    const [inputWrapperHeight, setInputWrapperHeight] = useState(0);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);
    useEffect(() => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: "none"}});

        return () => {
            navigation.getParent()?.setOptions({tabBarStyle: {backgroundColor: "#fff"}});
        };
    }, [navigation]);
    const handleSend = async () => {
        if (prompt.trim() === "") return;
        const newMessages = [...messages, {sender: "", text: prompt}, {sender: "", text: ""}];
        setMessages(newMessages);
        setPrompt("");
        setLoading(true);
        try {
            const result = await GeminiAi({prompt});
            const numberedResult = result.replace(/(\*\s+)/g, (match, index) => {
                return `${index + 1}. `;
            });
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1].text = numberedResult;
                return updatedMessages;
            });
        } catch (error) {
            console.error("Error fetching AI response:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: "#fff"}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={keyboardVisible ? headerHeight + inputWrapperHeight - 20 : 0}
        >
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
                <ScrollView style={styles.chatContainer}>
                    {messages.map((msg, index) => (
                        <View key={index} style={msg.sender === "👤" ? styles.userBubble : styles.aiBubble}>
                            <Text>{msg.text || (msg.sender === "🤖" ? "..." : "")}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View
                    style={[styles.inputWrapper, {backgroundColor: "white", flex: 1}]}
                    onLayout={(event) => {
                        const {height} = event.nativeEvent.layout;
                        setInputWrapperHeight(height);
                    }}
                >
                    <TextInput style={styles.input} placeholder="Ketik sesuatu..." value={prompt} onChangeText={setPrompt} />
                    <TouchableOpacity
                        onPress={() => {
                            handleSend();
                        }}
                        style={styles.sendButton}
                    >
                        <Text style={{color: "#fff"}}>Send</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
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
        marginBottom: 60,
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
    inputWrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#fff",
        backgroundColor: "#fff",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: Colors.primary,
        width: 50,
        borderRadius: 5,
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
    },
});

//listkan makanan popoler dari thailand
