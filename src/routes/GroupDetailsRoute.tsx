import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import GroupTransactions from "../screens/main/groups/GroupTransactions";
import GroupMembers from "../screens/main/groups/GroupMembers";
import {useRoute} from "@react-navigation/core";

const TopTabs = createMaterialTopTabNavigator()

export const GroupDetailsRoute = () => {
    const route = useRoute()
    return (
        <TopTabs.Navigator initialRouteName="GroupMembers">
            <TopTabs.Screen
                name="GroupMembers"
                component={GroupMembers}
                initialParams={route.params}
                options={{title: "Members"}}
            />
            <TopTabs.Screen
                name="OngoingContestsView"
                component={GroupTransactions}
                initialParams={route.params}
                options={{title: "Pending Payments"}}
            />
        </TopTabs.Navigator>
    )
}

export default GroupDetailsRoute