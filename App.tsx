import "react-native-gesture-handler";
import {StyleSheet} from 'react-native';
import {DarkTheme, NavigationContainer} from "@react-navigation/native";
import AuthRoute from "./src/routes/AuthRoute";
import {StatusBar} from "expo-status-bar";

export default function App() {
    return (
        <NavigationContainer theme={DarkTheme}>
            <StatusBar style={'light'}/>
            <AuthRoute/>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
