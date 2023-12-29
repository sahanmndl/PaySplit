import React, {useEffect, useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import Colors from "../../utils/Colors";
import axios from "axios";
import {BASE_API_URL} from "../../utils/Constants";
import ViewMoreText from 'react-native-view-more-text';
import {useNavigation} from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TransactionItem = ({item}) => {

    const [currentUser, setCurrentUser] = useState(null)

    const navigation = useNavigation()
    const [participantNames, setParticipantNames] = useState([])
    const [userIsParticipant, setUserIsParticipant] = useState(false)
    const [creator, setCreator] = useState(null)

    const renderViewMore = (onPress) => <Text style={{color: Colors.BLUE}} onPress={onPress}>View more</Text>;
    const renderViewLess = (onPress) => <Text style={{color: Colors.BLUE}} onPress={onPress}>View less</Text>;

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
        setCurrentUser(JSON.parse(await AsyncStorage.getItem('user')))
        const participantDetailsPromises = item.participants.map(async (participant) => {
            const user = await fetchUserDetails(participant.userId);
            return user ? user.name : 'Unknown User'
        })
        const participantNames = await Promise.all(participantDetailsPromises)
        setParticipantNames(participantNames)

        const isParticipant = item.participants.some((p) => p.userId === currentUser._id)
        setUserIsParticipant(isParticipant)
    }

    useEffect(() => {
        fetchParticipantDetails() && fetchUserDetails(item.creatorId)
    }, [])

    return (
        <TouchableOpacity
            style={{
                width: '100%',
                minHeight: 128,
                backgroundColor: Colors.DARK,
                marginBottom: 24,
                borderRadius: 8,
                elevation: 4,
                display: 'flex',
                padding: 12
            }}
            onPress={() => requestAnimationFrame(() => {
                navigation.navigate('TransactionDetailsView', {
                    transactionId: item._id,
                    currentUser: currentUser
                })
            })}
        >
            {item && currentUser && creator ? (
                <>
                    <View
                        style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                        <Text style={{fontSize: 18, fontWeight: '700', color: 'white', display: 'flex', flex: 0.75}}
                              numberOfLines={3}>
                            {item.title}
                        </Text>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '500',
                            color: 'white',
                            display: 'flex',
                            flex: 0.25,
                            textAlign: 'right'
                        }}>
                            ₹ {item.totalAmount}
                        </Text>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
                        <Text style={{fontWeight: '300', color: 'white', fontSize: 15}}>
                            Created by{" "}
                        </Text>
                        <Text style={{
                            fontWeight: currentUser._id === item.creatorId ? '500' : '400',
                            color: currentUser._id === item.creatorId ? Colors.NIGHT_GREEN : 'white',
                            fontSize: 15
                        }}>
                            {currentUser._id === item.creatorId ? 'You' : creator.name}{" "}
                        </Text>
                        <Text style={{fontWeight: '300', color: 'white', fontSize: 15}}>
                            on{" "}
                        </Text>
                        <Text style={{fontWeight: '300', color: 'white', fontSize: 15}}>
                            {new Date(item.createdAt).toDateString()}
                        </Text>
                    </View>
                    <Text style={{fontWeight: '300', color: 'white', fontSize: 15}}>
                        Bill split among:
                    </Text>
                    <ViewMoreText
                        numberOfLines={3}
                        renderViewMore={renderViewMore}
                        renderViewLess={renderViewLess}
                    >
                        <Text style={{fontWeight: '400', color: 'white', fontSize: 15}}>
                            {participantNames.join(', ')}
                        </Text>
                    </ViewMoreText>
                    {userIsParticipant ? (
                        <Text style={{fontWeight: '400', color: Colors.NIGHT_GREEN, fontSize: 15, marginTop: 14}}>
                            You are included in this bill
                        </Text>
                    ) : null}
                </>
            ) : (
                <Text style={{fontSize: 15, fontWeight: '500', color: Colors.BLUE}}>
                    Loading...
                </Text>
            )}
        </TouchableOpacity>
    )
}

export default TransactionItem