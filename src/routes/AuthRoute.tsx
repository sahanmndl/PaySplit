import {createStackNavigator} from "@react-navigation/stack";
import StartScreen from "../screens/authentication/StartScreen";
import RegisterScreen from "../screens/authentication/RegisterScreen";
import Colors from "../utils/Colors";
import LoginScreen from "../screens/authentication/LoginScreen";
import MainRoute from "./MainRoute";
import {Platform} from "react-native";

const Stack = createStackNavigator()

function AuthRoute() {
    return (
        <Stack.Navigator initialRouteName="StartScreen"
                         screenOptions={{presentation: Platform.OS === 'ios' ? 'modal' : 'card'}}>
            <Stack.Screen
                name="StartScreen"
                component={StartScreen}
                options={{headerShown: false, headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
            <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{headerTitle: "", headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{headerTitle: "", headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
            <Stack.Screen
                name={"MainRoute"}
                component={MainRoute}
                options={{headerTitle: "", headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
        </Stack.Navigator>
    )
}

export default AuthRoute