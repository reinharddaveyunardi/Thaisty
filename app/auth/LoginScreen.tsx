import {router} from "expo-router";
import {Dimensions, KeyboardAvoidingView, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import AuthInput from "./components/AuthInput";
import {useEffect, useState} from "react";
import CustomButton from "../components/Button";
import {login} from "@/hook/useAuth";
import {Ionicons} from "@expo/vector-icons";
import BouncyCheckBox from "react-native-bouncy-checkbox";
import {Colors} from "@/constant/Colors";
import Loading from "../components/Loading";
import {checkTokenValidity} from "@/services/CheckValidityToken";
import {getUserId} from "@/services/SecureStore";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true);
    const [popup, setPopup] = useState(false);
    // const [isRemembered, setIsRemembered] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const checkAuth = async () => {
            const userId = await getUserId();
            if (!userId) {
                router.push("/auth/LoginScreen");
            } else {
                router.push("/dashboard/DashboardScreen");
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const handleLogin = async () => {
        router.push("/dashboard/DashboardScreen");
        if (!email.trim() || !password.trim()) {
            setPopup(true);
            return;
        }
        try {
            const res = await login({email, password});
            console.log("Login Success:", res);
        } catch (e) {
            console.log("Login Error:", e);
        }
    };
    return (
        <SafeAreaProvider style={{flex: 1, height: "100%", backgroundColor: "#fff", alignItems: "center"}}>
            <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
            {loading ? (
                <Loading />
            ) : (
                <>
                    <KeyboardAvoidingView style={{flex: 1, height: "100%", width: "100%", alignItems: "center"}}>
                        <View style={[Styles.body, {maxWidth: Dimensions.get("screen").width / 0.6, top: "5%"}]}>
                            <View style={{gap: 12}}>
                                <View>
                                    <View style={{gap: 0, justifyContent: "center"}}>
                                        <Text style={[{fontSize: 36, fontWeight: "bold", textAlignVertical: "center"}]}>Welcome</Text>
                                        <Text style={[Styles.textBig, {color: "#44649c"}]}>Back!</Text>
                                    </View>
                                    <View>
                                        <Text>Please fill out the form below</Text>
                                    </View>
                                </View>
                                <View style={{width: "100%", height: 0.5, backgroundColor: "gray"}} />
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    height: "100%",
                                    width: "100%",
                                    alignItems: "center",
                                }}
                            >
                                <View style={[Styles.formBox]}>
                                    <View style={{width: "100%"}}>
                                        <AuthInput
                                            label="Email"
                                            keyboardType="email-address"
                                            placeholder="Enter your email"
                                            textContentType="emailAddress"
                                            value={email}
                                            onChangeText={(text) => setEmail(text)}
                                        />
                                    </View>
                                    <View style={{width: "100%", gap: 6}}>
                                        <AuthInput
                                            label="Password"
                                            placeholder="Enter your password"
                                            value={password}
                                            forPassword
                                            textContentType="password"
                                            passwordStatus={hidePassword}
                                            onChangeText={(text) => setPassword(text)}
                                            secureTextEntry={hidePassword}
                                            triggerSecureTextEntry={() => setHidePassword((previous) => !previous)}
                                        />
                                        {/* <View style={{display: "flex", flexDirection: "row", alignItems: "center", width: "50%"}}>
                                            <BouncyCheckBox
                                                onPress={() => setIsRemembered((previous) => !previous)}
                                                isChecked={isRemembered}
                                                unFillColor="#fff"
                                                fillColor={Colors.primary}
                                                style={{width: "auto", marginRight: 8}}
                                                textComponent={<Text style={{color: Colors.text, paddingLeft: 4}}>Remember me</Text>}
                                            />
                                        </View> */}
                                        <CustomButton.Submit title="Login" onPress={handleLogin} disabled={false} loading={false} />
                                        <View style={{gap: 12}}>
                                            <View style={{display: "flex", alignItems: "center", flexDirection: "row"}}>
                                                <Text>Don't have an account? </Text>
                                                <TouchableOpacity onPress={() => router.push("/auth/register/RegisterScreen")}>
                                                    <Text style={{color: Colors.primary}}>Register</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{display: "flex", alignItems: "center", flexDirection: "row"}}>
                                                <Text>Forgot Password? </Text>
                                                <TouchableOpacity onPress={() => {}}>
                                                    <Text style={{color: Colors.primary}}>Reset</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                    <Modal visible={popup} animationType="fade" transparent={true}>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                            }}
                        >
                            <View
                                style={{
                                    width: "80%",
                                    height: "auto",
                                    backgroundColor: "white",
                                    borderRadius: 10,
                                    padding: 20,
                                    gap: 16,
                                }}
                            >
                                <View>
                                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                        <View>
                                            <Text style={{fontSize: 16, fontWeight: "bold"}}>Opss..</Text>
                                        </View>
                                    </View>
                                    <Text>Please fill out the form</Text>
                                </View>
                                <View>
                                    <TouchableOpacity
                                        style={{backgroundColor: Colors.primary, width: "auto", padding: 10, borderRadius: 5}}
                                        onPress={() => {
                                            setPopup(false);
                                        }}
                                    >
                                        <Text style={{color: "#fff"}}>Ok</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </>
            )}
        </SafeAreaProvider>
    );
}

const Styles = StyleSheet.create({
    body: {
        flex: 1,
        gap: 12,
        overflow: "hidden",
        width: "100%",
        height: "100%",
        paddingHorizontal: "5%",
        paddingVertical: "15%",
        backgroundColor: "#fff",
    },
    textBig: {
        fontSize: 64,
        fontWeight: "bold",
    },
    formBox: {
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
});
