import React, {useEffect, useState} from "react";
import {ActivityIndicator, SafeAreaView} from "react-native";
import {useIsFocused, useRoute} from "@react-navigation/core";
import axios from "axios";
import {BASE_API_URL, ON_LOAD, ON_REFRESH} from "../../../utils/Constants";
import Colors from "../../../utils/Colors";
import {FlashList} from "@shopify/flash-list";
import TransactionItem from "../../../components/list-items/TransactionItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoResultsView from "../../../components/list-items/NoResultsView";

const GroupTransactions = () => {

    let currentUser = null

    const route = useRoute()
    const focused = useIsFocused()
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [groupTransactions, setGroupTransactions] = useState([])

    const {groupId} = route.params

    const fetchGroupTransactions = async (getType: String) => {
        try {
            setLoading(true)
            currentUser = JSON.parse(await AsyncStorage.getItem('user'))
            const requestBody = {
                groupId: groupId,
                userId: currentUser._id,
                getType: getType
            }
            await axios.post(`http://${BASE_API_URL}:8008/api/group/groupTransactionHistory`, requestBody)
                .then((response) => setGroupTransactions(response.data.transactionHistory))
                .catch((e) => console.error(e))
        } catch (e) {
            console.error("ERROR FETCHING GROUP TRANSACTIONS: ", e)
        } finally {
            setLoading(false)
            setRefresh(false)
        }
    }

    const onRefresh = () => {
        setRefresh(true)
        fetchGroupTransactions(ON_REFRESH)
    }

    useEffect(() => {
        focused && fetchGroupTransactions(ON_LOAD)
    }, [focused])

    return (
        <SafeAreaView style={{display: 'flex', flex: 1}}>
            {loading ? (
                <ActivityIndicator style={{marginTop: 20}} size={'small'} color={Colors.NIGHT_GREEN}/>
            ) : (
                <FlashList
                    contentContainerStyle={{padding: 10}}
                    data={groupTransactions}
                    keyExtractor={({_id}) => _id}
                    estimatedItemSize={75}
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<NoResultsView type={1}/>}
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