import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
    StatusBar,
    Platform,
    Keyboard,
    Animated,
    Easing,
    ScrollView,
    Dimensions,
    Modal,
} from "react-native";
import {useEffect, useRef, useState} from "react";
import {Colors} from "@/constant/Colors";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import StepOneCustomer from "./customer/StepOne";
import StepOneDriver from "./driver/StepOne";
import StepOneMerchant from "./merchant/StepOne";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useHeaderHeight} from "@react-navigation/elements";
import {RegisterCustomers, RegisterDriver, RegisterMerchant} from "@/services/api";
import StepTwoCustomer from "./customer/StepTwo";
import StepTwoDriver from "./driver/StepTwo";
import StepTwoMerchant from "./merchant/StepTwo";
import {ValidatePassword} from "@/utils/ValidatePassword";

export default function RegisterScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const yAnim = useRef(new Animated.Value(100)).current;
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<"Customer" | "Driver" | "Merchant">("Customer");
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
    const [step, setStep] = useState(0);
    const inset = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();
    const [inputWrapperHeight, setInputWrapperHeight] = useState(0);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [fullName, setFullName] = useState("");
    const [fullNameNotFilled, setFullNameNotFilled] = useState(false);
    const [email, setEmail] = useState("");
    const [emailNotFilled, setEmailNotFilled] = useState(false);
    const [hasAllergies, setHasAllergies] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordNotFilled, setPasswordNotFilled] = useState(false);
    const [passwordRules, setPasswordRules] = useState(ValidatePassword(password));
    const [popup, setPopup] = useState(false);

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
        setPasswordRules(ValidatePassword(password));
    }, [password]);
    const nextStep = () => {
        if (step < 1) setStep(step + 1);
        if (
            password.trim() === "" ||
            !passwordRules ||
            !passwordRules.length ||
            !passwordRules.uppercase ||
            !passwordRules.lowercase ||
            !passwordRules.number ||
            !passwordRules.specialChar
        ) {
            setPasswordNotFilled(true);
            return;
        } else {
            if (step < 3) setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };
    useEffect(() => {
        if ((selectedAllergies.length > 0 && !hasAllergies) || step === 1) {
            fadeAnim.setValue(0);
            yAnim.setValue(100);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(yAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start(() => setHasAllergies(true));
        }
    }, [selectedAllergies, step]);

    const handleRegister = async () => {
        if (selectedType === "Customer") {
            try {
                await RegisterCustomers({email, password, fullName, allergies: selectedAllergies});
                router.push("/auth/LoginScreen");
                return;
            } catch (e) {
                console.error("Registration Error:", e);
            }
        } else if (selectedType === "Driver") {
            try {
                await RegisterDriver({email, password, driverName: fullName});
                router.push("/auth/LoginScreen");
                return;
            } catch (e) {
                console.error("Registration Error:", e);
            }
        } else if (selectedType === "Merchant") {
            try {
                await RegisterMerchant({email, password, merchantName: fullName});
                router.push("/auth/LoginScreen");
                return;
            } catch (e) {
                console.error("Registration Error:", e);
            }
        }
    };
    const typeData: ("Customer" | "Driver" | "Merchant")[] = ["Customer", "Driver", "Merchant"];
    const disabledType = ["Driver", "Merchant"];
    return (
        <View style={{flex: 1}}>
            <SafeAreaView style={{flex: 0, backgroundColor: Colors.primary}} />
            <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
                <StatusBar backgroundColor={Colors.primary} barStyle={"light-content"} />
                <View style={{flex: 1, backgroundColor: Colors.primary}}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16}}>
                        <Text style={{fontSize: 42, fontWeight: "bold", color: "#fff"}}>SIGN UP</Text>
                        <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}} onPress={() => router.back()}>
                            <Ionicons name="close" size={42} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        <View style={{width: "90%", height: 1, backgroundColor: "#fff"}} />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            paddingHorizontal: 16,
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            top: "2%",
                        }}
                    >
                        <Text style={{fontSize: 42, fontWeight: "bold", color: "#fff"}}>Hello, </Text>
                        {fullName === "" && <Text style={{fontSize: 42, fontWeight: "bold", color: "#fff"}}>new {selectedType}!</Text>}
                        {fullName !== "" && <Text style={{fontSize: 42, fontWeight: "bold", color: "#fff"}}>{fullName}!</Text>}
                    </View>
                </View>
                {selectedAllergies.length > 0 && (
                    <Animated.View
                        style={{
                            alignSelf: "center",
                            position: "absolute",
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 10,
                            top: "30%",
                            width: "95%",
                            height: "auto",
                            backgroundColor: Colors.white,
                            opacity: fadeAnim,
                            transform: [{translateY: yAnim}],
                        }}
                    >
                        <Text style={{paddingVertical: 8}}>Selected Allergies</Text>
                        {selectedAllergies.length <= 5 ? (
                            selectedAllergies.map((allergy, index) => (
                                <Text key={index}>
                                    {index + 1} - {allergy}
                                </Text>
                            ))
                        ) : (
                            <ScrollView style={{height: 80}}>
                                {selectedAllergies.map((allergy, index) => (
                                    <Text key={index}>
                                        {index + 1} - {allergy}
                                    </Text>
                                ))}
                            </ScrollView>
                        )}
                    </Animated.View>
                )}
                {step === 1 && (
                    <Animated.View
                        style={{
                            alignSelf: "center",
                            position: "absolute",
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 10,
                            top: keyboardVisible ? Dimensions.get("window").height / 8 : "30%",
                            width: "95%",
                            height: "auto",
                            backgroundColor: Colors.white,
                            opacity: fadeAnim,
                            transform: [{translateY: yAnim}],
                        }}
                    >
                        <View>
                            <Text>Password must:</Text>
                            <Text style={{color: passwordRules.length ? "green" : "red"}}>• Have at least 8 characters</Text>
                            <Text style={{color: passwordRules.uppercase ? "green" : "red"}}>• Include at least one uppercase letter</Text>
                            <Text style={{color: passwordRules.lowercase ? "green" : "red"}}>• Include at least one lowercase letter</Text>
                            <Text style={{color: passwordRules.number ? "green" : "red"}}>• Include at least one number</Text>
                            <Text style={{color: passwordRules.specialChar ? "green" : "red"}}>• Include at least one special character</Text>
                        </View>
                    </Animated.View>
                )}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? (step === 2 ? "height" : "padding") : "height"}
                    keyboardVerticalOffset={keyboardVisible ? headerHeight + inputWrapperHeight - 20 : 0}
                    style={{
                        flex: 1,
                        backgroundColor: "#fff",
                        position: "absolute",
                        height: "auto",
                        maxHeight: "70%",
                        bottom: inset.bottom,
                        paddingVertical: keyboardVisible ? 0 : 16,
                        width: "100%",
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        shadowColor: "#000",
                        shadowOffset: {width: 0, height: 2},
                        justifyContent: "space-between",
                    }}
                >
                    <View
                        onLayout={(event) => {
                            const {height} = event.nativeEvent.layout;
                            setInputWrapperHeight(height);
                        }}
                    >
                        {step === 0 && (
                            <View
                                style={{
                                    paddingHorizontal: 16,
                                    gap: 12,
                                    marginBottom: 16,
                                    shadowColor: "#000",
                                    shadowOffset: {width: 0, height: 2},
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                }}
                            >
                                <Text>Select your account type</Text>
                                {typeData.map((item, index) => {
                                    const isDisabled = selectedType.includes(item);

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            disabled={isDisabled}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                backgroundColor: selectedType === item ? Colors.primary : "lightgray",
                                                shadowColor: "#000",
                                                shadowOffset: {width: 0, height: 2},
                                                shadowOpacity: 0.25,
                                                shadowRadius: 3.84,
                                                elevation: 5,
                                                padding: 16,
                                                borderRadius: 8,
                                            }}
                                            onPress={() => {
                                                if (isDisabled) setSelectedType(item);
                                            }}
                                        >
                                            <Text style={{fontSize: 16, color: selectedType === item ? Colors.white : "#000"}}>
                                                {item} {!isDisabled && "(Coming soon)"}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                        {step === 1 &&
                            (selectedType === "Customer" ? (
                                <StepOneCustomer
                                    emailNotFilled={emailNotFilled}
                                    setFullNameNotFilled={setFullNameNotFilled}
                                    fullNameNotFilled={fullNameNotFilled}
                                    setPasswordNotFilled={setPasswordNotFilled}
                                    passwordNotFilled={passwordNotFilled}
                                    setEmailNotFilled={setEmailNotFilled}
                                    email={email}
                                    setEmail={setEmail}
                                    fullName={fullName}
                                    setFullName={setFullName}
                                    password={password}
                                    setPassword={setPassword}
                                />
                            ) : selectedType === "Driver" ? (
                                <StepOneDriver />
                            ) : selectedType === "Merchant" ? (
                                <StepOneMerchant />
                            ) : null)}
                        {step === 2 &&
                            (selectedType === "Customer" ? (
                                <StepTwoCustomer selectedAllergies={selectedAllergies} setSelectedAllergies={setSelectedAllergies} />
                            ) : selectedType === "Driver" ? (
                                <StepTwoDriver />
                            ) : selectedType === "Merchant" ? (
                                <StepTwoMerchant />
                            ) : null)}

                        <View style={{paddingHorizontal: 16, flexDirection: "row", gap: 12}}>
                            {step > 0 && step < 3 && (
                                <TouchableOpacity
                                    style={{
                                        alignSelf: "center",
                                        width: "20%",
                                        padding: 16,
                                        borderRadius: 8,
                                        backgroundColor: Colors.white,
                                        borderWidth: 1,
                                        borderColor: Colors.primary,
                                    }}
                                    onPress={prevStep}
                                >
                                    <Text style={{fontSize: 16, fontWeight: "bold", color: Colors.primary}}>Back</Text>
                                </TouchableOpacity>
                            )}
                            {step < 3 ? (
                                <TouchableOpacity
                                    style={{
                                        alignSelf: "center",
                                        width: step > 0 ? "75%" : "100%",
                                        padding: 16,
                                        borderRadius: 8,
                                        backgroundColor: Colors.primary,
                                    }}
                                    onPress={nextStep}
                                >
                                    <Text style={{fontSize: 16, fontWeight: "bold", color: Colors.white}}>Next</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={{
                                        alignSelf: "center",
                                        width: step > 0 ? "75%" : "100%",
                                        padding: 16,
                                        borderRadius: 8,
                                        backgroundColor: Colors.primary,
                                    }}
                                    onPress={handleRegister}
                                >
                                    <Text style={{fontSize: 16, fontWeight: "bold", color: Colors.white}}>Finish</Text>
                                </TouchableOpacity>
                            )}
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
            </SafeAreaView>
        </View>
    );
}
