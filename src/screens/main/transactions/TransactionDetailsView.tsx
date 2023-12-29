import React, {useEffect, useState} from "react";
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useRoute} from "@react-navigation/core";
import Colors from "../../../utils/Colors";
import axios from "axios";
import {BASE_API_URL} from "../../../utils/Constants";

const TransactionDetailsView = () => {

    const route = useRoute()
    const {transactionId, currentUser} = route.params

    const [details, setDetails] = useState([])
    const [loading, setLoading] = useState(false)
    const [transaction, setTransaction] = useState(null)

    const fetchUserDetails = async (p) => {
        try {
            const response = await axios.post(`http://${BASE_API_URL}:8008/api/user/userDetails`, {
                userId: p.userId
            })
            return {name: response.data.user.name, userId: p.userId, amount: p.amount, paid: p.paid}
        } catch (e) {
            console.error(e)
            return null
        }
    }

    const createDetails = async () => {
        try {
            setLoading(true)
            await axios.post(`http://${BASE_API_URL}:8008/api/group/transactionDetails`, {
                transactionId: transactionId,
                userId: currentUser._id
            })
                .then(async (response) => {
                    const detailsPromise = await response.data.transaction.participants.map(async (p) => {
                        return await fetchUserDetails(p)
                    })
                    const dets = await Promise.all(detailsPromise)
                    setTransaction(response.data.transaction)
                    setDetails(dets)
                })
                .catch((e) => console.error(e))
        } catch (e) {
            console.error(e);
            Alert.alert("Error!", "Couldn't process query! Please try again");
        } finally {
            setLoading(false)
        }
    }

    const settleTransaction = async () => {
        try {
            await axios.post(`http://${BASE_API_URL}:8008/api/group/settleTransaction`, {
                userId: currentUser._id,
                transactionId: transactionId
            })
                .then((response) => {
                    createDetails()
                })
                .catch((e) => {
                    console.error("ERROR BILL SETTLE: ", e)
                    Alert.alert("Error!", "Couldn't process query! Please try again");
                })
        } catch (e) {
            console.error("ERROR BILL SETTLE: ", e)
            Alert.alert("Error!", "Couldn't process query! Please try again");
        }
    }

    useEffect(() => {
        createDetails()
    }, [])

    return (
        <ScrollView
            contentContainerStyle={{
                flex: 1,
                padding: 15
            }}
            keyboardShouldPersistTaps={'never'}
            showsVerticalScrollIndicator={false}
        >
            {loading ? (
                    <ActivityIndicator color={Colors.NIGHT_GREEN} size={'small'}/>
                ) :
                transaction && details.length > 0 ? (
                    <>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                            <Text
                                style={{fontSize: 18, fontWeight: '700', color: 'white', display: 'flex', flex: 0.75}}>
                                {transaction.title}
                            </Text>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '500',
                                color: 'white',
                                display: 'flex',
                                flex: 0.25,
                                textAlign: 'right'
                            }}>
                                ₹ {transaction.totalAmount}
                            </Text>
                        </View>
                        <View style={{marginVertical: 20}}/>
                        {details.map((it) => (
                            <>
                                <View style={{
                                    display: 'flex',
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    maxHeight: 75
                                }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '400',
                                        color: it.userId === currentUser._id ? Colors.NIGHT_GREEN : 'white',
                                        display: 'flex',
                                        flex: 0.5
                                    }}
                                          numberOfLines={1}
                                    >
                                        {it.name}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '500',
                                            color: it.userId === currentUser._id ? Colors.NIGHT_GREEN : 'white',
                                            display: 'flex',
                                            flex: 0.25,
                                            textAlign: 'left'
                                        }}
                                    >
                                        ₹ {it.amount}
                                    </Text>
                                    {it.userId === currentUser._id ? (
                                        <TouchableOpacity style={styles.btn} onPress={() => settleTransaction()}>
                                            <Text style={styles.btnText}>{it.paid ? "Undo" : "Settle"}</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: '500',
                                            color: 'white',
                                            display: 'flex',
                                            flex: 0.25,
                                            textAlign: 'right'
                                        }}>
                                            {it.paid ? "Settled" : "Not settled"}
                                        </Text>
                                    )}
                                </View>
                                <View style={{
                                    backgroundColor: Colors.DARK_GRAY,
                                    height: StyleSheet.hairlineWidth,
                                }}/>
                            </>

                        ))}
                    </>
                ) : (
                    <Text style={{fontSize: 15, fontWeight: '500', color: Colors.BLUE}}>
                        Please refresh...
                    </Text>
                )}
        </ScrollView>
    )
}

export default TransactionDetailsView

const styles = StyleSheet.create({
    btnText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
        textAlign: 'center'
    },
    btn: {
        display: 'flex',
        flex: 0.25,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Colors.NIGHT_GREEN,
        padding: 4,
        backgroundColor: Colors.NIGHT_GREEN
    }
})