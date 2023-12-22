import React, {useState} from "react";
import {ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useNavigation, useRoute} from "@react-navigation/core";
import ItemSeparator from "../../../components/list-items/ItemSeparator";
import TransactionMemberItem from "../../../components/list-items/TransactionMemberItem";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../../../utils/Colors";
import TextButton from "../../../components/buttons/TextButton";
import {TextInput} from "react-native-paper";
import {useCurrentUserStore} from "../../../store";
import axios from "axios";
import {BASE_API_URL} from "../../../utils/Constants";
import {Toast} from "toastify-react-native";

const CreateTransactionView = () => {

    let {currentUser} = useCurrentUserStore()

    const insets = useSafeAreaInsets()
    const route = useRoute()
    const navigation = useNavigation()

    let {selectedMembers, totalAmount, groupId} = route.params
    totalAmount = parseFloat(totalAmount)

    const [title, setTitle] = useState("")
    const [participants, setParticipants] = useState(() =>
        selectedMembers.map((member) => ({
            userId: member._id,
            amount: 0.0,
            paid: false,
        }))
    )
    const [loading, setLoading] = useState(false)

    const createTransaction = async () => {
        let sum = 0.0
        participants.map((p) => sum += p.amount)

        if (title.trim() === "") {
            Alert.alert("Error!", "Please enter name of the bill")
        } else if (participants.some((participant) => participant.amount < 0)) {
            Alert.alert("Error!", "Please enter correct amount")
        } else if (sum > totalAmount) {
            Alert.alert("Error!", "Sum of participant amounts cannot be greater than total amount");
        } else {
            try {
                setLoading(true)
                const requestBody = {
                    creatorId: currentUser._id,
                    groupId: groupId,
                    title: title.trim(),
                    totalAmount: totalAmount,
                    participants: participants
                }
                console.log(requestBody)
                await axios.post(`http://${BASE_API_URL}:8008/api/group/createTransaction`, requestBody)
                    .then((response) => {
                        console.log("SUCCESS CREATE TRANSACTION: ", response.data)
                        Toast.success("New bill created")
                        navigation.goBack()
                    })
                    .catch((e) => {
                        console.error("ERROR CREATE TRANSACTION: ", e.response.message)
                        Alert.alert("Error!", "Couldn't process query! Please try again");
                    })
            } catch (e) {
                console.error("ERROR CREATE TRANSACTION: ", e.message)
                Alert.alert("Error!", "Couldn't process query! Please try again");
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <View style={{display: 'flex', flex: 1, paddingTop: insets.top}}>
            <View style={{display: 'flex', flexDirection: 'row', flex: 0.1, alignItems: 'center'}}>
                <TouchableOpacity style={{flex: 0.2}} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-sharp" size={34} color={Colors.TEAL}/>
                </TouchableOpacity>
                <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: 'white',
                    textAlign: 'center',
                    flex: 0.6,
                }}>
                    Split Bill
                </Text>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 0.2
                }}>
                    {loading ? (
                        <ActivityIndicator size={'small'} color={Colors.BLUE}/>
                    ) : (
                        <TextButton
                            btnText={"Save"}
                            isDisabled={title.trim() === ""}
                            handleFunction={() => createTransaction()}
                        />
                    )}
                </View>
            </View>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                flex: 0.1,
                alignItems: 'center',
                paddingHorizontal: 8,
                marginTop: 10,
                marginBottom: 5
            }}>
                <TextInput
                    style={styles.textInput}
                    dense={true}
                    mode='outlined'
                    textColor={'white'}
                    keyboardType={'twitter'}
                    placeholder="Title"
                    placeholderTextColor={Colors.DARK_GRAY}
                    maxLength={128}
                    outlineColor={Colors.DARK_GRAY}
                    activeOutlineColor={Colors.TEAL}
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                />
                <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: 'white',
                    textAlign: 'center',
                    flex: 0.35,
                }}>
                    ₹{totalAmount.toString()}
                </Text>
            </View>
            <FlatList
                style={{flex: 0.8}}
                data={selectedMembers}
                keyExtractor={({_id}) => _id}
                showsVerticalScrollIndicator={false}
                //ListEmptyComponent={NoResults}
                ItemSeparatorComponent={ItemSeparator}
                initialNumToRender={20}
                removeClippedSubviews={false}
                renderItem={({item}) => (
                    <TransactionMemberItem
                        item={item}
                        participants={participants}
                        setParticipants={setParticipants}
                    />
                )}
            />
        </View>
    )
}

export default CreateTransactionView

const styles = StyleSheet.create({
    textInput: {
        flex: 0.65,
        borderRadius: 4,
        backgroundColor: Colors.DARK,
        color: 'white',
    },
})