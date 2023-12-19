import React from "react";
import {Text, TouchableOpacity} from "react-native";
import Colors from "../../utils/Colors";

const TextButton = ({btnText, handleFunction, isDisabled}) => {
    return (
        <TouchableOpacity onPress={handleFunction}>
            <Text style={{marginStart: 4, color: isDisabled ? Colors.DARK_GRAY : Colors.BLUE, fontWeight: '700'}}>
                {btnText}
            </Text>
        </TouchableOpacity>
    )
}

export default TextButton