import React, {useEffect, useState} from "react";
import {ActivityIndicator, Alert, SafeAreaView, StyleSheet, TouchableOpacity} from "react-native";
import {ParamListBase, useIsFocused, useNavigation, useRoute} from "@react-navigation/core";
import axios from "axios";
import {BASE_API_URL} from "../../../utils/Constants";
import ItemSeparator from "../../../components/list-items/ItemSeparator";
import MemberItem from "../../../components/list-items/MemberItem";
import Colors from "../../../utils/Colors";
import {Feather} from "@expo/vector-icons";
import {FlashList} from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StackNavigationProp} from "@react-navigation/stack";
import NoResultsView from "../../../components/list-items/NoResultsView";

const GroupMembers = () => {

    const route = useRoute()
    const focused = useIsFocused()
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>()

    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [members, setMembers] = useState([])

    const {groupId} = route.params

    const fetchUserDetails = async (userId: String) => {
        try {
            const response = await axios.post(`http://${BASE_API_URL}:8008/api/user/userDetails`, {userId: userId})
            return response.data.user
        } catch (e) {
            console.error(e)
        }
    }

    const fetchGroupMembers = async () => {
        try {
            setCurrentUser(JSON.parse(await AsyncStorage.getItem('user')))
            setLoading(true)
            await axios.post(`http://${BASE_API_URL}:8008/api/group/groupDetails`, {groupId: groupId})
                .then(async (response) => {
                    const groupMembersPromises = response.data.group.members.map(async (userId: String) => {
                        return await fetchUserDetails(userId)
                    })
                    const memberDetails = await Promise.all(groupMembersPromises)
                    setMembers(memberDetails)
                })
                .catch((e) => {
                    console.error("GROUP MEMBERS ERROR: ", e.response.data.message)
                    Alert.alert("Error!", e.response.data.message)
                })
        } catch (e) {
            console.error("GROUP MEMBERS ERROR: ", e.response.data.message)
            Alert.alert("Error!", e.response.data.message)
        } finally {
            setRefresh(false)
            setLoading(false)
        }
    }

    const onRefresh = () => {
        setRefresh(true)
        fetchGroupMembers()
    }

    useEffect(() => {
        focused && fetchGroupMembers()
    }, [focused])

    const filteredMembers = members.filter((member) => member._id !== currentUser._id)

    return (
        <SafeAreaView style={{display: 'flex', flex: 1}}>
            {loading ? (
                <ActivityIndicator style={{marginTop: 20}} size={'small'} color={Colors.NIGHT_GREEN}/>
            ) : (
                <FlashList
                    data={members}
                    keyExtractor={({_id}) => _id}
                    estimatedItemSize={75}
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<NoResultsView type={3}/>}
                    ItemSeparatorComponent={ItemSeparator}
                    removeClippedSubviews={false}
                    renderItem={({item}) => (
                        <MemberItem item={item}/>
                    )}
                />
            )}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => requestAnimationFrame(() => {
                    navigation.navigate('TransactionRoute', {
                        allMembers: filteredMembers,
                        groupId: groupId
                    })
                })}
            >
                <Feather name='plus' size={26} color='#FFF'/>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default GroupMembers

const styles = StyleSheet.create({
    fab: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 63,
        height: 63,
        position: 'absolute',
        bottom: 40,
        right: 28,
        backgroundColor: Colors.BLUE,
        borderRadius: 100,
        elevation: 2,
    },
})