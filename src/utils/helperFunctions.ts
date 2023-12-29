import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchCurrentUser = async () => {
    try {
        console.log("hehe: ", JSON.parse(await AsyncStorage.getItem('user')))
        return JSON.parse(await AsyncStorage.getItem('user'))
    } catch (e) {
        return null
    }
}