import {View, Text, TextInput, TouchableOpacity, StyleSheet} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import React, {useState} from "react";
import {Colors} from "@/constant/Colors";
import {AllergiesData} from "@/data/Allergies";
import Ionicons from "@expo/vector-icons/Ionicons";

type StepTwo = {
    nextStep: () => void;
    prevStep: () => void;
    onFinish: () => void;
    selectedAllergies: string[];
    setSelectedAllergies: (allergies: string[]) => void;
};

export default function StepTwo({nextStep, prevStep, selectedAllergies, setSelectedAllergies, onFinish}: StepTwo) {
    const toggleAllergy = (item: string) => {
        if (selectedAllergies.includes(item)) {
            setSelectedAllergies(selectedAllergies.filter((allergy) => allergy !== item));
        } else {
            setSelectedAllergies([...selectedAllergies, item]);
        }
    };

    return (
        <View style={{gap: 12}}>
            <View style={{gap: 4}}>
                <Text>Select your allergies</Text>
                <Text style={{color: Colors.primary}}>
                    *This helps us filter out foods that may not be suitable for you. Or you can update your allergies anytime in your settings.
                </Text>
                <SelectDropdown
                    search={true}
                    renderSearchInputLeftIcon={() => <Ionicons name="search" size={20} />}
                    searchPlaceHolder="Search your allergies"
                    data={AllergiesData}
                    onSelect={(selectedItem) => {
                        toggleAllergy(selectedItem.name);
                    }}
                    renderButton={(isOpened) => {
                        return (
                            <View style={styles.dropdownButtonStyle} key={isOpened}>
                                {AllergiesData.length == 0 && <Text>No allergies selected</Text>}
                                <Text style={styles.dropdownButtonTxtStyle}>
                                    {selectedAllergies
                                        ? selectedAllergies.length > 2
                                            ? `${selectedAllergies.slice(0, 2).join(", ")}...`
                                            : selectedAllergies.join(", ")
                                        : "Select your allergies"}
                                </Text>
                                <Ionicons name={isOpened ? "chevron-up" : "chevron-down"} style={styles.dropdownButtonArrowStyle} size={20} />
                            </View>
                        );
                    }}
                    renderItem={(item) => {
                        return (
                            <View style={{...styles.dropdownItemStyle}}>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <Text style={styles.dropdownItemTxtStyle}>{item.name}</Text>
                                    {selectedAllergies.includes(item.name) ? <Ionicons name="checkmark" size={20} color={"green"} /> : null}
                                </View>
                            </View>
                        );
                    }}
                    disableAutoScroll
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                />
            </View>
            <View>
                <Text></Text>
            </View>
            {selectedAllergies.map((item) => (
                <Text>{item}</Text>
            ))}
            <View style={{gap: 12}}>
                <TouchableOpacity
                    style={{backgroundColor: Colors.primary, padding: 10, height: 50, alignItems: "center", justifyContent: "center", borderRadius: 10}}
                    onPress={onFinish}
                >
                    <Text style={{color: "white"}}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={prevStep}
                    style={{backgroundColor: "lightgray", padding: 10, height: 50, alignItems: "center", justifyContent: "center", borderRadius: 10}}
                >
                    <Text>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "500",
        color: "#151E26",
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: "#E9ECEF",
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        flexDirection: "row",
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "500",
        color: "#151E26",
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});
