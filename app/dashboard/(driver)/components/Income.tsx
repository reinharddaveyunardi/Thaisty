import {View, Text} from "react-native";
import React, {useState} from "react";
import {LineChart} from "react-native-chart-kit";
import SelectDropdown from "react-native-select-dropdown";
import {DropDownStyles} from "@/styles/Style";

export default function Income() {
    const [timeFrame, setTimeFrame] = useState("monthly");
    const timeFrameOptions = [
        {label: "Mingguan", value: "weekly"},
        {label: "Bulanan", value: "monthly"},
        {label: "3 Bulan", value: "3months"},
        {label: "6 Bulan", value: "6months"},
    ];

    const chartDataByTimeFrame = {
        weekly: {
            labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
            datasets: [{data: [12, 19, 14, 10, 25, 21, 9]}],
        },
        monthly: {
            labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
            datasets: [{data: [20, 45, 28, 80, 99, 43]}],
        },
        "3months": {
            labels: ["Jan", "Feb", "Mar"],
            datasets: [{data: [130, 150, 90]}],
        },
        "6months": {
            labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
            datasets: [{data: [230, 310, 180, 250, 200, 270]}],
        },
    };
    return (
        <View style={{alignItems: "center"}}>
            <View
                style={{
                    backgroundColor: "#fff",
                    width: "95%",
                    shadowColor: "#000",
                    shadowOffset: {width: 4, height: 4},
                    shadowOpacity: 0.1,
                    borderRadius: 12,
                    shadowRadius: 2,
                    elevation: 5,
                }}
            >
                <LineChart
                    data={{
                        ...chartDataByTimeFrame[timeFrame as keyof typeof chartDataByTimeFrame],
                        legend: ["Pendapatan"],
                    }}
                    width={375}
                    height={220}
                    yAxisLabel="฿"
                    chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                />

                <View style={{flexDirection: "row", alignItems: "center", gap: 4, width: "100%", paddingLeft: 16}}>
                    <Text>Pilih Waktu:</Text>
                    <SelectDropdown
                        disableAutoScroll
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={DropDownStyles.dropdownMenuStyle}
                        data={timeFrameOptions}
                        onSelect={(selectedItem) => setTimeFrame(selectedItem.value)}
                        renderItem={(item) => {
                            return (
                                <View style={DropDownStyles.dropdownButtonStyle} key={item.value}>
                                    <Text style={DropDownStyles.dropdownButtonTxtStyle}>{item.label}</Text>
                                </View>
                            );
                        }}
                        renderButton={() => {
                            return (
                                <View style={{...DropDownStyles.dropdownItemStyle}}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <Text style={DropDownStyles.dropdownButtonTxtStyle}>
                                            {timeFrameOptions.find((item) => item.value === timeFrame)?.label}
                                        </Text>
                                    </View>
                                </View>
                            );
                        }}
                    />
                </View>
            </View>
        </View>
    );
}
