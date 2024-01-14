import React from "react";
import {TouchableOpacity} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";

const ImageButton = ({isLoading, handleFunction, btnText, color, size}) => {

    return (
        <TouchableOpacity disabled={isLoading} onPress={handleFunction}>
            <MaterialIcons name={btnText} size={size} color={color} />
        </TouchableOpacity>
    )
}

export default ImageButton