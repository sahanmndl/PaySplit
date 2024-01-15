import Colors from "../utils/Colors";
import PendingTransactionsView from "../screens/main/transactions/PendingTransactionsView";
import {MaterialIcons} from "@expo/vector-icons";
import AllGroupsView from "../screens/main/groups/AllGroupsView";
import ProfileView from "../screens/main/ProfileView";
import {createStackNavigator} from "@react-navigation/stack";
import AuthRoute from "./AuthRoute";
import CreateJoinGroupView from "../screens/main/groups/CreateJoinGroupView";
import GroupDetailsRoute from "./GroupDetailsRoute";
import TransactionRoute from "./TransactionRoute";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {useRoute} from "@react-navigation/core";
import TransactionDetailsView from "../screens/main/transactions/TransactionDetailsView";

const BottomTabs = createBottomTabNavigator()
const Stack = createStackNavigator()

function GroupsStack() {
    const route = useRoute()
    return (
        <Stack.Navigator initialRouteName="AllGroupsView">
            <Stack.Screen
                name="AllGroupsView"
                component={AllGroupsView}
                initialParams={route.params}
                options={{headerShown: false, headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
            <Stack.Screen
                name="CreateJoinGroupView"
                component={CreateJoinGroupView}
                initialParams={route.params}
                options={{headerTitle: "", headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
            <Stack.Screen
                name="GroupDetailsRoute"
                component={GroupDetailsRoute}
                initialParams={route.params}
                options={{headerTitle: "", headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
            <Stack.Screen
                name="TransactionRoute"
                component={TransactionRoute}
                initialParams={route.params}
                options={{headerShown: false, headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
            <Stack.Screen
                name="TransactionDetailsView"
                component={TransactionDetailsView}
                initialParams={route.params}
                options={{headerTitle: "", headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
        </Stack.Navigator>
    )
}

function PendingTransactionsStack() {
    const route = useRoute()
    return (
        <Stack.Navigator initialRouteName="PendingTransactionsView">
            <Stack.Screen
                name="PendingTransactionsView"
                component={PendingTransactionsView}
                initialParams={route.params}
                options={{headerShown: false, headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
            <Stack.Screen
                name="TransactionDetailsView"
                component={TransactionDetailsView}
                initialParams={route.params}
                options={{headerTitle: "", headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
        </Stack.Navigator>
    )
}

function BottomTabsNav() {
    return (
        <BottomTabs.Navigator
            initialRouteName={"PendingTransactionsStack"}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: Colors.TEAL,
                tabBarInactiveTintColor: Colors.DARK_GRAY,
                tabBarActiveBackgroundColor: Colors.DARK,
                tabBarInactiveBackgroundColor: Colors.DARK,
            }}
        >
            <BottomTabs.Screen
                name={"PendingTransactionsStack"}
                component={PendingTransactionsStack}
                options={{
                    tabBarIcon: ({color}) => (
                        <MaterialIcons name="pending" color={color} size={30}/>
                    ),
                }}
            />
            <BottomTabs.Screen
                name={"GroupsStack"}
                component={GroupsStack}
                options={{
                    tabBarIcon: ({color}) => (
                        <MaterialIcons name="groups" color={color} size={32}/>
                    )
                }}
            />
            <BottomTabs.Screen
                name={"ProfileView"}
                component={ProfileView}
                options={{
                    tabBarIcon: ({color}) => (
                        <MaterialIcons name="account-circle" color={color} size={30}/>
                    )
                }}
            />
        </BottomTabs.Navigator>
    )
}

function MainRoute() {
    return (
        <Stack.Navigator initialRouteName="BottomTabsNav" screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="BottomTabsNav"
                component={BottomTabsNav}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="AuthRoute"
                component={AuthRoute}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
}

export default MainRoute