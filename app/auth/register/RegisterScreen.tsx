import React, {useEffect, useRef, useState} from "react";
import {View, Text, TouchableOpacity, StyleSheet, Animated, SafeAreaView, Easing, Dimensions, KeyboardAvoidingView} from "react-native";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import {Colors} from "@/constant/Colors";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {register} from "@/hook/useAuth";

export default function RegisterScreen() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };
    const handleRegister = async () => {
        setLoading(true);
        try {
            await register({email, password, fullName, allergies: selectedAllergies, address_one: "", address_two: ""});
            router.push("/auth/LoginScreen");
        } catch (error) {
            console.error("Registration Error:", error);
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <View style={{paddingHorizontal: 32, paddingVertical: 48, gap: 12}}>
                <View style={{alignItems: "center", flexDirection: "row", justifyContent: "space-between"}}>
                    <View>
                        <Text style={{fontSize: 48, fontWeight: "bold", color: Colors.primary, textAlign: "center"}}>Sign Up</Text>
                        <Text>Please fill out the form below</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.9}>
                            <Ionicons name="close-outline" size={48} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{width: "100%", height: 0.5, backgroundColor: "gray"}} />
                <View style={{top: 20}}>
                    <ProgressIndicator step={step} />
                </View>
                <View>
                    {step === 1 && (
                        <StepOne
                            nextStep={nextStep}
                            email={email}
                            password={password}
                            confirmPassword={confirmPassword}
                            fullName={fullName}
                            setFullName={setFullName}
                            setEmail={setEmail}
                            setPassword={setPassword}
                            setConfirmPassword={setConfirmPassword}
                        />
                    )}
                    {step === 2 && (
                        <StepTwo
                            nextStep={nextStep}
                            prevStep={prevStep}
                            selectedAllergies={selectedAllergies}
                            setSelectedAllergies={setSelectedAllergies}
                            onFinish={handleRegister}
                        />
                    )}
                    {step === 3 && <StepThree prevStep={prevStep} />}
                </View>
            </View>
        </SafeAreaView>
    );
}

const ProgressIndicator = ({step}: any) => {
    const progressAnim = useRef(new Animated.Value(0)).current;
    const icon: {name: "person" | "fast-food" | "checkmark-circle"}[] = [{name: "person"}, {name: "fast-food"}, {name: "checkmark-circle"}];
    const translateYValues = useRef(icon.map(() => new Animated.Value(0))).current;
    const opacityValues = useRef(icon.map(() => new Animated.Value(1))).current;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: ((step - 1) * Dimensions.get("window").width) / 5 - 25,
            duration: 300,
            useNativeDriver: false,
        }).start();
        icon.forEach((_, index) => {
            Animated.timing(translateYValues[index], {
                toValue: step > index ? -20 : 7,
                duration: 300,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
            Animated.timing(opacityValues[index], {
                toValue: step > index ? 1 : 0,
                duration: 300,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        });
    }, [step]);

    return (
        <View style={stylesProgress.container}>
            <View style={stylesProgress.line} />
            <Animated.View style={[stylesProgress.progressLine, {width: progressAnim}]} />
            {icon.map((name, index) => (
                <View style={{alignItems: "center"}} key={index}>
                    <Animated.View
                        style={[
                            {
                                marginHorizontal: "5.5%",
                                width: 32,
                                height: 32,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: step > index ? "rgba(68, 100, 156, .2)" : "gray",
                                borderRadius: 10,
                                transform: [{translateY: translateYValues[index]}],
                            },
                        ]}
                    >
                        <Ionicons name={name.name} size={24} color={step > index ? Colors.primary : "#fff"} />
                    </Animated.View>
                    <Animated.View
                        key={index}
                        style={{
                            width: 18,
                            height: 18,
                            borderRadius: 18,
                            backgroundColor: Colors.primary,
                            opacity: opacityValues[index],
                            bottom: 13,
                        }}
                    />
                </View>
            ))}
        </View>
    );
};
const stylesProgress = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
        position: "relative",
    },
    line: {
        position: "absolute",
        width: "35%",
        left: "31%",
        height: 4,
        backgroundColor: "#ccc",
        top: 25,
    },
    progressLine: {
        position: "absolute",
        height: 4,
        top: 25,
        width: "100%",
        left: "31%",
        backgroundColor: Colors.primary,
    },
    dot: {
        width: 32,
        height: 32,
        borderRadius: 10,
        marginHorizontal: Dimensions.get("window").width / 5 - 10,
    },
});
