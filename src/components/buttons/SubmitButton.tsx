import React from "react";
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity} from "react-native";
import Colors from "../../utils/Colors";

const SubmitButton = ({isLoading, handleFunction, btnText}) => {
    return (
        <TouchableOpacity
            style={styles.buttonSubmit}
            disabled={isLoading}
            onPress={handleFunction}
        >
            {isLoading ?
                <ActivityIndicator color={'white'}/>
                : <Text style={styles.btnText}>{btnText}</Text>
            }
        </TouchableOpacity>
    )
}

export default SubmitButton

const styles = StyleSheet.create({
    buttonSubmit: {
        height: 50,
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.TEAL,
        borderRadius: 4,
        elevation: 4,
        marginTop: 30
    },
    btnText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700"
    }
})