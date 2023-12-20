import React from "react";
import {Alert, ScrollView, TouchableOpacity, Text, View, SafeAreaView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/core";

const ProfileView = () => {

    const navigation = useNavigation()

    const logout = async () => {
        const keys = ['user']
        try {
            await AsyncStorage.multiRemove(keys)
                .then(async () => {
                    navigation.reset({
                        index: 0,
                        routes: [{name: 'AuthRoute'}]
                    })
                    return true
                })
        } catch (err) {
            Alert.alert('Error!', '')
            return false
        } finally {

        }
    }

    const logoutAlert = () => {
        Alert.alert(
            "Confirmation", "Do you want to logout?",
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log("Cancel"),
                    style: "cancel",
                },
                {
                    text: 'Yes',
                    onPress: () => logout()
                }
            ],
            {cancelable: true}
        )
    }

    return (
        <SafeAreaView style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity style={{backgroundColor: 'red'}} onPress={() => logoutAlert()}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default ProfileView