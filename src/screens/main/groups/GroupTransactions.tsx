import React, {useEffect, useState} from "react";
import {ActivityIndicator, SafeAreaView} from "react-native";
import {useIsFocused, useRoute} from "@react-navigation/core";
import axios from "axios";
import {BASE_API_URL} from "../../../utils/Constants";
import Colors from "../../../utils/Colors";
import {FlashList} from "@shopify/flash-list";
import TransactionItem from "../../../components/list-items/TransactionItem";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GroupTransactions = () => {

    //let {currentUser} = useCurrentUserStore()
    let currentUser = null

    const route = useRoute()
    const focused = useIsFocused()
    const [loading, setLoading] = useState(false)
    const [groupTransactions, setGroupTransactions] = useState([])

    const {groupId} = route.params

    const fetchTransactionDetails = async (transactionId: String) => {
        try {
            currentUser = JSON.parse(await AsyncStorage.getItem('user'))
            const response = await axios.post(`http://${BASE_API_URL}:8008/api/group/transactionDetails`, {
                transactionId: transactionId,
                userId: currentUser._id
            })
            return response.data.transaction
        } catch (e) {
            console.error(e)
            return null
        }
    }

    const fetchGroupTransactions = async () => {
        try {
            setLoading(true)
            currentUser = JSON.parse(await AsyncStorage.getItem('user'))
            await axios.post(`http://${BASE_API_URL}:8008/api/group/groupDetails`, {groupId: groupId})
                .then(async (response) => {
                    const groupTransactionsPromises = response.data.group.transactionHistory.map(async (transactionId: String) => {
                        return await fetchTransactionDetails(transactionId)
                    })
                    const transactionDetails = await Promise.all(groupTransactionsPromises)
                    setGroupTransactions(transactionDetails)
                })
                .catch((e) => console.error(e))
        } catch (e) {
            console.error("ERROR FETCHING GROUP TRANSACTIONS: ", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        focused && fetchGroupTransactions()
    }, [focused])

    return (
        <SafeAreaView style={{display: 'flex', flex: 1}}>
            {loading ? (
                <ActivityIndicator style={{marginTop: 20}} size={'small'} color={Colors.NIGHT_GREEN}/>
            ) : (
                <FlashList
                    contentContainerStyle={{padding: 8}}
                    data={groupTransactions}
                    keyExtractor={({_id}) => _id}
                    estimatedItemSize={75}
                    // refreshing={refresh}
                    // onRefresh={onRefresh}
                    showsVerticalScrollIndicator={false}
                    //ListEmptyComponent={NoResults}
                    removeClippedSubviews={false}
                    renderItem={({item}) => (
                        <TransactionItem item={item}/>
                    )}
                />
            )}
        </SafeAreaView>
    )
}

export default GroupTransactions