import AsyncStorage from "@react-native-async-storage/async-storage";
import {Alert} from "react-native";

export const fetchCurrentUser = async () => {
    try {
        console.log("hehe: ", JSON.parse(await AsyncStorage.getItem('user')))
        return JSON.parse(await AsyncStorage.getItem('user'))
    } catch (e) {
        return null
    }
}

export const logoutAlert = ({handleFunction}) => {
    Alert.alert(
        "Confirmation", "Do you want to delete this bill?",
        [
            {
                text: 'Cancel',
                onPress: () => console.log("Cancel"),
                style: "cancel",
            },
            {
                text: 'Yes',
                onPress: handleFunction
            }
        ],
        {cancelable: true}
    )
}