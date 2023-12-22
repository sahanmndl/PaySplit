import React, {useEffect, useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import Colors from "../../utils/Colors";
import axios from "axios";
import {BASE_API_URL} from "../../utils/Constants";

const TransactionItem = ({item}) => {

    const [participantNames, setParticipantNames] = useState([])
    const [creator, setCreator] = useState(null)

    const fetchUserDetails = async (userId: String) => {
        try {
            const response = await axios.post(`http://${BASE_API_URL}:8008/api/user/userDetails`, {userId: userId})
            if (userId === item.creatorId) {
                setCreator(response.data.user)
            } else {
                return response.data.user
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const fetchParticipantDetails = async () => {
        const participantDetailsPromises = item.participants.map(async (participant) => {
            const user = await fetchUserDetails(participant.userId);
            return user ? user.name : 'Unknown User'
        })
        const participantNames = await Promise.all(participantDetailsPromises)
        setParticipantNames(participantNames);
    }

    useEffect(() => {
        fetchParticipantDetails() && fetchUserDetails(item.creatorId)
    }, [])

    return (
        <TouchableOpacity style={{
            width: '100%',
            minHeight: 128,
            backgroundColor: Colors.DARK,
            marginBottom: 24,
            borderRadius: 8,
            elevation: 4,
            display: 'flex',
            padding: 12
        }}>
            <View
                style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 20, fontWeight: '700', color: 'white'}}>
                    {item.title}
                </Text>
                <Text style={{fontSize: 18, fontWeight: '500', color: 'white'}}>
                    ₹ {item.totalAmount}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default TransactionItem