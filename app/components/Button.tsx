import {View, Text, TouchableOpacity, ActivityIndicator, StyleSheet} from "react-native";
import React from "react";

interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
}
const CustomButton = ({title, onPress, disabled, loading}: ButtonProps) => {
    return (
        <TouchableOpacity style={[styles.button, disabled && styles.disabled]} onPress={onPress} disabled={disabled || loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.text}>{title}</Text>}
        </TouchableOpacity>
    );
};
CustomButton.Submit = function SubmitButton({title, onPress, disabled, loading}: ButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, styles.submit, disabled && styles.disabled]} onPress={onPress} disabled={disabled || loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.text}>{title}</Text>}
        </TouchableOpacity>
    );
};
CustomButton.Cancel = function CancelButton({title, onPress, disabled}: ButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, styles.cancel, disabled && styles.disabled]} onPress={onPress} disabled={disabled}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};
CustomButton.Bordered = function CancelButton({title, onPress, disabled}: ButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, styles.bordered, disabled && styles.disabled]} onPress={onPress} disabled={disabled}>
            <Text style={styles.borderedText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {padding: 12, borderRadius: 8, alignItems: "center", justifyContent: "center", width: "100%", marginVertical: 8},
    submit: {backgroundColor: "#44649c"},
    cancel: {backgroundColor: "#d9534f"},
    bordered: {borderWidth: 1, borderColor: "#44649c", backgroundColor: "transparent"},
    text: {color: "white", fontSize: 16, fontWeight: "bold"},
    borderedText: {color: "#44649c", fontSize: 16, fontWeight: "bold"},
    disabled: {backgroundColor: "#a0a0a0"},
});

export default CustomButton;
