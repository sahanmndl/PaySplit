import React from "react";
import {ScrollView} from "react-native";
import {useCurrentUserStore} from "../../../store";
import {useRoute} from "@react-navigation/core";

const TransactionDetailsView = () => {

    const {currentUser} = useCurrentUserStore()

    const route = useRoute()
    console.log(route.params)

    return (
        <ScrollView
            contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                paddingHorizontal: 15
            }}
            keyboardShouldPersistTaps={'never'}
            showsVerticalScrollIndicator={false}
        >

        </ScrollView>
    )
}

export default TransactionDetailsView