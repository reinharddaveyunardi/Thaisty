import {View, Text, Dimensions} from "react-native";
import React, {useEffect, useState} from "react";
import {LineChart} from "react-native-chart-kit";
import SelectDropdown from "react-native-select-dropdown";
import {DropDownStyles} from "@/styles/Style";
import {fetchIncomeData} from "@/services/api";
import {getUserId} from "@/services/SecureStore";
import Skeleton from "@/components/ui/SkeletonLoading";
import {Colors} from "@/constant/Colors";

export default function Income() {
    const [timeFrame, setTimeFrame] = useState("weekly");
    const [earningsData, setEarningsData] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const timeFrameOptions = [
        {label: "Weekly", value: "weekly"},
        {label: "Monthly", value: "monthly"},
        {label: "3 Months", value: "3months"},
        {label: "6 Months", value: "6months"},
    ];
    const chartDataByTimeFrame = {
        weekly: {labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]},
        monthly: {labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"]},
        "3months": {labels: ["Jan", "Feb", "Mar"]},
        "6months": {labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]},
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const userId = await getUserId();
            const data = await fetchIncomeData({userId: userId, timeFrame: timeFrame});
            setEarningsData(data);
            setLoading(false);
        };
        load();
    }, [timeFrame]);
    return (
        <View style={{alignItems: "center"}}>
            <View
                style={{
                    backgroundColor: "#fff",
                    width: "100%",
                    shadowColor: "#000",
                    shadowOffset: {width: 4, height: 4},
                    shadowOpacity: 0.1,
                    borderRadius: 12,
                    shadowRadius: 2,
                    elevation: 5,
                }}
            >
                {!loading && earningsData.length > 0 ? (
                    <LineChart
                        data={{
                            labels: chartDataByTimeFrame[timeFrame as keyof typeof chartDataByTimeFrame]?.labels.slice(0, earningsData.length) || [],
                            datasets: [{data: earningsData}],
                            legend: ["Income"],
                        }}
                        width={Dimensions.get("window").width - 32}
                        height={220}
                        withVerticalLines={false}
                        yAxisLabel="฿"
                        bezier
                        transparent
                        getDotColor={() => Colors.primary}
                        chartConfig={{
                            backgroundColor: "#fff",
                            backgroundGradientFrom: "#fff",
                            backgroundGradientTo: "#fff",
                            color: (opacity = 0.9) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor(opacity) {
                                return `rgba(68, 100, 156, ${opacity})`;
                            },
                        }}
                    />
                ) : (
                    <View style={{height: 220, alignItems: "center", justifyContent: "center", borderTopLeftRadius: 12, borderTopRightRadius: 12}}>
                        <Skeleton height={220} speed="slow" width={"100%"} style={{borderTopLeftRadius: 12, borderTopRightRadius: 12}} />
                        <Text style={{textAlign: "center", padding: 16, position: "absolute"}}>Loading chart data...</Text>
                    </View>
                )}

                <View style={{flexDirection: "row", alignItems: "center", gap: 4, width: "100%", paddingLeft: 16}}>
                    <Text style={{fontSize: 16}}>Time Frame:</Text>
                    <SelectDropdown
                        disableAutoScroll
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={DropDownStyles.dropdownMenuStyle}
                        data={timeFrameOptions}
                        onSelect={(selectedItem) => setTimeFrame(selectedItem.value)}
                        renderItem={(item) => {
                            return (
                                <View style={[DropDownStyles.dropdownButtonStyle]} key={item.value}>
                                    <Text style={DropDownStyles.dropdownButtonTxtStyle}>{item.label}</Text>
                                </View>
                            );
                        }}
                        renderButton={() => {
                            return (
                                <View style={{...DropDownStyles.dropdownItemStyle}}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <Text style={[DropDownStyles.dropdownButtonTxtStyle]}>
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
