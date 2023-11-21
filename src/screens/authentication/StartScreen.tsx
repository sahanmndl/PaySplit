import React from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "../../utils/Colors";
import {AntDesign} from "@expo/vector-icons";
import {ParamListBase, useNavigation} from "@react-navigation/core";
import {StackNavigationProp} from "@react-navigation/stack";

const StartScreen = () => {

    const navigation = useNavigation<StackNavigationProp<ParamListBase>>()

    return (
        <ScrollView contentContainerStyle={{flex: 1, backgroundColor: Colors.DARK, paddingHorizontal: 15}}>
            <View style={{flex: 0.75, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: 'white', fontSize: 40, fontWeight: '700'}}>
                    PaySplit
                </Text>
            </View>
            <View style={{flex: 0.25, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                    style={styles.btnStarted}
                    onPress={() => requestAnimationFrame(() => {
                        navigation.navigate("RegisterScreen")
                    })}
                >
                    <Text style={{fontSize: 16, fontWeight: '700', color: 'white', marginRight: 8}}>
                        Get Started
                    </Text>
                    <AntDesign name="arrowright" color={'white'} size={17}/>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default StartScreen

const styles = StyleSheet.create({
    btnStarted: {
        height: 55,
        width: '100%',
        backgroundColor: Colors.TEAL,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        flexDirection: 'row',
        elevation: 4
    }
})