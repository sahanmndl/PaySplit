import {createStackNavigator} from "@react-navigation/stack";
import Colors from "../utils/Colors";
import SelectMembersView from "../screens/main/transactions/SelectMembersView";
import CreateTransactionView from "../screens/main/transactions/CreateTransactionView";
import {useRoute} from "@react-navigation/core";

const Stack = createStackNavigator()

function TransactionRoute() {

    const route = useRoute()

    return (
        <Stack.Navigator initialRouteName="SelectMembersView">
            <Stack.Screen
                name="SelectMembersView"
                component={SelectMembersView}
                initialParams={route.params}
                options={{headerShown: false, headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
            <Stack.Screen
                name="CreateTransactionView"
                component={CreateTransactionView}
                initialParams={route.params}
                options={{headerShown: false, headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
        </Stack.Navigator>
    )
}

export default TransactionRoute