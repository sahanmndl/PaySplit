import React from "react";
import {Text, TouchableOpacity} from "react-native";
import Colors from "../../utils/Colors";

const TextButton = ({btnText, handleFunction, isDisabled}) => {
    return (
        <TouchableOpacity disabled={isDisabled} onPress={handleFunction}>
            <Text style={{
                marginStart: 4,
                color: isDisabled ? Colors.DARK_GRAY : Colors.BLUE,
                fontWeight: '500',
                fontSize: 18
            }}>
                {btnText}
            </Text>
        </TouchableOpacity>
    )
}

export default TextButton