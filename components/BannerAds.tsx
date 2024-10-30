import {StyleSheet, Text, View, Image} from "react-native";
import React from "react";
import Carousel from "react-native-reanimated-carousel";
import {thisDeviceWidth} from "@/utils";

const banner = [require("@/assets/images/ads.jpg"), require("@/assets/images/ads1.png")];
export default function BannerAds() {
    return (
        <View>
            <Carousel
                width={thisDeviceWidth}
                height={200}
                loop
                scrollAnimationDuration={3000}
                autoPlay={true}
                data={banner}
                snapEnabled
                renderItem={({item}) => (
                    <View style={{alignItems: "center", justifyContent: "center"}}>
                        <Image style={{width: "100%", height: 200, alignItems: "center"}} resizeMode="cover" source={item} />
                    </View>
                )}
            />
        </View>
    );
}
