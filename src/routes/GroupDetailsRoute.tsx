import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import GroupTransactions from "../screens/main/groups/GroupTransactions";
import GroupMembers from "../screens/main/groups/GroupMembers";
import {useRoute} from "@react-navigation/core";

const TopTabs = createMaterialTopTabNavigator()

export const GroupDetailsRoute = () => {
    const route = useRoute()
    return (
        <TopTabs.Navigator initialRouteName="GroupMembers" screenOptions={{lazy: true}}>
            <TopTabs.Screen
                name="GroupMembers"
                component={GroupMembers}
                initialParams={route.params}
                options={{title: "Members", lazy: true}}
            />
            <TopTabs.Screen
                name="GroupTransactions"
                component={GroupTransactions}
                initialParams={route.params}
                options={{title: "History", lazy: true}}
            />
        </TopTabs.Navigator>
    )
}

export default GroupDetailsRoute