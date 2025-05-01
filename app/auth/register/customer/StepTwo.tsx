import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import React from "react";
import SelectDropdown from "react-native-select-dropdown";
import {AllergiesData} from "@/data/Allergies";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "react-native/Libraries/NewAppScreen";

export default function StepTwoCustomer({
    selectedAllergies,
    setSelectedAllergies,
}: {
    selectedAllergies: string[];
    setSelectedAllergies: (allergies: string[]) => void;
}) {
    const toggleAllergy = (item: string) => {
        if (selectedAllergies.includes(item)) {
            setSelectedAllergies(selectedAllergies.filter((allergy) => allergy !== item));
        } else {
            setSelectedAllergies([...selectedAllergies, item]);
        }
    };

    const sortAllergies = [...AllergiesData].sort((a, b) => {
        const aSelected = selectedAllergies.includes(a.name);
        const bSelected = selectedAllergies.includes(b.name);
        return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
    return (
        <View style={{gap: 12, padding: 16}}>
            <View style={{gap: 4}}>
                <Text>Select your allergies</Text>
                <Text style={{color: Colors.primary}}>
                    *This helps us filter out foods that may not be suitable for you. Or you can update your allergies anytime in your settings.
                </Text>
                <SelectDropdown
                    search={true}
                    renderSearchInputLeftIcon={() => <Ionicons name="search" size={20} />}
                    statusBarTranslucent={true}
                    searchPlaceHolder="Search your allergies"
                    data={sortAllergies}
                    onSelect={(selectedItem) => {
                        toggleAllergy(selectedItem.name);
                    }}
                    renderButton={(isOpened) => {
                        return (
                            <View style={styles.dropdownButtonStyle} key={isOpened}>
                                {AllergiesData.length == 0 && <Text>No allergies selected</Text>}
                                <Text style={styles.dropdownButtonTxtStyle}>
                                    {selectedAllergies
                                        ? selectedAllergies.length > 5
                                            ? `${selectedAllergies.slice(0, 5).join(", ")}...`
                                            : selectedAllergies.join(", ")
                                        : "Select your allergies"}
                                </Text>
                                <Ionicons name={isOpened ? "chevron-up" : "chevron-down"} style={styles.dropdownButtonArrowStyle} size={20} />
                            </View>
                        );
                    }}
                    renderItem={(item) => {
                        return (
                            <View style={{...styles.dropdownItemStyle}} key={item.id}>
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
