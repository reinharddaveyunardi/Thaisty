import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Image,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
} from "react-native";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {useHeaderHeight} from "@react-navigation/elements";
import {Colors} from "@/constant/Colors";
import {doc, updateDoc} from "firebase/firestore";
import {firestore} from "@/config/firebase";
import {listenToMessages, sendMessage} from "@/services/api";
import {getUserId} from "@/services/SecureStore";
import {formatTime} from "@/utils/formatTime";

export default function ChatScreen({route, navigation}: any) {
    const {chatId, currentUserId} = route.params;
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [prompt, setPrompt] = useState("");
    const scrollRef = useRef<ScrollView>(null);
    const headerHeight = useHeaderHeight();
    const [inputWrapperHeight, setInputWrapperHeight] = useState(0);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: "none"}});

        return () => {
            navigation.getParent()?.setOptions({tabBarStyle: {backgroundColor: "#fff"}});
        };
    }, [navigation]);
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
        const messageListener = listenToMessages({chatId, callback: setMessages});
        return () => messageListener();
    }, [chatId]);

    const handleSendMessage = async () => {
        setMessages((prevMessages) => [...prevMessages, {text: prompt, senderId: currentUserId}]);
        const userId = await getUserId();
        console.log(userId);
        await sendMessage({chatId, senderId: userId, text: prompt, type: "driver"});
        await updateDoc(doc(firestore, "chats", chatId), {lastMessage: prompt});

        setPrompt("");
        scrollRef.current?.scrollToEnd({animated: true});
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: "#fff"}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={keyboardVisible ? headerHeight + inputWrapperHeight - 20 : 0}
        >
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                        <Text>Go Back</Text>
                    </TouchableOpacity>
                    <Image source={{uri: "https://via.placeholder.com/150"}} style={styles.avatar} />
                </View>

                <ScrollView ref={scrollRef} style={styles.chatContainer} onContentSizeChange={() => scrollRef.current?.scrollToEnd({animated: true})}>
                    {messages.map((msg, index) => (
                        <View key={msg.id || index} style={msg.type === "customer" ? styles.userBubble : styles.aiBubble}>
                            <Text>{msg.text}</Text>
                            <Text>{msg.sentAt ? formatTime(msg.sentAt) : ""}</Text>
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
                    <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                        <Text style={{color: "#fff"}}>Send</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
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
    header: {
        borderBottomWidth: 0.2,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    headerTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 28,
        justifyContent: "space-between",
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 50,
    },
    chatContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
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
