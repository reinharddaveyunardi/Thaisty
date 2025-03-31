import {View, Text, TextInput, TouchableOpacity, StyleSheet, Modal} from "react-native";
import React, {useState} from "react";
import {Colors} from "@/constant/Colors";
import AuthInput from "../components/AuthInput";
import {ValidatePassword} from "@/utils/ValidatePassword";

interface StepOneProps {
    fullName: string;
    setFullName: (fullName: string) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    confirmPassword: string;
    setConfirmPassword: (confirmPassword: string) => void;
    nextStep: () => void;
}

export default function StepOne({nextStep, fullName, email, password, confirmPassword, setFullName, setEmail, setPassword, setConfirmPassword}: StepOneProps) {
    const [popup, setPopup] = useState(false);
    const [popupText, setPopupText] = useState("");
    const passwordRules = ValidatePassword(password);

    const handleNextStep = () => {
        if (!fullName.trim() || !email.trim() || !password.trim()) {
            setPopupText("Please fill in all the required fields.");
            setPopup(true);
            return;
        }
        nextStep();
    };

    return (
        <View>
            <View>
                <AuthInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    forPassword={false}
                    value={fullName}
                    onChangeText={(text) => setFullName(text)}
                />
                <AuthInput label="Email" placeholder="Enter your Email" forPassword={false} value={email} onChangeText={(text) => setEmail(text)} />
                <View style={{marginBottom: 16}}>
                    <AuthInput label="Create your Password" placeholder="Enter your new password" forPassword value={password} onChangeText={setPassword} />
                    <View>
                        <Text>Password must:</Text>
                        <Text style={{color: passwordRules.length ? "green" : "red"}}>• Have at least 8 characters</Text>
                        <Text style={{color: passwordRules.uppercase ? "green" : "red"}}>• Include at least one uppercase letter</Text>
                        <Text style={{color: passwordRules.lowercase ? "green" : "red"}}>• Include at least one lowercase letter</Text>
                        <Text style={{color: passwordRules.number ? "green" : "red"}}>• Include at least one number</Text>
                        <Text style={{color: passwordRules.specialChar ? "green" : "red"}}>• Include at least one special character</Text>
                    </View>
                </View>
            </View>
            {/* Popup */}
            <Modal visible={popup} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Opss..</Text>
                            </View>
                            <Text>{popupText}</Text>
                        </View>
                        <TouchableOpacity style={styles.okButton} onPress={() => setPopup(false)}>
                            <Text style={{color: "#fff"}}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity onPress={handleNextStep} style={styles.nextButton}>
                <Text style={{color: "#fff", textAlign: "center"}}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        gap: 16,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    okButton: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 5,
    },
    nextButton: {
        backgroundColor: Colors.primary,
        padding: 10,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
});
