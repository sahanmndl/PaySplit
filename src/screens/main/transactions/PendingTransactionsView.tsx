import React, {useEffect, useState} from "react";
import {ActivityIndicator, Text, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import axios from "axios";
import {BASE_API_URL, ON_LOAD, ON_REFRESH} from "../../../utils/Constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../../utils/Colors";
import {FlashList} from "@shopify/flash-list";
import TransactionItem from "../../../components/list-items/TransactionItem";
import NoResultsView from "../../../components/list-items/NoResultsView";

const PendingTransactionsView = () => {

    let currentUser = null
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [pendingTransactions, setPendingTransactions] = useState([])

    const fetchUserPendingTransactions = async (getType: String) => {
        try {
            setLoading(true)
            currentUser = JSON.parse(await AsyncStorage.getItem('user'))
            const requestBody = {
                userId: currentUser._id,
                getType: getType
            }
            await axios.post(`http://${BASE_API_URL}:8008/api/user/userPendingTransactions`, requestBody)
                .then((response) => setPendingTransactions(response.data.pendingTransactions))
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
        fetchUserPendingTransactions(ON_REFRESH)
    }

    useEffect(() => {
        fetchUserPendingTransactions(ON_LOAD)
    }, [])

    return (
        <View style={{display: 'flex', flex: 1, paddingTop: insets.top, paddingHorizontal: 10}}>
            <Text style={{fontSize: 28, fontWeight: '700', color: 'white', paddingVertical: 15, alignItems: 'center'}}>
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
                    ListEmptyComponent={<NoResultsView type={1}/>}
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