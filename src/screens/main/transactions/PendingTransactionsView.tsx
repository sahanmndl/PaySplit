import React, {useEffect, useState} from "react";
import {ActivityIndicator, Text, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import axios from "axios";
import {BASE_API_URL} from "../../../utils/Constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../../utils/Colors";
import {FlashList} from "@shopify/flash-list";
import TransactionItem from "../../../components/list-items/TransactionItem";

const PendingTransactionsView = () => {

    let currentUser = null
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [pendingTransactions, setPendingTransactions] = useState([])

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

    const fetchUserPendingTransactions = async () => {
        try {
            setLoading(true)
            currentUser = JSON.parse(await AsyncStorage.getItem('user'))
            await axios.post(`http://${BASE_API_URL}:8008/api/user/userDetails`, {userId: currentUser._id})
                .then(async (response) => {
                    const pendingTransactionPromises = response.data.user.pendingTransactions.map(async (transactionId: String) => {
                        return await fetchTransactionDetails(transactionId)
                    })
                    const transactionDetails = await Promise.all(pendingTransactionPromises)
                    setPendingTransactions(transactionDetails)
                })
                .catch((e) => console.error(e))
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
            setRefresh(false)
        }
    }

    const onRefresh = () => {
        setRefresh(true)
        fetchUserPendingTransactions()
    }

    useEffect(() => {
        fetchUserPendingTransactions()
    }, [])


    return (
        <View style={{display: 'flex', flex: 1, paddingTop: insets.top, paddingHorizontal: 14}}>
            <Text style={{fontSize: 28, fontWeight: '700', color: 'white', paddingVertical: 14, alignItems: 'center'}}>
                Pending Payments
            </Text>
            {loading ? (
                <ActivityIndicator style={{marginTop: 20}} size={'small'} color={Colors.NIGHT_GREEN}/>
            ) : (
                <FlashList
                    data={pendingTransactions}
                    keyExtractor={({_id}) => _id}
                    estimatedItemSize={75}
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    showsVerticalScrollIndicator={false}
                    //ListEmptyComponent={NoResults}
                    removeClippedSubviews={false}
                    renderItem={({item}) => (
                        <TransactionItem item={item}/>
                    )}
                />
            )}
        </View>
    )
}

export default PendingTransactionsView