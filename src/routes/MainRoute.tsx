import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import Colors from "../utils/Colors";
import PendingTransactionsView from "../screens/main/PendingTransactionsView";
import {MaterialIcons} from "@expo/vector-icons";
import AllGroupsView from "../screens/main/groups/AllGroupsView";
import ProfileView from "../screens/main/ProfileView";
import {createStackNavigator} from "@react-navigation/stack";
import AuthRoute from "./AuthRoute";
import CreateJoinGroupView from "../screens/main/groups/CreateJoinGroupView";
import GroupDetailsRoute from "./GroupDetailsRoute";

const BottomTabs = createMaterialBottomTabNavigator()
const Stack = createStackNavigator()

function GroupsStack() {
    return (
        <Stack.Navigator initialRouteName="AllGroupsView">
            <Stack.Screen
                name="AllGroupsView"
                component={AllGroupsView}
                options={{headerShown: false, headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
            <Stack.Screen
                name="CreateJoinGroupView"
                component={CreateJoinGroupView}
                options={{headerTitle: "", headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
            <Stack.Screen
                name="GroupDetailsRoute"
                component={GroupDetailsRoute}
                options={{headerTitle: "", headerBackTitleVisible: false, headerTintColor: Colors.TEAL}}
            />
        </Stack.Navigator>
    )
}

function BottomTabsNav() {
    return (
        <BottomTabs.Navigator
            initialRouteName={"PendingTransactionsView"}
            activeColor={Colors.TEAL}
            inactiveColor={Colors.DARK_GRAY}
            barStyle={{backgroundColor: Colors.DARK}}
            labeled={false}
            shifting={false}
        >
            <BottomTabs.Screen
                name={"PendingTransactionsView"}
                component={PendingTransactionsView}
                options={{
                    tabBarIcon: ({color}) => (
                        <MaterialIcons name="pending" color={color} size={30}/>
                    )
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
        <Stack.Navigator initialRouteName="BottomTabsNav">
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