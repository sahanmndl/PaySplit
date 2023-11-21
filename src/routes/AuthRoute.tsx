import {createStackNavigator} from "@react-navigation/stack";
import StartScreen from "../screens/authentication/StartScreen";
import RegisterScreen from "../screens/authentication/RegisterScreen";
import Colors from "../utils/Colors";
import LoginScreen from "../screens/authentication/LoginScreen";

const Stack = createStackNavigator()

function AuthRoute() {
    return (
        <Stack.Navigator initialRouteName="StartScreen">
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
        </Stack.Navigator>
    )
}

export default AuthRoute