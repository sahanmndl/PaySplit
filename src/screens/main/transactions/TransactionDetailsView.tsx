import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/core";
import Colors from "../../../utils/Colors";
import axios from "axios";
import {BASE_API_URL} from "../../../utils/Constants";
import ImageButton from "../../../components/buttons/ImageButton";
import {Toast} from "toastify-react-native";

const TransactionDetailsView = () => {

    const route = useRoute()
    const navigation = useNavigation()
    const {transactionId, currentUser} = route?.params || {transactionId: "", currentUser: null}

    const [details, setDetails] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [creator, setCreator] = useState(null)
    const [transaction, setTransaction] = useState(null)

    let sum = 0.0

    const fetchUserDetails = async (p) => {
        try {
            const response = await axios.post(`http://${BASE_API_URL}:8008/api/user/userDetails`, {userId: p.userId})
            return {name: response.data.user.name, userId: p.userId, amount: p.amount, paid: p.paid}
        } catch (e) {
            console.error(e)
            return null
        }
    }

    const fetchCreatorDetails = async (userId: String) => {
        try {
            const response = await axios.post(`http://${BASE_API_URL}:8008/api/user/userDetails`, {userId: userId})
            setCreator(response.data.user)
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
                    const dp = await Promise.all(detailsPromise)
                    setTransaction(response.data.transaction)
                    setDetails(dp)
                    await fetchCreatorDetails(response.data.transaction.creatorId)
                })
                .catch((e) => {
                    console.error("TRANSACTION DETAILS ERROR: ", e.response.data.message)
                    Alert.alert("Error!", e.response.data.message)
                })
        } catch (e) {
            console.error("TRANSACTION DETAILS ERROR: ", e.response.data.message)
            Alert.alert("Error!", e.response.data.message)
        } finally {
            setLoading(false)
            setRefresh(false)
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
                    Alert.alert("Error!", e.response.data.message)
                })
        } catch (e) {
            console.error("ERROR BILL SETTLE: ", e)
            Alert.alert("Error!", e.response.data.message)
        }
    }

    const deleteTransaction = async () => {
        try {
            const requestBody = {
                transactionId: transactionId,
                creatorId: creator._id,
                groupId: transaction.groupId
            }
            await axios.post(`http://${BASE_API_URL}:8008/api/group/deleteTransaction`, requestBody)
                .then((response) => {
                    Toast.success("Bill deleted!")
                    navigation.goBack()
                })
                .catch((e) => {
                    console.error("ERROR DELETE BILL: ", e.response.data)
                    Alert.alert("Error!", e.response.data.message)
                })
        } catch (e) {
            console.error("ERROR BILL SETTLE: ", e.response.data)
            Alert.alert("Error!", e.response.data.message)
        }
    }

    const logoutAlert = () => {
        Alert.alert(
            "Confirmation", "Do you want to delete this bill?",
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log("Cancel"),
                    style: "cancel",
                },
                {
                    text: 'Yes',
                    onPress: () => deleteTransaction()
                }
            ],
            {cancelable: true}
        )
    }

    const onRefresh = () => {
        setRefresh(true)
        createDetails()
    }

    useEffect(() => {
        createDetails()
    }, [])

    if (transaction) {
        transaction.participants.map((p) => sum += p.amount)
    }

    return (
        <ScrollView
            contentContainerStyle={{
                flex: 1,
                padding: 10
            }}
            keyboardShouldPersistTaps={'never'}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={onRefresh} enabled={true}/>
            }
        >
            {loading || !transaction || !creator ? (
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
                                fontWeight: '700',
                                color: 'white',
                                display: 'flex',
                                flex: 0.25,
                                textAlign: 'right'
                            }}>
                                ₹ {transaction.totalAmount}
                            </Text>
                        </View>
                        {creator._id === currentUser._id ? (
                            <View style={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                maxHeight: 30,
                                marginTop: 10
                            }}>
                                <ImageButton
                                    btnText={'delete'}
                                    handleFunction={() => logoutAlert()}
                                    color={Colors.NIGHT_RED}
                                    isLoading={false}
                                    size={24}
                                />
                            </View>
                        ) : null}
                        {creator ? (
                            <View style={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                maxHeight: 60,
                                marginTop: 10
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '400',
                                    color: transaction.creatorId === currentUser._id ? Colors.NIGHT_GREEN : 'white',
                                    display: 'flex',
                                    flex: 0.5
                                }}
                                      numberOfLines={1}
                                >
                                    {creator.name}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '500',
                                        color: 'white',
                                        display: 'flex',
                                        flex: 0.25,
                                        textAlign: 'left'
                                    }}
                                >
                                    ₹ {transaction.totalAmount - sum}
                                </Text>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: 'white',
                                    display: 'flex',
                                    flex: 0.25,
                                    textAlign: 'right'
                                }}>
                                    Paid
                                </Text>
                            </View>
                        ) : null}
                        <View style={{marginVertical: 5}}/>
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
                                            color: it.paid ? Colors.NIGHT_GREEN : Colors.NIGHT_RED,
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