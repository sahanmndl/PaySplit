import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import UserAvatar from 'react-native-user-avatar';
import Colors from "../../utils/Colors";
import {TextInput} from "react-native-paper";

const TransactionMemberItem = ({item, participants, setParticipants}) => {

    const [amount, setAmount] = useState("")

    const handleAmountChange = (amount) => {
        setAmount(amount);
        setParticipants((prevParticipants) =>
            prevParticipants.map((participant) =>
                participant.userId === item._id
                    ? {...participant, amount: parseFloat(amount)}
                    : participant
            )
        )
    }

    return (
        <TouchableOpacity style={{borderRadius: 8, elevation: 4, minHeight: 75}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 0.15, alignItems: 'center', justifyContent: 'center'}}>
                    <UserAvatar size={48} name={item.name} bgColors={['#ffffff', '#606060', '#ef78b4']}/>
                </View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flex: 0.55,
                    paddingStart: 8,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
                    <Text style={{color: 'white', fontWeight: '600', fontSize: 17}}>
                        {item.name}
                    </Text>
                </View>
                <View style={{
                    display: 'flex',
                    flex: 0.3,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <TextInput
                        style={styles.textInput}
                        dense={true}
                        mode='outlined'
                        textColor={'white'}
                        keyboardType={'numeric'}
                        placeholder="₹ Amount"
                        placeholderTextColor={Colors.DARK_GRAY}
                        maxLength={64}
                        outlineColor={Colors.DARK_GRAY}
                        activeOutlineColor={Colors.TEAL}
                        value={amount}
                        onChangeText={handleAmountChange}
                    />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default TransactionMemberItem

const styles = StyleSheet.create({
    textInput: {
        width: '90%',
        borderRadius: 4,
        backgroundColor: Colors.DARK,
        color: 'white',
    },
})