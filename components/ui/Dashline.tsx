import React from "react";
import {Dimensions, View} from "react-native";
import Svg, {Line} from "react-native-svg";

export default function DashedLine({color = "#ccc", dashWidth = 4, dashGap = 4, width = Dimensions.get("window").width, height = 1}) {
    return (
        <View style={[{width, height}]}>
            <Svg height={height} width="100%">
                <Line x1="0" y1={height / 2} x2="100%" y2={height / 2} stroke={color} strokeWidth={height} strokeDasharray={`${dashWidth},${dashGap}`} />
            </Svg>
        </View>
    );
}
