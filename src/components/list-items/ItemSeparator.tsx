import React from "react";
import {StyleSheet, View} from "react-native";
import Colors from "../../utils/Colors";

const ItemSeparator = () => {
    return (
        <View style={{
            backgroundColor: Colors.DARK_GRAY,
            height: StyleSheet.hairlineWidth,
            marginLeft: '16%',
            marginRight: '4%'
        }}/>
    )
}

export default ItemSeparator