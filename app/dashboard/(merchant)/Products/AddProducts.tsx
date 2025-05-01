import {View, Text, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet, Image, TextInput, KeyboardAvoidingView, Modal, StatusBar} from "react-native";
import React, {useState} from "react";
import {Ionicons} from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import {Unit} from "@/data/Unit";
import {Colors} from "@/constant/Colors";
import {addProduct} from "@/services/api";
import {AllergiesData} from "@/data/Allergies";

export default function AddProducts({navigation}: any) {
    const [images, setImages] = useState("");
    const [unit, toggleUnit] = useState("");
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState([{name: "", amount: "", unit: "g"}]);
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
    const addIngredient = () => {
        setIngredients([...ingredients, {name: "", amount: "", unit: "g"}]);
    };
    const removeIngredient = (index: number) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1);
        setIngredients(updatedIngredients);
    };

    return (
        <KeyboardAvoidingView style={{flex: 1}}>
            <StatusBar barStyle={"dark-content"} />
            <SafeAreaView>
                <View
                    style={{
                        width: "100%",
                        height: 50,
                        backgroundColor: "white",
                        paddingHorizontal: 10,
                        elevation: 5,
                        shadowColor: "#000",
                        flexDirection: "row",
                        alignItems: "center",
                        borderBottomLeftRadius: 16,
                        borderBottomRightRadius: 16,
                    }}
                >
                    <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={{flexGrow: 1, padding: 16, gap: 16}}>
                    <View>
                        {images != "" ? (
                            <Image source={{uri: images}} style={{width: "100%", height: 200}} />
                        ) : (
                            <Image
                                source={{uri: "https://content.hostgator.com/img/weebly_image_sample.png"}}
                                style={{width: 200, height: 200, borderRadius: 8}}
                            />
                        )}
                        <View style={{gap: 8}}>
                            <Text>Add image(Link):</Text>
                            <View style={{flexDirection: "row", gap: 8, width: "100%", alignItems: "center"}}>
                                <TextInput
                                    style={{borderWidth: 1, borderColor: "#000000", borderRadius: 8, padding: 8, width: "auto", flex: 1}}
                                    onChangeText={(e) => setImages(e)}
                                />
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text>Product Name:</Text>
                        <TextInput style={{borderWidth: 1, borderColor: "#000000", borderRadius: 8, padding: 8}} />
                    </View>

                    <View>
                        <Text>Product Price(BATH):</Text>
                        <TextInput style={{borderWidth: 1, borderColor: "#000000", borderRadius: 8, padding: 8}} />
                    </View>
                    <View>
                        <Text>Product Description:</Text>
                        <TextInput style={{borderWidth: 1, borderColor: "#000000", borderRadius: 8, padding: 8}} />
                    </View>
                    <View>
                        <Text>Food Allergies:</Text>
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
                    <View style={{gap: 3}}>
                        <Text>Product Ingredients:</Text>
                        <View style={{flexDirection: "column", gap: 8}}>
                            {ingredients.map((item, index) => (
                                <View key={index} style={{flexDirection: "row", gap: 8, marginBottom: 8, width: "100%"}}>
                                    <TextInput
                                        placeholder="Name"
                                        style={{flex: 1, borderWidth: 1, padding: 8, borderRadius: 8}}
                                        value={item.name}
                                        onChangeText={(text) => {
                                            const updated = [...ingredients];
                                            updated[index].name = text;
                                            setIngredients(updated);
                                        }}
                                    />
                                    <TextInput
                                        placeholder="Amount"
                                        keyboardType="numeric"
                                        style={{flex: 1, borderWidth: 1, padding: 8, borderRadius: 8, width: "30%"}}
                                        value={item.amount}
                                        onChangeText={(text) => {
                                            const updated = [...ingredients];
                                            updated[index].amount = text;
                                            setIngredients(updated);
                                        }}
                                    />
                                    <SelectDropdown
                                        data={Unit}
                                        statusBarTranslucent={true}
                                        onSelect={(selectedItem) => {
                                            const updated = [...ingredients];
                                            updated[index].unit = selectedItem.name;
                                            setIngredients(updated);
                                        }}
                                        renderButton={(isOpened) => {
                                            return (
                                                <View
                                                    style={{
                                                        height: 40,
                                                        width: "auto",
                                                        borderRadius: 12,
                                                        flexDirection: "row",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        paddingHorizontal: 12,
                                                        borderWidth: 1,
                                                    }}
                                                >
                                                    <Text>{item.unit}</Text>
                                                    <Ionicons name={isOpened ? "chevron-up" : "chevron-down"} size={20} />
                                                </View>
                                            );
                                        }}
                                        renderItem={(item) => (
                                            <View style={{...styles.dropdownItemStyle}}>
                                                <Text>{item.name}</Text>
                                            </View>
                                        )}
                                        disableAutoScroll={true}
                                        showsVerticalScrollIndicator={false}
                                        dropdownStyle={styles.dropdownMenuStyle}
                                    />
                                    <TouchableOpacity
                                        onPress={() => removeIngredient(index)}
                                        style={{alignSelf: "center", backgroundColor: Colors.danger, padding: 8, borderRadius: 8}}
                                    >
                                        <Ionicons name="close" size={20} color={"white"} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity
                            onPress={() => addIngredient()}
                            style={{backgroundColor: Colors.primary, padding: 8, borderRadius: 8, height: 50, justifyContent: "center", alignItems: "center"}}
                        >
                            <Text style={{color: "white"}}>Add Ingredient</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => console.log(ingredients)}
                        style={{backgroundColor: Colors.primary, padding: 8, borderRadius: 8, height: 50, justifyContent: "center", alignItems: "center"}}
                    >
                        <Text>Add Product</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
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
