import {View, Text, Modal} from "react-native";
import React from "react";

export default function CustomModal({children}: React.PropsWithChildren) {
    return (
        <Modal transparent>
            <View>
                <Text>Modal</Text>
            </View>
        </Modal>
    );
}
