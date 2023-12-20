import "react-native-gesture-handler";
import {Alert} from 'react-native';
import {DarkTheme, NavigationContainer} from "@react-navigation/native";
import AuthRoute from "./src/routes/AuthRoute";
import {StatusBar} from "expo-status-bar";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainRoute from "./src/routes/MainRoute";
import {PaperProvider} from "react-native-paper";
import {useCurrentUserStore} from "./src/store";

export default function App() {

    const {currentUser, setCurrentUser} = useCurrentUserStore()

    const [user, setUser] = useState(null)

    const fetchCurrentUser = async () => {
        try {
            const user = await AsyncStorage.getItem('user')
            setUser(user)
            setCurrentUser(user)
        } catch (e) {
            Alert.alert("Error!", e.message)
        }
    }

    useEffect(() => {
        fetchCurrentUser()
    }, [user])

    return (
        <PaperProvider theme={DarkTheme}>
            <NavigationContainer theme={DarkTheme}>
                <StatusBar style={'light'}/>
                {user ? <MainRoute/> : <AuthRoute/>}
            </NavigationContainer>
        </PaperProvider>
    );
}
